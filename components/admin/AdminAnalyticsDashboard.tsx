"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Mail,
  Package,
  PackageSearch,
  Percent,
  RefreshCw,
  ShoppingCart,
  Star,
  Truck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AnalyticsResponse = {
  generatedAt: string;
  currency: string;
  cards: {
    revenueToday: number;
    revenueThisMonth: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    totalReviews: number;
    pendingReviews: number;
    totalCoupons: number;
    activeCoupons: number;
    totalSubscribers: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    lowStockProducts: number;
  };
  changes: {
    revenueToday: number;
    revenueThisMonth: number;
  };
  charts: {
    revenueLast30Days: Array<{
      date: string;
      label: string;
      revenue: number;
    }>;
    ordersLast30Days: Array<{
      date: string;
      label: string;
      orders: number;
    }>;
  };
  tables: {
    topSellingProducts: Array<{
      rank: number;
      productId: string;
      name: string;
      unitsSold: number;
      revenue: number;
      slug?: string;
    }>;
    recentOrders: Array<{
      id: string;
      orderNumber: string;
      customerName: string;
      email: string;
      totalPrice: number;
      currency: string;
      status: string;
      paymentStatus: string;
      orderDate: string;
      itemCount: number;
    }>;
    lowStockProducts: Array<{
      id: string;
      name: string;
      stock: number;
      price: number;
      slug?: string;
    }>;
    quickActions?: {
      lowStockProducts: Array<{
        id: string;
        title: string;
        description: string;
        href: string;
        action: string;
      }>;
      pendingOrders: Array<{
        id: string;
        title: string;
        description: string;
        href: string;
        action: string;
      }>;
    };
  };
};

type DashboardCardKey = keyof AnalyticsResponse["cards"];
type DashboardChangeKey = keyof AnalyticsResponse["changes"];

type DashboardCardConfig = {
  key: DashboardCardKey;
  title: string;
  icon: typeof IndianRupee;
  tone: string;
  format: "currency" | "number";
  changeKey?: DashboardChangeKey;
  href: string;
};

