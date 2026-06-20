import { ShoppingBag } from "lucide-react";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { notFound } from "next/navigation";
import { getOrderById } from "@/sanity/queries";
import { currentUser } from "@clerk/nextjs/server";
import { OrderCheckoutContent } from "@/components/checkout/OrderCheckoutContent";

interface Props {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  const user = await currentUser();

  // If there's an orderId, this is a payment for an existing order
  if (orderId) {
    if (!user) {
      notFound();
    }

    const order = await getOrderById(orderId);
    if (!order || order.clerkUserId !== user.id) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-[#f7f7f5] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">VisionHub checkout</p>
              <h1 className="text-2xl font-semibold text-gray-950">Complete Payment</h1>
            </div>
          </div>
          <OrderCheckoutContent order={order} />
        </div>
      </main>
    );
  }

  // Regular checkout flow
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
            VisionHub secure checkout
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Finish your order.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Premium eyewear, encrypted payment, and tracked delivery in one polished checkout.
          </p>
        </div>
        <CheckoutContent />
      </div>
    </main>
  );
}
