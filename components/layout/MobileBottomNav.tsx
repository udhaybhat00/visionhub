"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Home,
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import useStore from "@/store";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const { items, favoriteProduct } = useStore();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Shop",
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
    },
    {
      label: user ? "Profile" : "Account",
      href: user ? "/user/profile" : "/sign-in",
      icon: User,
    },
  ];

  return (
    <div data-mobile-bottom-nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-cream/95 border-t border-ink/[0.07] shadow-[0_-8px_30px_rgba(34,27,18,0.08)] backdrop-blur-xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(item.href + "/");

          return (
         <Link
  key={item.label}
  href={item.href}
  className={`flex flex-col items-center justify-center gap-1 relative transition-all duration-300 ${
    active
      ? "text-amber-brand scale-105"
      : "hover:text-amber-brand"
  }`}
>
              {active && (
                <div className="absolute top-0 w-10 h-1 rounded-full bg-amber-brand" />
              )}

              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active
                      ? "text-amber-brand"
                      : "text-ink-soft"
                  }`}
                />

               {item.label === "Cart" && items?.length > 0 && (
  <span className="absolute -top-2 -right-2 bg-amber-brand text-bone text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-bone">
    {items.length}
  </span>
)}

              {item.label === "Wishlist" &&
  favoriteProduct?.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-bone">
      {favoriteProduct.length}
    </span>
)}
              </div>

              <span
                className={`text-[11px] font-medium transition-colors ${
                  active
                    ? "text-amber-brand"
                    : "text-ink-soft"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
