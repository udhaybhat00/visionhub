"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye, Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SavedLook = {
  id: string;
  image: string;
  faceShape: string;
  confidence?: number;
  skinTone?: string;
  size?: string;
  productSlug?: string;
  productName?: string;
  productImage?: string;
  source?: "live";
  savedAt: string;
};

export default function MyLooksPage() {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const validLooks = useMemo(
    () => looks.filter((look) => Boolean(look.id && look.image)),
    [looks]
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("visionhubLooks") || "[]");
      setLooks(Array.isArray(stored) ? stored : []);
    } catch {
      setLooks([]);
    }
  }, []);

  const removeLook = (id: string) => {
    const next = looks.filter((look) => look.id !== id);
    setLooks(next);
    localStorage.setItem("visionhubLooks", JSON.stringify(next));
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              VisionHub AI Stylist
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
              My Looks
            </h1>
          </div>
          <Button asChild className="rounded-full bg-gray-950 hover:bg-black">
            <Link href="/ai-stylist">
              <Sparkles className="mr-2 h-4 w-4" /> Create New Look
            </Link>
          </Button>
        </div>

        {validLooks.length === 0 ? (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm sm:rounded-[36px] sm:p-10">
            <Heart className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-2xl font-semibold">No saved looks yet</h2>
            <p className="mt-2 text-gray-500">Try frames with AI Stylist and save your favorite result.</p>
            <Button asChild className="mt-6 rounded-full bg-gray-950 hover:bg-black">
              <Link href="/ai-stylist">
                <Sparkles className="mr-2 h-4 w-4" /> Start Try-On
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {validLooks.map((look) => (
              <article key={look.id} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
                <div className="relative aspect-[4/5] bg-gray-100">
                  <SavedLookImage look={look} />
                  <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    Live Try-On
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-semibold text-gray-950">{look.productName || "Recommended frame"}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{look.faceShape} Face</span>
                    {look.size && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">{look.size}</span>}
                    {look.confidence && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{look.confidence}%</span>}
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatSavedDate(look.savedAt)}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {look.productSlug ? (
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link href={`/product/${look.productSlug}`}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link href="/shop">
                          <ShoppingBag className="mr-1 h-3.5 w-3.5" /> Shop
                        </Link>
                      </Button>
                    )}
                    <Button onClick={() => removeLook(look.id)} variant="outline" size="sm" className="rounded-full text-red-600 hover:text-red-700">
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SavedLookImage({ look }: { look: SavedLook }) {
  if (look.image.startsWith("data:")) {
    return <img src={look.image} alt="Saved look" className="h-full w-full object-cover" />;
  }

  return <Image src={look.image} alt="Saved look" fill className="object-cover" unoptimized />;
}

function formatSavedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
