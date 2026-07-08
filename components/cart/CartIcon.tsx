"use client";
import useCartStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CartIcon = () => {
  const { items } = useCartStore();
  const itemCount = items?.length || 0;
  const displayCount = itemCount > 9 ? "9+" : itemCount;

  return (
    <Link
      href={"/cart"}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700 shadow-sm transition-all hover:border-shop_orange hover:bg-shop_light_bg hover:text-shop_dark_green"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="h-5 w-5 transition-colors" />
      {itemCount > 0 ? (
        <span
          className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-shop_btn_dark_green text-[10px] font-semibold text-white ${
            itemCount > 9 ? "px-1" : ""
          }`}
        >
          {displayCount}
        </span>
      ) : (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-shop_btn_dark_green text-[10px] font-semibold text-white">
          0
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
