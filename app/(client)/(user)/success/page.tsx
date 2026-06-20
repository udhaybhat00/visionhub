"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Download,
  Home,
  MapPin,
  Package,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { defineQuery } from "next-sanity";

import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import { client } from "@/sanity/lib/client";

type SuccessOrder = {
  _id: string;
  orderNumber?: string;
  totalPrice?: number;
  address?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

const query = defineQuery(`*[_type == 'order' && _id == $orderId][0]{
  _id,
  orderNumber,
  totalPrice,
  address
}`);

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "";
  const orderNumberParam = searchParams.get("orderNumber") || "";
  const { user } = useUser();
  const [order, setOrder] = useState<SuccessOrder | null>(null);

  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  useEffect(() => {
    if (!orderId) return;

    client
      .fetch(query, { orderId })
      .then((data) => setOrder(data as SuccessOrder | null))
      .catch((error) => console.error("Order fetch failed:", error));
  }, [orderId]);

  const orderNumber = order?.orderNumber || orderNumberParam;

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[36px] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.1)]"
        >
          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="p-6 sm:p-10">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-950 text-white"
              >
                <Check className="h-11 w-11" />
              </motion.div>

              <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-700">
                Payment successful
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-gray-950 sm:text-6xl">
                Your eyewear is on its way.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">
                Thanks{user?.firstName ? `, ${user.firstName}` : ""}. Your order is confirmed and our team is preparing it for dispatch.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-gray-50 p-5">
                  <Package className="h-5 w-5 text-gray-950" />
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-gray-500">Order Number</p>
                  <p className="mt-1 truncate font-semibold text-gray-950">{orderNumber || "Confirmed"}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-5">
                  <CalendarDays className="h-5 w-5 text-gray-950" />
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-gray-500">Expected Delivery</p>
                  <p className="mt-1 font-semibold text-gray-950">{deliveryDate}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-5">
                  <Check className="h-5 w-5 text-gray-950" />
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-gray-500">Amount Paid</p>
                  <PriceFormatter amount={order?.totalPrice || 0} className="mt-1 text-base font-semibold text-gray-950" />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {orderId && (
                  <Button asChild className="h-12 rounded-full bg-gray-950 px-6 hover:bg-black">
                    <Link href={`/invoice/${orderId}`}>
                      <Download className="mr-2 h-4 w-4" /> Download Invoice
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="h-12 rounded-full px-6">
                  <Link href="/user/orders">
                    Track Order <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="h-12 rounded-full px-6">
                  <Link href="/shop">
                    <Home className="mr-2 h-4 w-4" /> Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            <aside className="bg-gray-950 p-6 text-white sm:p-8">
              <div className="rounded-3xl border border-white/10 p-5">
                <MapPin className="h-6 w-6" />
                <h2 className="mt-5 text-xl font-semibold">Shipping Address</h2>
                <p className="mt-4 text-sm leading-7 text-gray-300">
                  <span className="font-semibold text-white">{order?.address?.name || "Selected address"}</span>
                  <br />
                  {order?.address?.address || "Address saved with your order"}
                  <br />
                  {[order?.address?.city, order?.address?.state, order?.address?.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div className="mt-5 rounded-3xl bg-white/10 p-5">
                <p className="text-sm font-semibold">What happens next</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  We will verify, pack, and share updates from your order dashboard.
                </p>
              </div>
            </aside>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
