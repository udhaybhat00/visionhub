import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import {
  validateCartItems,
  calculateCartSummary,
  getBusinessDiscountRate,
} from "@/lib/checkoutValidation";

import { getCouponByCode } from "@/sanity/queries";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { items, couponCode } = await req.json();

    const validatedItems = await validateCartItems(items);

    const cartSummary =
      calculateCartSummary(validatedItems);

    const userEmail =
      user.emailAddresses[0]?.emailAddress;

    const businessDiscountRate =
      await getBusinessDiscountRate(userEmail);

    const businessDiscount =
      cartSummary.currentSubtotal *
      businessDiscountRate;

    const verifiedSubtotal =
      cartSummary.currentSubtotal -
      businessDiscount;

    const shipping =
      verifiedSubtotal > 100 ? 0 : 10;

    const tax =
      verifiedSubtotal *
      (parseFloat(process.env.TAX_AMOUNT || "0") || 0);

    let couponDiscount = 0;

    if (couponCode) {
      const coupon = await getCouponByCode(couponCode);

      if (!coupon) {
        return NextResponse.json(
          { error: "Invalid coupon" },
          { status: 400 }
        );
      }

      if (!coupon.isActive) {
        return NextResponse.json(
          { error: "Coupon inactive" },
          { status: 400 }
        );
      }

      if (
        coupon.expiryDate &&
        new Date(coupon.expiryDate) < new Date()
      ) {
        return NextResponse.json(
          { error: "Coupon expired" },
          { status: 400 }
        );
      }

      if (
        coupon.usageLimit &&
        coupon.timesUsed >= coupon.usageLimit
      ) {
        return NextResponse.json(
          { error: "Coupon limit reached" },
          { status: 400 }
        );
      }

      if (
        coupon.minimumOrderValue &&
        verifiedSubtotal < coupon.minimumOrderValue
      ) {
        return NextResponse.json(
          {
            error:
              "Minimum order value not met for this coupon",
          },
          { status: 400 }
        );
      }

      couponDiscount =
        coupon.discountType === "percentage"
          ? (verifiedSubtotal *
              coupon.discountValue) /
            100
          : coupon.discountValue;
    }

    const amount = Math.max(
      0,
      verifiedSubtotal +
        shipping +
        tax -
        couponDiscount
    );

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `visionhub_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}