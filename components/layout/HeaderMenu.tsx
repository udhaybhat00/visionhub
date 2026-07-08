"use client";

import { headerData } from "@/constants";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const HeaderMenu = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isHrefActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");

    if (hrefQuery) {
      const hrefParams = new URLSearchParams(hrefQuery);

      return (
        pathname === hrefPath &&
        Array.from(hrefParams.entries()).every(
          ([key, value]) => searchParams.get(key) === value
        )
      );
    }

    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLinkClassName = (isActive: boolean) =>
    cn(
      "relative inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop_orange/30",
      isActive
        ? "bg-shop_dark_green text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-shop_dark_green"
    );

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center justify-center gap-1 rounded-full border border-black/[0.06] bg-white/85 p-1 capitalize shadow-sm ring-1 ring-black/[0.03] xl:inline-flex"
    >
      {headerData?.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = hasChildren
          ? item.children?.some((child) => isHrefActive(child.href)) ||
            isHrefActive(item.href)
          : isHrefActive(item.href);

        if (hasChildren) {
          return (
            <div key={item.title} className="group/collections relative">
              <button
                type="button"
                aria-haspopup="true"
                className={navLinkClassName(Boolean(isActive))}
              >
                <span>{item.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover/collections:rotate-180 group-focus-within/collections:rotate-180" />
              </button>

              <div className="invisible absolute left-0 top-full h-3 w-full group-hover/collections:visible group-focus-within/collections:visible" />
              <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 ease-out group-hover/collections:visible group-hover/collections:translate-y-0 group-hover/collections:opacity-100 group-focus-within/collections:visible group-focus-within/collections:translate-y-0 group-focus-within/collections:opacity-100">
                <div className="rounded-lg border border-black/[0.06] bg-white p-2 shadow-[0_20px_60px_rgba(15,15,15,0.12)] ring-1 ring-black/[0.03]">
                  <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-black/[0.06] bg-white" />
                  {item.children?.map((child) => {
                    const isChildActive = isHrefActive(child.href);

                    return (
                      <Link
                        key={child.title}
                        href={child.href}
                        className={cn(
                          "relative z-10 flex items-center justify-between rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200",
                          isChildActive
                            ? "bg-shop_dark_green text-white"
                            : "text-gray-700 hover:bg-shop_light_bg hover:text-shop_dark_green"
                        )}
                      >
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.href}
            className={navLinkClassName(Boolean(isActive))}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;
