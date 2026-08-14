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
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-bone text-ink-soft shadow-sm transition-brand hover:-translate-y-0.5 hover:border-amber-brand/50 hover:bg-cream-deep hover:text-ink hover:shadow-[0_10px_24px_-12px_rgba(34,27,18,0.3)]"
      aria-label="Shopping cart"
    >
      <ShoppingBag className="h-5 w-5 transition-brand" />
      {itemCount > 0 ? (
        <span
          className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-brand text-[10px] font-semibold text-bone shadow-[0_4px_10px_-4px_rgba(180,83,9,0.6)] transition-brand group-hover:scale-110 ${
            itemCount > 9 ? "px-1" : ""
          }`}
        >
          {displayCount}
        </span>
      ) : (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-bone">
          0
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
