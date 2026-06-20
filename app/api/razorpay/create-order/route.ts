import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { CheckoutValidationError } from "@/lib/checkoutValidation";
import { createPendingRazorpayOrder } from "@/lib/razorpayOrders";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { razorpayOrder, order } = await createPendingRazorpayOrder({
      userId,
      payload,
    });

    return NextResponse.json({
      ...razorpayOrder,
      localOrderId: order._id,
      orderNumber: order.orderNumber,
      localOrder: order,
    });
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);

    if (error instanceof CheckoutValidationError) {
      const status = error.message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
