import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export default function CheckoutPage() {
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
