"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Boxes,
  ChevronRight,
  CircleAlert,
  Eye,
  IndianRupee,
  MessageSquareText,
  Package,
  Percent,
  Plus,
  RefreshCw,
  Send,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardOverviewSkeleton } from "@/components/admin/SkeletonLoaders";
import { cn } from "@/lib/utils";

type ChartPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

type ActivityItem = {
  id: string;
  type: "order" | "review" | "coupon" | "stock";
  title: string;
  description: string;
  status: string;
  date: string;
};

type InventoryProduct = {
  _id: string;
  name?: string;
  stock?: number;
  price?: number;
  status?: string;
  brand?: { title?: string };
  images?: Array<{
    _key?: string;
    asset?: {
      url?: string;
    };
  }>;
};

type FastSellingProduct = {
  _id: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  pendingOrdersChange: number;
  lowStockChange: number;
  chartData: ChartPoint[];
  activityFeed: ActivityItem[];
  inventory: {
    lowStockItems: InventoryProduct[];
    outOfStockItems: InventoryProduct[];
    fastSellingItems: FastSellingProduct[];
    inventoryExposure: number;
  };
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

function formatCurrency(value: number) {
  return currencyFormatter.format(Number(value || 0));
}

function formatNumber(value: number) {
  return numberFormatter.format(Number(value || 0));
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function productImageUrl(product: InventoryProduct) {
  return product.images?.[0]?.asset?.url || "";
}

function TrendIndicator({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      )}
    >
      {positive ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function MiniSparkline({
  data,
  dataKey,
  color,
}: {
  data: ChartPoint[];
  dataKey: "revenue" | "orders";
  color: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={34}>
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={color}
          fillOpacity={0.12}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function DashboardTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-slate-950">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-5 text-slate-600"
          >
            <span className="capitalize">{entry.dataKey}</span>
            <span className="font-medium text-slate-950">
              {entry.dataKey === "revenue"
                ? formatCurrency(entry.value)
                : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
}: {
  icon: typeof Activity;
  title: string;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 text-center">
      <Icon className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-600">{title}</p>
    </div>
  );
}

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const statsResponse = await fetch("/api/admin/stats", {
        cache: "no-store",
      });

      if (!statsResponse.ok) {
        throw new Error(`Stats request failed: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();

      if (statsData.error) {
        throw new Error(statsData.error);
      }

      setStats(statsData);
    } catch (fetchError) {
      console.error("Error fetching stats:", fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch dashboard stats"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartData = stats?.chartData || [];

  const kpis = useMemo(
    () => [
      {
        label: "Revenue",
        value: formatCurrency(stats?.totalRevenue || 0),
        change: stats?.revenueChange || 0,
        icon: IndianRupee,
        href: "/admin/analytics",
        sparkKey: "revenue" as const,
        color: "#0f172a",
      },
      {
        label: "Orders",
        value: formatNumber(stats?.totalOrders || 0),
        change: stats?.ordersChange || 0,
        icon: ShoppingCart,
        href: "/admin/orders",
        sparkKey: "orders" as const,
        color: "#2563eb",
      },
      {
        label: "Products",
        value: formatNumber(stats?.totalProducts || 0),
        change: stats?.productsChange || 0,
        icon: Package,
        href: "/admin/products",
        sparkKey: "orders" as const,
        color: "#7c3aed",
      },
      {
        label: "Customers",
        value: formatNumber(stats?.totalCustomers || 0),
        change: stats?.customersChange || 0,
        icon: Users,
        href: "/admin/sanity-users",
        sparkKey: "orders" as const,
        color: "#0891b2",
      },
      {
        label: "Low Stock",
        value: formatNumber(stats?.lowStockCount || 0),
        change: stats?.lowStockChange || 0,
        icon: CircleAlert,
        href: "/admin/products",
        sparkKey: "orders" as const,
        color: "#d97706",
      },
      {
        label: "Pending Orders",
        value: formatNumber(stats?.pendingOrders || 0),
        change: stats?.pendingOrdersChange || 0,
        icon: Boxes,
        href: "/admin/orders",
        sparkKey: "orders" as const,
        color: "#db2777",
      },
    ],
    [stats]
  );

  const quickActions = [
    {
      title: "New Product",
      description: "Add catalog item",
      href: "/admin/products",
      icon: Plus,
    },
    {
      title: "New Coupon",
      description: "Create offer",
      href: "/admin/coupons",
      icon: Percent,
    },
    {
      title: "Create Blog",
      description: "Publish content",
      href: "/admin/blog",
      icon: BookOpen,
    },
    {
      title: "Manage Orders",
      description: "Review queue",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Send Notification",
      description: "Reach customers",
      href: "/admin/notifications",
      icon: Send,
    },
    {
      title: "View Reviews",
      description: "Moderate feedback",
      href: "/admin/reviews",
      icon: MessageSquareText,
    },
  ];

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <Card className="border-red-200 bg-red-50 shadow-none">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-red-900">
                  Dashboard data failed to load
                </h2>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <Button onClick={fetchStats} variant="destructive">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#f7f8fa] p-4 text-slate-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            Executive Overview
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Commerce operations
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Revenue, fulfillment, catalog health, and customer signals in one
            operational view.
          </p>
        </div>
        <Button
          onClick={fetchStats}
          variant="outline"
          className="w-full border-slate-200 bg-white shadow-sm sm:w-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <Link key={kpi.label} href={kpi.href} className="group">
              <Card className="h-full rounded-lg border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <TrendIndicator value={kpi.change} />
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {kpi.label}
                  </p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                    {kpi.value}
                  </p>
                  <div className="mt-3 h-9">
                    <MiniSparkline
                      data={chartData}
                      dataKey={kpi.sparkKey}
                      color={kpi.color}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Revenue Analytics
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Last 14 days of captured revenue.
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                Live from Sanity
              </Badge>
            </div>
            <div className="mt-5 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#111827" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
                    width={46}
                  />
                  <Tooltip content={<DashboardTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#111827"
                    strokeWidth={2.5}
                    fill="url(#revenueFill)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#111827" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Orders Chart
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Daily order volume over the same window.
              </p>
            </div>
            <div className="mt-5 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    width={30}
                  />
                  <Tooltip content={<DashboardTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(380px,0.28fr)]">
        <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Quick Actions
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Shortcuts for high-frequency admin work.
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link key={action.title} href={action.href} className="group">
                    <div className="flex h-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {action.title}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="ml-auto hidden h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 sm:block" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Activity Feed
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Orders, reviews, coupons, and stock alerts.
                </p>
              </div>
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              {stats?.activityFeed?.length ? (
                stats.activityFeed.slice(0, 7).map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex gap-3">
                    <div
                      className={cn(
                        "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                        item.type === "stock" && "bg-amber-500",
                        item.type === "order" && "bg-blue-500",
                        item.type === "review" && "bg-violet-500",
                        item.type === "coupon" && "bg-emerald-500"
                      )}
                    />
                    <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-medium text-slate-950">
                          {item.title}
                        </p>
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {formatTime(item.date)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={Bell} title="No recent activity yet" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-950">
                Inventory Health
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Low stock, out-of-stock, and fast-selling product signals.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                {formatNumber(stats?.lowStockCount || 0)} low stock
              </Badge>
              <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                {formatNumber(stats?.outOfStockCount || 0)} out of stock
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                {formatCurrency(stats?.inventory.inventoryExposure || 0)} exposure
              </Badge>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Low stock items
              </h3>
              <div className="mt-4 space-y-3">
                {stats?.inventory.lowStockItems?.length ? (
                  stats.inventory.lowStockItems.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-1">
                        {productImageUrl(product) ? (
                          <Image
                            src={productImageUrl(product)}
                            alt={product.name || "Product"}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-950">
                          {product.name || "Unnamed product"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.brand?.title || "No brand"}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        {product.stock || 0}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Package} title="No low-stock products" />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Out of stock
              </h3>
              <div className="mt-4 space-y-3">
                {stats?.inventory.outOfStockItems?.length ? (
                  stats.inventory.outOfStockItems.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-1">
                        {productImageUrl(product) ? (
                          <Image
                            src={productImageUrl(product)}
                            alt={product.name || "Product"}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-950">
                          {product.name || "Unnamed product"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.brand?.title || "No brand"}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                        0
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={CircleAlert} title="No out-of-stock items" />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Fast selling
              </h3>
              <div className="mt-4 space-y-3">
                {stats?.inventory.fastSellingItems?.length ? (
                  stats.inventory.fastSellingItems.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-950 text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-950">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatCurrency(product.revenue)} attributed
                        </p>
                      </div>
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        {product.unitsSold} sold
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Eye} title="No recent sales velocity" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
