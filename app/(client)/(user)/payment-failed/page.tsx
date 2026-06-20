"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Headphones, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const orderNumber = searchParams.get("orderNumber");

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex min-h-[78vh] max-w-3xl items-center"
      >
        <div className="w-full rounded-[36px] bg-white p-6 text-center shadow-[0_30px_100px_rgba(15,23,42,0.1)] sm:p-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="h-11 w-11" />
          </div>
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.22em] text-gray-500">
            Payment could not be completed
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Payment Failed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500">
            Your order is safe. Please try again with Razorpay or contact support if money was deducted.
          </p>
          {orderNumber && (
            <p className="mt-5 text-sm font-semibold text-gray-700">
              Order {orderNumber}
            </p>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full bg-gray-950 px-6 hover:bg-black">
              <Link href={orderId ? `/checkout?orderId=${orderId}` : "/checkout"}>
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6">
              <Link href="/contact">
                <Headphones className="mr-2 h-4 w-4" /> Contact Support
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 rounded-full px-6">
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
