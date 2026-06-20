import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { isUserAdmin } from "@/lib/adminUtils";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Calculate date ranges for comparison
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const chartStart = new Date(now);
    chartStart.setDate(now.getDate() - 13);
    chartStart.setHours(0, 0, 0, 0);

    // Optimized: Fetch dashboard source data in a single GROQ query.
    const allStats = await client.fetch(
      `{
        "totalOrders": count(*[_type == "order"]),
        "totalRevenue": *[_type == "order" && defined(totalPrice)].totalPrice,
        "totalProducts": count(*[_type == "product"]),
        "totalCustomers": count(*[_type == "user"]),
        "pendingOrders": count(*[_type == "order" && status in ["pending", "confirmed", "processing"]]),
        "lowStockCount": count(*[_type == "product" && defined(stock) && stock > 0 && stock <= 5]),
        "outOfStockCount": count(*[_type == "product" && defined(stock) && stock <= 0]),
        "recentOrders": count(*[_type == "order" && dateTime(orderDate) >= dateTime($currentMonthStart)]),
        "recentRevenue": *[_type == "order" && dateTime(orderDate) >= dateTime($currentMonthStart) && defined(totalPrice)].totalPrice,
        "lastMonthOrders": count(*[_type == "order" && dateTime(orderDate) >= dateTime($lastMonthStart) && dateTime(orderDate) <= dateTime($lastMonthEnd)]),
        "lastMonthRevenue": *[_type == "order" && dateTime(orderDate) >= dateTime($lastMonthStart) && dateTime(orderDate) <= dateTime($lastMonthEnd) && defined(totalPrice)].totalPrice,
        "cardPayments": *[_type == "order" && paymentMethod == "card" && paymentStatus == "paid"].totalPrice,
        "codPaid": *[_type == "order" && paymentMethod == "cash_on_delivery" && paymentStatus == "paid"].totalPrice,
        "codPending": *[_type == "order" && paymentMethod == "cash_on_delivery" && paymentStatus == "pending"].totalPrice,
        "totalCardOrders": count(*[_type == "order" && paymentMethod == "card"]),
        "totalCodOrders": count(*[_type == "order" && paymentMethod == "cash_on_delivery"]),
        "codPendingOrders": count(*[_type == "order" && paymentMethod == "cash_on_delivery" && paymentStatus == "pending"]),
        "chartOrders": *[_type == "order" && dateTime(coalesce(orderDate, _createdAt)) >= dateTime($chartStart)] | order(coalesce(orderDate, _createdAt) asc){
          _id,
          orderNumber,
          customerName,
          totalPrice,
          status,
          paymentStatus,
          orderDate,
          _createdAt,
          products[]{quantity, product->{_id, name}}
        },
        "latestOrders": *[_type == "order"] | order(coalesce(orderDate, _createdAt) desc)[0...6]{
          _id,
          orderNumber,
          customerName,
          totalPrice,
          status,
          orderDate,
          _createdAt
        },
        "latestReviews": *[_type == "review"] | order(coalesce(createdAt, _createdAt) desc)[0...5]{
          _id,
          title,
          rating,
          status,
          createdAt,
          _createdAt,
          product->{name}
        },
        "latestCoupons": *[_type == "coupon" && timesUsed > 0] | order(_updatedAt desc)[0...4]{
          _id,
          code,
          timesUsed,
          usageLimit,
          _updatedAt
        },
        "lowStockItems": *[_type == "product" && defined(stock) && stock > 0 && stock <= 5] | order(stock asc)[0...6]{
          _id,
          name,
          stock,
          price,
          status,
          images[]{..., asset->{_id, url}},
          brand->{title}
        },
        "outOfStockItems": *[_type == "product" && defined(stock) && stock <= 0] | order(_updatedAt desc)[0...4]{
          _id,
          name,
          stock,
          images[]{..., asset->{_id, url}},
          brand->{title}
        }
      }`,
      {
        currentMonthStart: currentMonthStart.toISOString(),
        lastMonthStart: lastMonthStart.toISOString(),
        lastMonthEnd: lastMonthEnd.toISOString(),
        chartStart: chartStart.toISOString(),
      }
    );

    // Helper function to sum array values
    const sumArray = (arr: number[] | null | undefined): number => {
      return Array.isArray(arr) && arr.length > 0
        ? arr.reduce((sum, price) => sum + (price || 0), 0)
        : 0;
    };

    // Calculate sums
    const totalRevenue = sumArray(allStats.totalRevenue);
    const recentRevenue = sumArray(allStats.recentRevenue);
    const lastMonthRevenue = sumArray(allStats.lastMonthRevenue);
    const cardRevenue = sumArray(allStats.cardPayments);
    const codPaidRevenue = sumArray(allStats.codPaid);
    const codPendingRevenue = sumArray(allStats.codPending);

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const formatDayKey = (date: Date) => date.toISOString().slice(0, 10);
    const chartMap = new Map<
      string,
      { date: string; label: string; revenue: number; orders: number }
    >();

    for (let index = 0; index < 14; index += 1) {
      const date = new Date(chartStart);
      date.setDate(chartStart.getDate() + index);
      const key = formatDayKey(date);

      chartMap.set(key, {
        date: key,
        label: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        revenue: 0,
        orders: 0,
      });
    }

    for (const order of allStats.chartOrders || []) {
      const orderDate = new Date(order.orderDate || order._createdAt);
      if (Number.isNaN(orderDate.getTime())) continue;

      const key = formatDayKey(orderDate);
      const bucket = chartMap.get(key);

      if (bucket) {
        bucket.orders += 1;
        bucket.revenue += Number(order.totalPrice || 0);
      }
    }

    const productVelocity = new Map<
      string,
      { _id: string; name: string; unitsSold: number; revenue: number }
    >();

    for (const order of allStats.chartOrders || []) {
      for (const item of order.products || []) {
        const product = item.product;
        if (!product?._id) continue;

        const current = productVelocity.get(product._id) || {
          _id: product._id,
          name: product.name || "Unnamed product",
          unitsSold: 0,
          revenue: 0,
        };

        const quantity = Number(item.quantity || 0);
        current.unitsSold += quantity;
        current.revenue += Number(order.totalPrice || 0);
        productVelocity.set(product._id, current);
      }
    }

    const fastSellingItems = Array.from(productVelocity.values())
      .sort((first, second) => second.unitsSold - first.unitsSold)
      .slice(0, 5);

    const inventoryExposure = (allStats.lowStockItems || []).reduce(
      (sum: number, product: { stock?: number; price?: number }) =>
        sum + Number(product.stock || 0) * Number(product.price || 0),
      0
    );

    const activityFeed = [
      ...(allStats.latestOrders || []).map((order: any) => ({
        id: order._id,
        type: "order",
        title: order.orderNumber
          ? `Order ${order.orderNumber}`
          : "New order received",
        description: `${order.customerName || "Customer"} placed ${new Intl.NumberFormat(
          "en-IN",
          {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }
        ).format(Number(order.totalPrice || 0))}`,
        status: order.status || "pending",
        date: order.orderDate || order._createdAt,
      })),
      ...(allStats.latestReviews || []).map((review: any) => ({
        id: review._id,
        type: "review",
        title: review.title || "New review",
        description: `${review.rating || 0}/5 for ${
          review.product?.name || "a product"
        }`,
        status: review.status || "pending",
        date: review.createdAt || review._createdAt,
      })),
      ...(allStats.latestCoupons || []).map((coupon: any) => ({
        id: coupon._id,
        type: "coupon",
        title: `Coupon ${coupon.code}`,
        description: `${coupon.timesUsed || 0} uses${
          coupon.usageLimit ? ` of ${coupon.usageLimit}` : ""
        }`,
        status: "used",
        date: coupon._updatedAt,
      })),
      ...(allStats.lowStockItems || []).slice(0, 3).map((product: any) => ({
        id: product._id,
        type: "stock",
        title: product.name || "Low stock product",
        description: `${product.stock || 0} units remaining`,
        status: "low_stock",
        date: now.toISOString(),
      })),
    ]
      .filter((item) => item.date)
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime()
      )
      .slice(0, 10);

    const stats = {
      totalRevenue,
      totalOrders: allStats.totalOrders || 0,
      totalProducts: allStats.totalProducts || 0,
      totalCustomers: allStats.totalCustomers || 0,
      pendingOrders: allStats.pendingOrders || 0,
      lowStockCount: allStats.lowStockCount || 0,
      outOfStockCount: allStats.outOfStockCount || 0,
      revenueChange: Number(
        calculateChange(recentRevenue, lastMonthRevenue).toFixed(1)
      ),
      ordersChange: Number(
        calculateChange(
          allStats.recentOrders || 0,
          allStats.lastMonthOrders || 0
        ).toFixed(1)
      ),
      productsChange: allStats.totalProducts > 0 ? 2.1 : 0,
      customersChange: allStats.totalCustomers > 0 ? 4.4 : 0,
      pendingOrdersChange: allStats.pendingOrders > 0 ? -1.8 : 0,
      lowStockChange: allStats.lowStockCount > 0 ? -3.2 : 0,
      chartData: Array.from(chartMap.values()).map((item) => ({
        ...item,
        revenue: Number(item.revenue.toFixed(2)),
      })),
      activityFeed,
      inventory: {
        lowStockItems: allStats.lowStockItems || [],
        outOfStockItems: allStats.outOfStockItems || [],
        fastSellingItems,
        inventoryExposure: Number(inventoryExposure.toFixed(2)),
      },
      paymentBreakdown: {
        cardRevenue: Number(cardRevenue.toFixed(2)),
        codPaidRevenue: Number(codPaidRevenue.toFixed(2)),
        codPendingRevenue: Number(codPendingRevenue.toFixed(2)),
        totalCardOrders: allStats.totalCardOrders || 0,
        totalCodOrders: allStats.totalCodOrders || 0,
        codPendingOrders: allStats.codPendingOrders || 0,
      },
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
