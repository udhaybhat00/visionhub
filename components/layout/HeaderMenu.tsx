"use client";

import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const HeaderMenu = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");

  return (
    <div className="hidden md:inline-flex w-full items-center justify-center gap-7 text-sm capitalize font-semibold text-light-color">
      {headerData?.map((item) => {
        const isActive =
          item.title === "Eyeglasses"
            ? pathname === "/shop" && type === "eyeglasses"
            : item.title === "Sunglasses"
            ? pathname === "/shop" && type === "sunglasses"
            : pathname === item.href;

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`hover:text-shop_light_green hoverEffect relative group ${
              isActive ? "text-shop_light_green" : ""
            }`}
          >
            {item.title}

            <span
              className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop_light_green transition-all duration-300 group-hover:w-1/2 group-hover:left-0 ${
                isActive ? "w-1/2" : ""
              }`}
            />

            <span
              className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop_light_green transition-all duration-300 group-hover:w-1/2 group-hover:right-0 ${
                isActive ? "w-1/2" : ""
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default HeaderMenu;