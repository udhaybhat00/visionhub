"use client";

import Link from "next/link";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Percent,
  Shield,
  ShoppingCart,
  Star,
  Tags,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminTopNavigationProps {
  currentPath: string;
  user: {
    firstName?: string | null;
    lastName?: string | null;
    emailAddresses: Array<{ emailAddress: string }>;
    primaryEmailAddress?: { emailAddress: string } | null;
    imageUrl?: string;
  } | null;
}

const adminRoutes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Categories", icon: Tags, href: "/admin/categories" },
  { label: "Brands", icon: Building2, href: "/admin/brands" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Coupons", icon: Percent, href: "/admin/coupons" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Blog", icon: BookOpen, href: "/admin/blog" },
  { label: "Banners", icon: Images, href: "/admin/banners" },
  { label: "Subscriptions", icon: Mail, href: "/admin/subscriptions" },
  { label: "Contacts", icon: MessageSquare, href: "/admin/contacts" },
  { label: "Notifications", icon: Bell, href: "/admin/notifications" },
];

const AdminTopNavigation = ({ currentPath, user }: AdminTopNavigationProps) => {
  const { signOut } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin";
  const email = user?.primaryEmailAddress?.emailAddress;

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1">
      {adminRoutes.map((route) => {
        const isActive =
          currentPath === route.href ||
          (route.href !== "/admin" && currentPath.startsWith(route.href));
        const Icon = route.icon;

        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={onNavigate}
            className={cn(
              "group flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
              )}
            />
            <span>{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/admin" className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  VisionHub Admin
                </p>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Ecommerce operating system
                </p>
              </div>
            </Link>
          </div>

          <div className="scrollbar-hide hidden min-w-0 flex-1 justify-start overflow-x-auto px-2 lg:flex">
            <NavLinks />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm sm:flex">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={userName}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="max-w-36 leading-tight">
                <p className="truncate text-xs font-semibold text-slate-950">
                  {userName}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {email || "Administrator"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hidden border-slate-200 bg-white shadow-sm sm:inline-flex"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/40 transition-opacity lg:hidden",
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                VisionHub Admin
              </p>
              <p className="text-xs text-slate-500">{email || "Admin"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close admin navigation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <NavLinks onNavigate={() => setMobileMenuOpen(false)} />
        </div>

        <div className="border-t border-slate-200 p-4">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminTopNavigation;
