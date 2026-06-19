import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/helpers";
import { writeClient } from "@/sanity/lib/client";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "@/lib/orderStatus";
import crypto from "crypto";
import { sendOrderStatusNotification } from "@/lib/notificationService";
import { getCouponByCode } from "@/sanity/queries";

import {
  CheckoutValidationError,
  validateCartItems,
  calculateCartSummary,
  getBusinessDiscountRate,
  type ValidatedCartItem,
} from "@/lib/checkoutValidation";

interface CartItem {
  product: {
    _id: string;
    name?: string;
    price?: number;
    category?: string;
  };
  quantity: number;
}

function getStockDecrements(items: ValidatedCartItem[]) {
  return items.map((item) => ({
    productId: item.product._id,
    revisionId: item.product._rev,
    name: item.product.name || "An item",
    quantity: item.quantity,
    availableStock:
      typeof item.product.stock === "number" ? item.product.stock : 0,
  }));
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getMyOrders(userId);

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = async (request: NextRequest) => {
  try {
    // Check authentication
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const reqBody = await request.json();

const {
  items,
  shippingAddress,
  paymentMethod,
  couponCode,
} = reqBody;


    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (
      !paymentMethod ||
      !Object.values(PAYMENT_METHODS).includes(paymentMethod)
    ) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORDER-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const userEmail = user.emailAddresses[0]?.emailAddress;
    const validatedItems = await validateCartItems(items);

const cartSummary =
  calculateCartSummary(validatedItems);

const businessDiscountRate =
  await getBusinessDiscountRate(userEmail);

const businessDiscount =
  cartSummary.currentSubtotal *
  businessDiscountRate;

const verifiedSubtotal =
  cartSummary.currentSubtotal -
  businessDiscount;

const verifiedShipping =
  verifiedSubtotal > 100 ? 0 : 10;

const verifiedTax =
  verifiedSubtotal *
  (parseFloat(process.env.TAX_AMOUNT || "0") || 0);

let verifiedCouponDiscount = 0;
let verifiedCouponId = "";

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

  verifiedCouponId = coupon._id;
  verifiedCouponDiscount =
    coupon.discountType === "percentage"
      ? (verifiedSubtotal *
          coupon.discountValue) /
        100
      : coupon.discountValue;
}

const verifiedTotalAmount = Math.max(
  0,
  verifiedSubtotal +
    verifiedShipping +
    verifiedTax -
    verifiedCouponDiscount
);
    const userName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const userPhone =
      user.phoneNumbers?.[0]?.phoneNumber || shippingAddress.phone || "";

    // Create order object
    const orderData = {
      _type: "order" as const,
      orderNumber,
      customerName: userName,
      email: userEmail,
      phone: userPhone,
      clerkUserId: userId,
     products: validatedItems.map(
        (item: { product: { _id: string }; quantity: number }) => ({
          _key: crypto.randomUUID(), // Generate unique key for each product item
          product: {
            _type: "reference",
            _ref: item.product._id,
          },
          quantity: item.quantity,
        })
      ),
totalPrice: verifiedTotalAmount,
      currency: "INR",
     amountDiscount: verifiedCouponDiscount,
couponCode: couponCode || "",
couponDiscount: verifiedCouponDiscount,
      address: {
        _type: "object",
        name: shippingAddress.name,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
      },
      status: ORDER_STATUSES.PENDING,
      orderDate: new Date().toISOString(),
      paymentMethod,
      paymentStatus: PAYMENT_STATUSES.PAID,
     subtotal: verifiedSubtotal,
shipping: verifiedShipping,
tax: verifiedTax,
      // Add payment-specific fields based on payment method
      ...(paymentMethod === PAYMENT_METHODS.RAZORPAY && {
        stripeCustomerId: "", // Will be populated when needed for invoicing
        stripePaymentIntentId: "", // Will be populated for Stripe payments
        stripeCheckoutSessionId: "", // Will be populated for Stripe payments
      }),
      ...(paymentMethod === PAYMENT_METHODS.RAZORPAY && {
        clerkPaymentId: "", // Will be populated for Clerk payments
        clerkPaymentStatus: "pending", // Initial status
      }),
      ...(paymentMethod === PAYMENT_METHODS.RAZORPAY && {
        stripePaymentIntentId: `cod_${orderNumber}`,
      }),
    };

    const stockDecrements = getStockDecrements(validatedItems);
    const unavailableItem = stockDecrements.find(
      (item) => item.quantity > item.availableStock
    );

    if (unavailableItem) {
      return NextResponse.json(
        {
          error: `${unavailableItem.name} only has ${unavailableItem.availableStock} in stock`,
        },
        { status: 409 }
      );
    }

    const orderId = crypto.randomUUID();
    const stockReducedAt = new Date().toISOString();
    let stockTransaction = writeClient
      .transaction()
      .create({
        ...orderData,
        _id: orderId,
        stockReducedAt,
      });

    for (const item of stockDecrements) {
      stockTransaction = stockTransaction.patch(item.productId, (patch) =>
        patch.ifRevisionId(item.revisionId).dec({ stock: item.quantity })
      );
    }

    if (verifiedCouponId) {
      stockTransaction = stockTransaction.patch(verifiedCouponId, (patch) =>
        patch.inc({ timesUsed: 1 })
      );
    }

    await stockTransaction.commit();
    const createdOrder = await writeClient.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        status,
        paymentMethod,
        totalPrice,
        currency
      }`,
      { orderId }
    );

    if (!createdOrder) {
      throw new Error("Order was not created");
    }

    // Track order placed event
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://visionhub.vercel.app"
        }/api/analytics/track`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "order_placed",
            eventParams: {
              orderId: createdOrder._id,
              orderNumber: createdOrder.orderNumber,
              amount: verifiedTotalAmount,
              status: createdOrder.status,
              userId: userId,
              paymentMethod: paymentMethod,
              itemCount: validatedItems.length,
             subtotal: verifiedSubtotal,
shipping: verifiedShipping,
tax: verifiedTax,
              customerEmail: userEmail,
              products: validatedItems.map((item: CartItem) => ({
                productId: item.product._id,
                name: item.product.name || "Unknown Product",
                quantity: item.quantity,
                price: item.product.price || 0,
              })),
            },
          }),
        }
      );

      // Also track purchase event for e-commerce analytics
      await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://visionhub.vercel.app"
        }/api/analytics/track`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "purchase",
            eventParams: {
              orderId: createdOrder._id,
              value: verifiedTotalAmount,
              currency: "INR",
              items: items.map((item: CartItem) => ({
                productId: item.product._id,
                name: item.product.name || "Unknown Product",
                category: item.product.category || "Uncategorized",
                quantity: item.quantity,
                price: item.product.price || 0,
              })),
              userId: userId,
            },
          }),
        }
      );
    } catch (analyticsError) {
      console.error("Failed to track order placed event:", analyticsError);
    }

    // Send order confirmation notification to user
    try {
      await sendOrderStatusNotification({
        clerkUserId: userId,
        orderNumber: createdOrder.orderNumber,
        orderId: createdOrder._id,
        status: ORDER_STATUSES.PENDING,
      });
    } catch (notificationError) {
      console.error(
        "Failed to send order confirmation notification:",
        notificationError
      );
      // Don't fail the order creation if notification fails
    }

    return NextResponse.json({
      success: true,
      order: {
        _id: createdOrder._id,
        orderNumber: createdOrder.orderNumber,
        status: createdOrder.status,
        paymentMethod: createdOrder.paymentMethod,
        totalPrice: createdOrder.totalPrice,
        currency: createdOrder.currency,
      },
      message: "Order created successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (error instanceof CheckoutValidationError) {
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    if (
      errorMessage.toLowerCase().includes("revision") ||
      errorMessage.toLowerCase().includes("mutation") ||
      errorMessage.toLowerCase().includes("transaction")
    ) {
      return NextResponse.json(
        {
          error:
            "Product stock changed while placing your order. Please review your cart and try again.",
        },
        { status: 409 }
      );
    }

    console.error("Order creation error:", error);
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : null,
    });
    return NextResponse.json(
      {
        error: errorMessage || "Failed to create order",
        details: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
};
