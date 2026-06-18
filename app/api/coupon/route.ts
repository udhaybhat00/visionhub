import { NextResponse } from "next/server";
import { getCouponByCode } from "@/sanity/queries";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    const coupon = await getCouponByCode(code);
    console.log("Coupon Code:", code);
console.log("Coupon Result:", coupon);

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon not found",
        },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon is inactive",
        },
        { status: 400 }
      );
    }

    // Expiry Check
    if (
      coupon.expiryDate &&
      new Date(coupon.expiryDate) < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon expired",
        },
        { status: 400 }
      );
    }

    // Minimum Order Check
 if (
  coupon.minimumOrderValue &&
  subtotal < coupon.minimumOrderValue
) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order ₹${coupon.minimumOrderValue} required`,
        },
        { status: 400 }
      );
    }

    // Usage Limit Check
    if (
      coupon.timesUsed >= coupon.usageLimit
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon limit reached",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}