const cardConfig: DashboardCardConfig[] = [
  {
    key: "revenueToday",
    title: "Revenue Today",
    icon: IndianRupee,
    tone: "text-emerald-700 bg-emerald-50",
    format: "currency",
    changeKey: "revenueToday",
    href: "/admin/analytics",
  },
  {
    key: "revenueThisMonth",
    title: "Revenue This Month",
    icon: BarChart3,
    tone: "text-blue-700 bg-blue-50",
    format: "currency",
    changeKey: "revenueThisMonth",
    href: "/admin/analytics",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: ShoppingCart,
    tone: "text-slate-700 bg-slate-100",
    format: "number",
    href: "/admin/orders",
  },
  {
    key: "totalProducts",
    title: "Products",
    icon: Package,
    tone: "text-indigo-700 bg-indigo-50",
    format: "number",
    href: "/admin/products",
  },
  {
    key: "totalReviews",
    title: "Reviews",
    icon: Star,
    tone: "text-yellow-700 bg-yellow-50",
    format: "number",
    href: "/admin/reviews",
  },
  {
    key: "totalCoupons",
    title: "Coupons",
    icon: Percent,
    tone: "text-pink-700 bg-pink-50",
    format: "number",
    href: "/admin/coupons",
  },
  {
    key: "totalSubscribers",
    title: "Subscribers",
    icon: Mail,
    tone: "text-teal-700 bg-teal-50",
    format: "number",
    href: "/admin/subscriptions",
  },
  {
    key: "pendingOrders",
    title: "Pending Orders",
    icon: Clock3,
    tone: "text-amber-700 bg-amber-50",
    format: "number",
    href: "/admin/orders",
  },
  {
    key: "deliveredOrders",
    title: "Delivered Orders",
    icon: CheckCircle2,
    tone: "text-green-700 bg-green-50",
    format: "number",
    href: "/admin/orders",
  },
  {
    key: "cancelledOrders",
    title: "Cancelled Orders",
    icon: XCircle,
    tone: "text-red-700 bg-red-50",
    format: "number",
    href: "/admin/orders",
  },
  {
    key: "lowStockProducts",
    title: "Low Stock Products",
    icon: AlertTriangle,
    tone: "text-orange-700 bg-orange-50",
    format: "number",
    href: "/admin/products",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function formatDate(value: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusClass(status: string) {
  switch (status) {
    case "delivered":
      return "border-green-200 bg-green-50 text-green-700";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    case "shipped":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "processing":
    case "confirmed":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "pending":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const response = await fetch(`/api/admin/analytics?_t=${Date.now()}`, {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to load analytics");
      }

      setData(result);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load analytics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const revenueData = useMemo(
    () => data?.charts.revenueLast30Days || [],
    [data]
  );
  const orderData = useMemo(() => data?.charts.ordersLast30Days || [], [data]);

  if (loading) {
    return <AnalyticsDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Analytics unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => fetchAnalytics()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#f8fafc] p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            <BarChart3 className="h-4 w-4" />
            Store Analytics
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Ecommerce Performance
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Revenue, order status, inventory risk, and product performance from Sanity orders.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {data?.generatedAt && (
            <p className="text-xs text-slate-500">
              Updated {new Date(data.generatedAt).toLocaleTimeString("en-IN")}
            </p>
          )}
          <Button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            variant="outline"
            className="rounded-full bg-white"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
            {cardConfig.map((card) => {
              const Icon = card.icon;
              const value = data.cards[card.key];
              const change =
                card.changeKey && data.changes[card.changeKey]
                  ? data.changes[card.changeKey]
                  : null;

              return (
                <Link key={card.key} href={card.href} className="block">
                  <Card className="h-full rounded-2xl border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-500">
                            {card.title}
                          </p>
                          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                            {card.format === "currency"
                              ? formatCurrency(value)
                              : formatNumber(value)}
                          </p>
                        </div>
                        <div className={`rounded-xl p-2.5 ${card.tone}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      {change !== null && (
                        <p className="mt-4 text-xs text-slate-500">
                          <span
                            className={
                              change >= 0 ? "text-emerald-700" : "text-red-700"
                            }
                          >
                            {change >= 0 ? "+" : ""}
                            {change}%
                          </span>{" "}
                          vs previous period
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <QuickActionsPanel quickActions={data.tables.quickActions} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
                  <IndianRupee className="h-4 w-4 text-emerald-700" />
                  Revenue Last 30 Days
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] px-2 pb-5 sm:px-5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} minTickGap={18} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} width={48} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} labelFormatter={(label) => `Date: ${label}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fill="url(#revenueFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
                  <Truck className="h-4 w-4 text-blue-700" />
                  Orders Last 30 Days
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] px-2 pb-5 sm:px-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} minTickGap={18} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} width={36} />
                    <Tooltip formatter={(value) => [formatNumber(Number(value)), "Orders"]} labelFormatter={(label) => `Date: ${label}`} />
                    <Bar dataKey="orders" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <TopProductsTable products={data.tables.topSellingProducts} />
            <RecentOrdersTable orders={data.tables.recentOrders} />
          </div>

          <LowStockPanel products={data.tables.lowStockProducts} />
        </>
      )}
    </div>
  );
}

function TopProductsTable({
  products,
}: {
  products: AnalyticsResponse["tables"]["topSellingProducts"];
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
          <PackageSearch className="h-4 w-4 text-slate-700" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length ? (
              products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <Badge variant="secondary">#{product.rank}</Badge>
                  </TableCell>
                  <TableCell className="min-w-[180px] font-medium text-slate-900">
                    {product.slug ? (
                      <Link href={`/product/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    ) : (
                      product.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(product.unitsSold)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(product.revenue)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-28 text-center text-sm text-slate-500">
                  No sales data yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentOrdersTable({
  orders,
}: {
  orders: AnalyticsResponse["tables"]["recentOrders"];
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
          <ShoppingCart className="h-4 w-4 text-slate-700" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="min-w-[140px]">
                    <div className="font-medium text-slate-900">{order.orderNumber}</div>
                    <div className="text-xs text-slate-500">{formatDate(order.orderDate)}</div>
                  </TableCell>
                  <TableCell className="min-w-[170px]">
                    <div className="font-medium text-slate-900">{order.customerName}</div>
                    <div className="truncate text-xs text-slate-500">{order.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusClass(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-28 text-center text-sm text-slate-500">
                  No recent orders.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function QuickActionsPanel({
  quickActions,
}: {
  quickActions?: AnalyticsResponse["tables"]["quickActions"];
}) {
  const lowStock = quickActions?.lowStockProducts || [];
  const pendingOrders = quickActions?.pendingOrders || [];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
            <AlertTriangle className="h-4 w-4 text-orange-700" />
            Low Stock Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lowStock.length ? (
            lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={item.href}>{item.action}</Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No low stock actions.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
            <Clock3 className="h-4 w-4 text-amber-700" />
            Pending Order Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingOrders.length ? (
            pendingOrders.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={item.href}>{item.action}</Link>
                </Button>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No pending order actions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LowStockPanel({
  products,
}: {
  products: AnalyticsResponse["tables"]["lowStockProducts"];
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-950">
          <AlertTriangle className="h-4 w-4 text-orange-700" />
          Low Stock Products
        </CardTitle>
        <Badge variant="outline" className="w-fit border-orange-200 bg-orange-50 text-orange-700">
          Threshold: 5 units
        </Badge>
      </CardHeader>
      <CardContent>
        {products.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="rounded-xl border border-slate-200 p-4">
                <p className="line-clamp-1 font-medium text-slate-900">
                  {product.slug ? (
                    <Link href={`/product/${product.slug}`} className="hover:underline">
                      {product.name}
                    </Link>
                  ) : (
                    product.name
                  )}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <Badge
                    variant="outline"
                    className={
                      product.stock <= 0
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-orange-200 bg-orange-50 text-orange-700"
                    }
                  >
                    {product.stock <= 0 ? "Out of stock" : `${product.stock} left`}
                  </Badge>
                  <span className="text-sm font-medium text-slate-700">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
            No products are currently low on stock.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboardSkeleton() {
  return (
    <div className="space-y-6 bg-[#f8fafc] p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((__, row) => (
                <Skeleton key={row} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
