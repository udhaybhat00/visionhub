"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LatestOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  totalPrice: number;
  orderDate: string;
  itemCount: number;
  firstProductName?: string;
}

interface UserStats {
  ordersCount: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  wishlistCount: number;
  notificationsCount: number;
  unreadNotifications: number;
  walletBalance: number;
  latestOrder: LatestOrder | null;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "order" | "notification" | "wishlist";
}

interface UserProfile {
  isActive?: boolean;
  isBusiness?: boolean;
  membershipType?: string;
  firstName?: string;
  lastName?: string;
}

const defaultStats: UserStats = {
  ordersCount: 0,
  activeOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  totalSpent: 0,
  wishlistCount: 0,
  notificationsCount: 0,
  unreadNotifications: 0,
  walletBalance: 0,
  latestOrder: null,
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatCurrency = (amount: number) => currency.format(amount || 0);

const formatDate = (timestamp?: string) => {
  if (!timestamp) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

const labelFromStatus = (status?: string) =>
  (status || "pending").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getStatusStyles = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "delivered":
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "shipped":
    case "ready_for_delivery":
    case "out_for_delivery":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "cancelled":
    case "canceled":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
};

export default function UserDashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statusResponse, statsResponse] = await Promise.all([
          fetch("/api/user/status"),
          fetch("/api/user/dashboard/stats"),
        ]);

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setUserProfile(statusData.userProfile || null);
        }

        if (statsResponse.ok) {
          const data = await statsResponse.json();
          if (data.success) {
            setStats({ ...defaultStats, ...data.stats });
            setRecentActivity(data.recentActivity || []);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const displayName = useMemo(() => {
    return (
      userProfile?.firstName ||
      user?.firstName ||
      user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "there"
    );
  }, [user, userProfile]);

  const activityIcon = (type: RecentActivity["type"]) => {
    if (type === "order") return <Package className="h-4 w-4" />;
    if (type === "wishlist") return <Heart className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-shop_light_green/40 text-shop_dark_green">
                Customer account
              </Badge>
              {userProfile?.isBusiness && (
                <Badge className="bg-shop_dark_green text-white">Business</Badge>
              )}
              {userProfile?.isActive && !userProfile?.isBusiness && (
                <Badge className="bg-shop_light_green text-white">
                  {userProfile.membershipType || "Active"}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-normal text-gray-950 sm:text-3xl">
              Hi {displayName}, your store account is ready.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Track orders, manage saved items, update addresses, and review account
              updates from one place.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
            <Button asChild className="bg-shop_dark_green hover:bg-black">
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/user/orders">
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Active orders</p>
                <p className="mt-1 text-2xl font-semibold text-gray-950">
                  {stats.activeOrders}
                </p>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-blue-700">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Total orders</p>
                <p className="mt-1 text-2xl font-semibold text-gray-950">
                  {stats.ordersCount}
                </p>
              </div>
              <div className="rounded-md bg-gray-100 p-3 text-gray-700">
                <ReceiptText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Saved items</p>
                <p className="mt-1 text-2xl font-semibold text-gray-950">
                  {stats.wishlistCount}
                </p>
              </div>
              <div className="rounded-md bg-red-50 p-3 text-red-600">
                <Heart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Unread updates</p>
                <p className="mt-1 text-2xl font-semibold text-gray-950">
                  {stats.unreadNotifications}
                </p>
              </div>
              <div className="rounded-md bg-amber-50 p-3 text-amber-700">
                <Bell className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-gray-50/70 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg">Latest Order</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/user/orders">
                  All orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {stats.latestOrder ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Order number</p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-950">
                      #{stats.latestOrder.orderNumber}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      {stats.latestOrder.firstProductName || "Store order"}
                      {stats.latestOrder.itemCount > 0
                        ? ` • ${stats.latestOrder.itemCount} item${
                            stats.latestOrder.itemCount === 1 ? "" : "s"
                          }`
                        : ""}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusStyles(stats.latestOrder.status)}
                  >
                    {labelFromStatus(stats.latestOrder.status)}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border bg-white p-3">
                    <p className="text-xs text-gray-500">Placed</p>
                    <p className="mt-1 text-sm font-medium text-gray-950">
                      {formatDate(stats.latestOrder.orderDate)}
                    </p>
                  </div>
                  <div className="rounded-md border bg-white p-3">
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="mt-1 text-sm font-medium text-gray-950">
                      {labelFromStatus(stats.latestOrder.paymentStatus || "pending")}
                    </p>
                  </div>
                  <div className="rounded-md border bg-white p-3">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="mt-1 text-sm font-medium text-gray-950">
                      {formatCurrency(stats.latestOrder.totalPrice)}
                    </p>
                  </div>
                </div>

                <Button asChild className="w-full bg-shop_dark_green hover:bg-black sm:w-auto">
                  <Link href={`/user/orders/${stats.latestOrder.id}`}>
                    Open order details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Package className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-3 font-medium text-gray-950">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your first order will appear here after checkout.
                </p>
                <Button asChild className="mt-4 bg-shop_dark_green hover:bg-black">
                  <Link href="/shop">Start shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-5">
            <CardTitle className="text-lg">Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Completed orders</p>
                  <p className="mt-1 text-lg font-semibold text-gray-950">
                    {stats.completedOrders}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Total spent</p>
                  <p className="mt-1 text-lg font-semibold text-gray-950">
                    {formatCurrency(stats.totalSpent)}
                  </p>
                </div>
                <ReceiptText className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            {stats.walletBalance > 0 && (
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Wallet balance</p>
                    <p className="mt-1 text-lg font-semibold text-gray-950">
                      {formatCurrency(stats.walletBalance)}
                    </p>
                  </div>
                  <Wallet className="h-5 w-5 text-shop_light_green" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Clock3 className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            {recentActivity.length === 0 ? (
              <p className="rounded-md border border-dashed p-5 text-center text-sm text-gray-500">
                No recent activity yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex gap-3">
                      <div className="mt-0.5 rounded-md bg-gray-100 p-2 text-gray-700">
                        {activityIcon(activity.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                          <p className="text-sm font-medium text-gray-950">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-5">
            <CardTitle className="text-lg">Manage Your Account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 pt-0 sm:grid-cols-2 sm:p-5 sm:pt-0">
            <Button asChild variant="outline" className="h-12 justify-start">
              <Link href="/user/profile">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 justify-start">
              <Link href="/user/profile">
                <MapPin className="mr-3 h-4 w-4" />
                Addresses
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 justify-start">
              <Link href="/wishlist">
                <Heart className="mr-3 h-4 w-4" />
                Wishlist
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 justify-start">
              <Link href="/user/notifications">
                <Bell className="mr-3 h-4 w-4" />
                Notifications
                {stats.unreadNotifications > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 justify-start sm:col-span-2">
              <Link href="/user/settings">
                <Settings className="mr-3 h-4 w-4" />
                Account settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
