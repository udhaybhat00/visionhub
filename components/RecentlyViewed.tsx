"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ViewedProduct {
  productId: string;
  name: string;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    setProducts(data);
  }, []);

  if (products.length <= 1) return null;

  return (
    <div className="py-8">
      <h2 className="text-xl font-bold mb-4">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(1).map((item) => (
          <Link
            key={item.productId}
            href={`/product/${item.productId}`}
            className="border rounded-xl p-4 hover:shadow-lg transition"
          >
            <p className="font-medium text-sm line-clamp-2">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}