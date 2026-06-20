import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { isUserAdmin } from "@/lib/adminUtils";
import { backendClient } from "@/sanity/lib/backendClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type OrderProduct = {
  quantity?: number;
  product?: {
    _id?: string;
    name?: string;
    price?: number;
    slug?: { current?: string };
    images?: unknown[];
  };
};

type AnalyticsOrder = {
  _id: string;
  orderNumber?: string;
  customerName?: string;
  email?: string;
  totalPrice?: number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  orderDate?: string;
  products?: OrderProduct[];
};

type LowStockProduct = {
  _id: string;
  name?: string;
  stock?: number;
  price?: number;
  slug?: { current?: string };
};

type DailyMetric = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

const LOW_STOCK_THRESHOLD = 5;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + 1);
  next.setMilliseconds(next.getMilliseconds() - 1);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function isRevenueOrder(order: AnalyticsOrder) {
  if (!order.totalPrice || order.status === "cancelled") return false;
  if (!order.paymentStatus) return true;
  return order.paymentStatus === "paid";
}

function sumRevenue(orders: AnalyticsOrder[]) {
  return orders.reduce(
    (sum, order) => (isRevenueOrder(order) ? sum + (order.totalPrice || 0) : sum),
    0
  );
}

function countStatus(orders: AnalyticsOrder[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

function normalizeOrderDate(order: AnalyticsOrder) {
  if (!order.orderDate) return null;
  const date = new Date(order.orderDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildDailyMetrics(orders: AnalyticsOrder[], today: Date) {
  const start = startOfDay(today);
  start.setDate(start.getDate() - 29);

  const metrics = new Map<string, DailyMetric>();

  for (let offset = 0; offset < 30; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const key = getDateKey(date);
    metrics.set(key, {
      date: key,
      label: formatDayLabel(date),
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    const date = normalizeOrderDate(order);
    if (!date || date < start || date > endOfDay(today)) continue;

    const key = getDateKey(date);
    const metric = metrics.get(key);
    if (!metric) continue;

    metric.orders += 1;
    if (isRevenueOrder(order)) {
      metric.revenue += order.totalPrice || 0;
    }
  }

  return Array.from(metrics.values()).map((metric) => ({
    ...metric,
    revenue: Number(metric.revenue.toFixed(2)),
  }));
}

function buildTopProducts(orders: AnalyticsOrder[]) {
  const productMap = new Map<
    string,
    {
      productId: string;
      name: string;
      unitsSold: number;
      revenue: number;
      slug?: string;
      image?: unknown;
    }
  >();

  for (const order of orders) {
    if (!isRevenueOrder(order)) continue;

    for (const item of order.products || []) {
      const product = item.product;
      const productId = product?._id || product?.name || "unknown";
      const quantity = item.quantity || 0;
      const unitPrice = product?.price || 0;

      if (!quantity) continue;

      const existing =
        productMap.get(productId) ||
        {
          productId,
          name: product?.name || "Unknown product",
          unitsSold: 0,
          revenue: 0,
          slug: product?.slug?.current,
          image: product?.images?.[0],
        };

      existing.unitsSold += quantity;
      existing.revenue += unitPrice * quantity;
      productMap.set(productId, existing);
    }
  }

  return Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map((product, index) => ({
      ...product,
      rank: index + 1,
      revenue: Number(product.revenue.toFixed(2)),
    }));
}

function buildRecentOrders(orders: AnalyticsOrder[]) {
  return [...orders]
    .sort((a, b) => {
      const aDate = normalizeOrderDate(a)?.getTime() || 0;
      const bDate = normalizeOrderDate(b)?.getTime() || 0;
      return bDate - aDate;
    })
    .slice(0, 10)
    .map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber || order._id.slice(0, 8),
      customerName: order.customerName || "Customer",
      email: order.email || "",
      totalPrice: order.totalPrice || 0,
      currency: order.currency || "INR",
      status: order.status || "pending",
      paymentStatus: order.paymentStatus || "pending",
      orderDate: order.orderDate || "",
      itemCount: (order.products || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
    }));
}

function calculateChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = endOfDay(yesterdayStart);
    const monthStart = startOfMonth(today);
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
    const chartStart = new Date(todayStart);
    chartStart.setDate(chartStart.getDate() - 29);

    const [
      orders,
      lowStockProducts,
      lowStockCount,
      outOfStockCount,
      totalProducts,
      totalCustomers,
      totalReviews,
      pendingReviews,
      totalCoupons,
      activeCoupons,
      totalSubscribers,
      aiStylistUsage,
    ] = await Promise.all([
      backendClient.fetch<AnalyticsOrder[]>(
        `*[_type == "order"]{
          _id,
          orderNumber,
          customerName,
          email,
          totalPrice,
          currency,
          status,
          paymentStatus,
          paymentMethod,
          orderDate,
          products[]{
            quantity,
            product->{
              _id,
              name,
              price,
              slug,
              images
            }
          }
        }`
      ),
      backendClient.fetch<LowStockProduct[]>(
        `*[_type == "product" && defined(stock) && stock <= $threshold] | order(stock asc, name asc)[0...20]{
          _id,
          name,
          stock,
          price,
          slug
        }`,
        { threshold: LOW_STOCK_THRESHOLD }
      ),
      backendClient.fetch<number>(
        `count(*[_type == "product" && defined(stock) && stock <= $threshold])`,
        { threshold: LOW_STOCK_THRESHOLD }
      ),
      backendClient.fetch<number>(
        `count(*[_type == "product" && defined(stock) && stock <= 0])`
      ),
      backendClient.fetch<number>(`count(*[_type == "product"])`),
      clerk.users.getCount().catch(() => 0),
      backendClient.fetch<number>(`count(*[_type == "review"])`),
      backendClient.fetch<number>(`count(*[_type == "review" && status == "pending"])`),
      backendClient.fetch<number>(`count(*[_type == "coupon"])`),
      backendClient.fetch<number>(`count(*[_type == "coupon" && isActive == true])`),
      backendClient.fetch<number>(`count(*[_type == "subscription" && status == "active"])`),
      backendClient.fetch<number>(
        `count(*[_type == "analyticsEvent" && eventName match "ai*"])`
      ).catch(() => 0),
    ]);

    const orderDateInRange = (order: AnalyticsOrder, start: Date, end: Date) => {
      const date = normalizeOrderDate(order);
      return Boolean(date && date >= start && date <= end);
    };

    const todayOrders = orders.filter((order) =>
      orderDateInRange(order, todayStart, todayEnd)
    );
    const yesterdayOrders = orders.filter((order) =>
      orderDateInRange(order, yesterdayStart, yesterdayEnd)
    );
    const monthOrders = orders.filter((order) =>
      orderDateInRange(order, monthStart, todayEnd)
    );
    const previousMonthOrders = orders.filter((order) =>
      orderDateInRange(order, previousMonthStart, previousMonthEnd)
    );
    const last30DayOrders = orders.filter((order) =>
      orderDateInRange(order, chartStart, todayEnd)
    );

    const revenueToday = sumRevenue(todayOrders);
    const revenueYesterday = sumRevenue(yesterdayOrders);
    const revenueThisMonth = sumRevenue(monthOrders);
    const revenuePreviousMonth = sumRevenue(previousMonthOrders);
    const totalRevenue = sumRevenue(orders);

    const deliveredOrders = countStatus(orders, "delivered");
    const pendingOrders = orders.filter((order) =>
      ["pending", "confirmed", "processing", "shipped"].includes(
        order.status || "pending"
      )
    ).length;
    const cancelledOrders = countStatus(orders, "cancelled");
    const dailyMetrics = buildDailyMetrics(orders, today);
    const topProducts = buildTopProducts(orders);
    const recentOrders = buildRecentOrders(orders);

    const result = {
      generatedAt: new Date().toISOString(),
      currency: "INR",
      cards: {
        revenueToday: Number(revenueToday.toFixed(2)),
        revenueThisMonth: Number(revenueThisMonth.toFixed(2)),
        totalOrders: orders.length,
        totalCustomers,
        totalProducts,
        totalReviews,
        pendingReviews,
        totalCoupons,
        activeCoupons,
        totalSubscribers,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts: lowStockCount,
        aiStylistUsage,
      },
      changes: {
        revenueToday: calculateChange(revenueToday, revenueYesterday),
        revenueThisMonth: calculateChange(
          revenueThisMonth,
          revenuePreviousMonth
        ),
      },
      charts: {
        revenueLast30Days: dailyMetrics.map((metric) => ({
          date: metric.date,
          label: metric.label,
          revenue: metric.revenue,
        })),
        ordersLast30Days: dailyMetrics.map((metric) => ({
          date: metric.date,
          label: metric.label,
          orders: metric.orders,
        })),
      },
      tables: {
        topSellingProducts: topProducts,
        recentOrders,
        lowStockProducts: lowStockProducts.map((product) => ({
          id: product._id,
          name: product.name || "Untitled product",
          stock: product.stock || 0,
          price: product.price || 0,
          slug: product.slug?.current,
        })),
        quickActions: {
          lowStockProducts: lowStockProducts.slice(0, 5).map((product) => ({
            id: product._id,
            title: product.name || "Untitled product",
            description: `${product.stock || 0} in stock`,
            href: `/admin/products?search=${encodeURIComponent(product.name || "")}`,
            action: "Restock",
          })),
          pendingOrders: recentOrders
            .filter((order) => ["pending", "confirmed", "processing"].includes(order.status))
            .slice(0, 5)
            .map((order) => ({
              id: order.id,
              title: order.orderNumber,
              description: `${order.customerName} - ₹${order.totalPrice}`,
              href: "/admin/orders",
              action: "Open Order",
            })),
        },
      },
      revenue: {
        total: Number(totalRevenue.toFixed(2)),
        change: calculateChange(revenueThisMonth, revenuePreviousMonth),
        trend: dailyMetrics.map((metric) => metric.revenue),
      },
      orders: {
        total: orders.length,
        change: calculateChange(monthOrders.length, previousMonthOrders.length),
        pending: pendingOrders,
        completed: deliveredOrders,
        cancelled: cancelledOrders,
      },
      products: {
        total: totalProducts,
        change: 0,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
      },
      customers: {
        total: totalCustomers,
        change: 0,
        active: totalCustomers,
        new: 0,
      },
      topProducts: topProducts.map((product) => ({
        name: product.name,
        sales: product.unitsSold,
        revenue: product.revenue,
      })),
      recentActivity: recentOrders.map((order) => ({
        action: `Order ${order.orderNumber} ${order.status}`,
        time: order.orderDate,
        value: order.totalPrice,
      })),
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
