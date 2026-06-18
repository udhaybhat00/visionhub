"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ViewedProduct {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  price?: number;
  discount?: number;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function RecentlyViewed({ currentSlug }: { currentSlug?: string }) {
  const [products, setProducts] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  }, []);

  const visibleProducts = products
    .filter((item) => item.slug && item.slug !== currentSlug)
    .slice(0, 6);

  if (visibleProducts.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-950">Recently Viewed</h2>
          <p className="text-sm text-gray-500">Pick up where you left off</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
        {visibleProducts.map((item) => (
          <Link
            key={item.productId}
            href={`/product/${item.slug}`}
            className="w-[156px] shrink-0 overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:w-auto"
          >
            <div className="relative aspect-[4/3] bg-gray-50">
              {!!item.discount && (
                <span className="absolute left-2 top-2 z-10 rounded bg-shop_light_green px-2 py-0.5 text-[11px] font-bold text-white">
                  {item.discount}% OFF
                </span>
              )}
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="160px"
                  className="object-contain p-3"
                />
              ) : null}
            </div>
            <div className="p-3">
              <p className="line-clamp-1 text-sm font-semibold text-gray-950">
                {item.name}
              </p>
              {typeof item.price === "number" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-base font-bold text-shop_dark_green">
                    {formatPrice(item.price)}
                  </span>
                  {!!item.discount && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(item.price + (item.price * item.discount) / 100)}
                    </span>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs font-medium text-emerald-700">
                Recently viewed
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
