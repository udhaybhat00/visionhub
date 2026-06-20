import crypto from "crypto";
import { NextResponse } from "next/server";

import { finalizeRazorpayOrder } from "@/lib/razorpayOrders";

type RazorpayWebhookEvent = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
  };
};

function verifyWebhookSignature(body: string, signature: string, secret: string) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Razorpay webhook secret is not set" },
      { status: 500 }
    );
  }

  if (!verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  let event: RazorpayWebhookEvent;

  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("Invalid Razorpay webhook payload:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true, ignored: true });
  }

  const payment = event.payload?.payment?.entity;

  if (!payment?.order_id || !payment.id || payment.status !== "captured") {
    return NextResponse.json(
      { error: "Missing captured payment details" },
      { status: 400 }
    );
  }

  try {
    const finalizedOrder = await finalizeRazorpayOrder({
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
      source: "webhook",
    });

    return NextResponse.json({
      received: true,
      order: finalizedOrder,
    });
  } catch (error) {
    console.error("Failed to process Razorpay webhook:", error);
    return NextResponse.json(
      { error: "Failed to process Razorpay webhook" },
      { status: 500 }
    );
  }
}
