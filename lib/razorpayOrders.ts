import crypto from "crypto";
import { currentUser } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

import {
  CheckoutValidationError,
  calculateCartSummary,
  getBusinessDiscountRate,
  validateCartItems,
  type ValidatedCartItem,
} from "@/lib/checkoutValidation";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} from "@/lib/orderStatus";
import { sendOrderConfirmationEmail } from "@/lib/emailService";
import { getEmailImageUrl } from "@/lib/emailImageUtils";
import { sendOrderStatusNotification } from "@/lib/notificationService";
import { getCouponByCode } from "@/sanity/queries";
import { backendClient } from "@/sanity/lib/backendClient";

type RazorpayOrderPayload = {
  items: unknown;
  shippingAddress: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  couponCode?: string;
};

type RazorpayPaymentDetails = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  source: "browser" | "webhook";
};

type CouponValidationResult = {
  couponId: string;
  couponDiscount: number;
  couponCode: string;
};

type PreparedOrderPricing = {
  subtotal: number;
  shipping: number;
  tax: number;
  totalAmount: number;
  coupon?: CouponValidationResult;
};

type ExistingRazorpayOrder = {
  _id: string;
  _rev: string;
  orderNumber: string;
  clerkUserId: string;
  paymentStatus?: string;
  totalPrice?: number;
  paymentCompletedAt?: string;
  stockReducedAt?: string;
  couponUsageCountedAt?: string;
  orderEmailSentAt?: string;
  products?: {
    product?: {
      _id: string;
      _rev?: string;
      name?: string;
      price?: number;
      images?: Parameters<typeof getEmailImageUrl>[0][];
      stock?: number;
    };
    quantity?: number;
  }[];
  customerName?: string;
  email?: string;
  address?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  subtotal?: number;
  shipping?: number;
  tax?: number;
  couponCode?: string;
};

const TAX_RATE = parseFloat(process.env.TAX_AMOUNT || "0") || 0;

export function getRazorpayClient() {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
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

async function calculatePricing(
  validatedItems: ValidatedCartItem[],
  userEmail?: string,
  couponCode?: string
): Promise<PreparedOrderPricing> {
  const cartSummary = calculateCartSummary(validatedItems);
  const businessDiscountRate = await getBusinessDiscountRate(userEmail);
  const businessDiscount = cartSummary.currentSubtotal * businessDiscountRate;
  const verifiedSubtotal = cartSummary.currentSubtotal - businessDiscount;
  const verifiedShipping = verifiedSubtotal > 100 ? 0 : 10;
  const verifiedTax = verifiedSubtotal * TAX_RATE;

  let coupon: CouponValidationResult | undefined;

  if (couponCode) {
    const sanityCoupon = await getCouponByCode(couponCode);

    if (!sanityCoupon) {
      throw new CheckoutValidationError("Invalid coupon");
    }

    if (!sanityCoupon.isActive) {
      throw new CheckoutValidationError("Coupon inactive");
    }

    if (
      sanityCoupon.expiryDate &&
      new Date(sanityCoupon.expiryDate) < new Date()
    ) {
      throw new CheckoutValidationError("Coupon expired");
    }

    if (
      sanityCoupon.usageLimit &&
      (sanityCoupon.timesUsed ?? 0) >= sanityCoupon.usageLimit
    ) {
      throw new CheckoutValidationError("Coupon limit reached");
    }

    if (
      sanityCoupon.minimumOrderValue &&
      verifiedSubtotal < sanityCoupon.minimumOrderValue
    ) {
      throw new CheckoutValidationError(
        "Minimum order value not met for this coupon"
      );
    }

    const discountValue = sanityCoupon.discountValue ?? 0;
    const couponDiscount =
      sanityCoupon.discountType === "percentage"
        ? (verifiedSubtotal * discountValue) / 100
        : discountValue;

    coupon = {
      couponId: sanityCoupon._id,
      couponCode: sanityCoupon.code || couponCode,
      couponDiscount,
    };
  }

  return {
    subtotal: verifiedSubtotal,
    shipping: verifiedShipping,
    tax: verifiedTax,
    totalAmount: Math.max(
      0,
      verifiedSubtotal +
        verifiedShipping +
        verifiedTax -
        (coupon?.couponDiscount || 0)
    ),
    coupon,
  };
}

export async function createPendingRazorpayOrder({
  userId,
  payload,
}: {
  userId: string;
  payload: RazorpayOrderPayload;
}) {
  const user = await currentUser();

  if (!user) {
    throw new CheckoutValidationError("Unauthorized");
  }

  if (!payload.shippingAddress) {
    throw new CheckoutValidationError("Shipping address is required");
  }

  const validatedItems = await validateCartItems(payload.items);
  const userEmail = user.emailAddresses[0]?.emailAddress;
  const pricing = await calculatePricing(
    validatedItems,
    userEmail,
    payload.couponCode
  );
  const stockDecrements = getStockDecrements(validatedItems);
  const unavailableItem = stockDecrements.find(
    (item) => item.quantity > item.availableStock
  );

  if (unavailableItem) {
    throw new CheckoutValidationError(
      `${unavailableItem.name} only has ${unavailableItem.availableStock} in stock`
    );
  }

  const orderId = crypto.randomUUID();
  const orderNumber = `ORDER-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  const userPhone =
    user.phoneNumbers?.[0]?.phoneNumber || payload.shippingAddress.phone || "";

  const razorpayOrder = await getRazorpayClient().orders.create({
    amount: Math.round(pricing.totalAmount * 100),
    currency: "INR",
    receipt: orderNumber,
    notes: {
      sanityOrderId: orderId,
      orderNumber,
      clerkUserId: userId,
    },
  });

  const orderData = {
    _type: "order" as const,
    _id: orderId,
    orderNumber,
    customerName: userName,
    email: userEmail,
    phone: userPhone,
    clerkUserId: userId,
    products: validatedItems.map((item) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity,
    })),
    totalPrice: pricing.totalAmount,
    currency: "INR",
    amountDiscount: pricing.coupon?.couponDiscount || 0,
    couponCode: pricing.coupon?.couponCode || payload.couponCode || "",
    couponDiscount: pricing.coupon?.couponDiscount || 0,
    address: {
      _type: "object",
      name: payload.shippingAddress.name,
      address: payload.shippingAddress.address,
      city: payload.shippingAddress.city,
      state: payload.shippingAddress.state,
      zip: payload.shippingAddress.zip,
    },
    status: ORDER_STATUSES.PENDING,
    orderDate: new Date().toISOString(),
    paymentMethod: PAYMENT_METHODS.RAZORPAY,
    paymentStatus: PAYMENT_STATUSES.PENDING,
    subtotal: pricing.subtotal,
    shipping: pricing.shipping,
    tax: pricing.tax,
    razorpayOrderId: razorpayOrder.id,
  };

  await backendClient.create(orderData);

  return {
    razorpayOrder,
    order: {
      _id: orderId,
      orderNumber,
      totalPrice: pricing.totalAmount,
      currency: "INR",
    },
  };
}

function createPaymentSignature(orderId: string, paymentId: string) {
  return crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

export function verifyRazorpayPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const expectedSignature = createPaymentSignature(
    razorpayOrderId,
    razorpayPaymentId
  );

  if (expectedSignature.length !== razorpaySignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(razorpaySignature)
  );
}

async function fetchOrderForFinalization(razorpayOrderId: string) {
  return await backendClient.fetch<ExistingRazorpayOrder | null>(
    `*[_type == "order" && razorpayOrderId == $razorpayOrderId][0]{
      _id,
      _rev,
      orderNumber,
      clerkUserId,
      paymentStatus,
      totalPrice,
      paymentCompletedAt,
      stockReducedAt,
      couponUsageCountedAt,
      orderEmailSentAt,
      customerName,
      email,
      address,
      subtotal,
      shipping,
      tax,
      couponCode,
      products[]{
        quantity,
        product->{
          _id,
          _rev,
          name,
          price,
          images,
          stock
        }
      }
    }`,
    { razorpayOrderId }
  );
}

async function sendOrderEmailIfNeeded(order: ExistingRazorpayOrder) {
  if (order.orderEmailSentAt || !order.email) {
    return;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const emailResult = await sendOrderConfirmationEmail({
    customerName: order.customerName || "Customer",
    customerEmail: order.email,
    orderId: order.orderNumber,
    orderDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    items:
      order.products?.map((item) => ({
        name: item.product?.name || "Unknown Product",
        price: item.product?.price || 0,
        quantity: item.quantity || 1,
        image: getEmailImageUrl(item.product?.images?.[0]),
      })) || [],
    subtotal: order.subtotal || 0,
    shipping: order.shipping || 0,
    tax: order.tax || 0,
    total: order.totalPrice || 0,
    shippingAddress: {
      name: order.address?.name || order.customerName || "Customer",
      street: order.address?.address || "",
      city: order.address?.city || "",
      state: order.address?.state || "",
      zipCode: order.address?.zip || "",
      country: "India",
    },
    estimatedDelivery: deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });

  if (emailResult.success) {
    await backendClient
      .patch(order._id)
      .set({ orderEmailSentAt: new Date().toISOString() })
      .commit();
  }
}

async function getCouponIdForOrder(couponCode?: string) {
  if (!couponCode) {
    return "";
  }

  const coupon = await backendClient.fetch<{ _id: string } | null>(
    `*[_type == "coupon" && code == $code][0]{ _id }`,
    { code: couponCode.trim().toUpperCase() }
  );

  return coupon?._id || "";
}

async function markRazorpayOrderPaid({
  order,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  source,
}: RazorpayPaymentDetails & { order: ExistingRazorpayOrder }) {
  if (order.paymentStatus === PAYMENT_STATUSES.PAID) {
    return order;
  }

  const paymentCompletedAt = new Date().toISOString();
  const orderUpdate: Record<string, string | number> = {
    paymentStatus: PAYMENT_STATUSES.PAID,
    status: ORDER_STATUSES.PENDING,
    amountPaid: order.totalPrice || 0,
    paymentCompletedAt,
    razorpayPaymentId,
    razorpaySignature: razorpaySignature || "",
  };

  if (source === "webhook") {
    orderUpdate.razorpayWebhookProcessedAt = paymentCompletedAt;
  }

  try {
    await backendClient
      .patch(order._id)
      .ifRevisionId(order._rev)
      .set(orderUpdate)
      .commit();
  } catch (error) {
    const latestOrder = await fetchOrderForFinalization(razorpayOrderId);

    if (latestOrder?.paymentStatus === PAYMENT_STATUSES.PAID) {
      return latestOrder;
    }

    throw error;
  }

  const paidOrder = await fetchOrderForFinalization(razorpayOrderId);

  if (!paidOrder) {
    throw new Error(`No local order found for Razorpay order ${razorpayOrderId}`);
  }

  return paidOrder;
}

async function countCouponUsageIfNeeded(order: ExistingRazorpayOrder) {
  if (!order.couponCode || order.couponUsageCountedAt) {
    return;
  }

  const couponId = await getCouponIdForOrder(order.couponCode);

  if (!couponId) {
    return;
  }

  try {
    await backendClient
      .transaction()
      .patch(order._id, (patch) =>
        patch
          .ifRevisionId(order._rev)
          .set({ couponUsageCountedAt: new Date().toISOString() })
      )
      .patch(couponId, (patch) => patch.inc({ timesUsed: 1 }))
      .commit();
  } catch (error) {
    const latestOrder = await fetchOrderForFinalizationById(order._id);

    if (!latestOrder?.couponUsageCountedAt) {
      throw error;
    }
  }
}

async function fetchOrderForFinalizationById(orderId: string) {
  return await backendClient.fetch<ExistingRazorpayOrder | null>(
    `*[_type == "order" && _id == $orderId][0]{
      _id,
      _rev,
      orderNumber,
      clerkUserId,
      paymentStatus,
      totalPrice,
      paymentCompletedAt,
      stockReducedAt,
      couponUsageCountedAt,
      orderEmailSentAt,
      customerName,
      email,
      address,
      subtotal,
      shipping,
      tax,
      couponCode,
      products[]{
        quantity,
        product->{
          _id,
          _rev,
          name,
          price,
          images,
          stock
        }
      }
    }`,
    { orderId }
  );
}

async function reduceStockIfNeeded(razorpayOrderId: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const order = await fetchOrderForFinalization(razorpayOrderId);

    if (!order) {
      throw new Error(`No local order found for Razorpay order ${razorpayOrderId}`);
    }

    if (order.stockReducedAt) {
      return order;
    }

    const stockReducedAt = new Date().toISOString();
    let transaction = backendClient.transaction().patch(order._id, (patch) =>
      patch.ifRevisionId(order._rev).set({ stockReducedAt })
    );

    for (const item of order.products || []) {
      if (!item.product?._id || !item.product._rev || !item.quantity) {
        continue;
      }

      const availableStock =
        typeof item.product.stock === "number" ? item.product.stock : 0;

      if (item.quantity > availableStock) {
        const message = `${item.product.name || "An item"} only has ${availableStock} in stock`;

        await backendClient
          .patch(order._id)
          .set({
            stockReductionFailedAt: new Date().toISOString(),
            stockReductionError: message,
          })
          .commit();

        return order;
      }

      transaction = transaction.patch(item.product._id, (patch) =>
        patch.ifRevisionId(item.product?._rev || "").dec({
          stock: item.quantity || 0,
        })
      );
    }

    try {
      await transaction.commit();
      return await fetchOrderForFinalization(razorpayOrderId);
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
    }
  }
}

export async function finalizeRazorpayOrder({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  source,
}: RazorpayPaymentDetails) {
  const order = await fetchOrderForFinalization(razorpayOrderId);

  if (!order) {
    throw new Error(`No local order found for Razorpay order ${razorpayOrderId}`);
  }

  const alreadyFinalized = order.paymentStatus === PAYMENT_STATUSES.PAID;
  const paidOrder = await markRazorpayOrderPaid({
    order,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    source,
  });

  try {
    await reduceStockIfNeeded(razorpayOrderId);
  } catch (error) {
    console.error("Failed to reduce stock for Razorpay order:", error);
  }

  try {
    const latestOrder =
      (await fetchOrderForFinalization(razorpayOrderId)) || paidOrder;
    await countCouponUsageIfNeeded(latestOrder);
  } catch (error) {
    console.error("Failed to count coupon usage for Razorpay order:", error);
  }

  try {
    const latestOrder =
      (await fetchOrderForFinalization(razorpayOrderId)) || paidOrder;
    await sendOrderEmailIfNeeded(latestOrder);
  } catch (error) {
    console.error("Failed to send Razorpay order confirmation email:", error);
  }

  if (!alreadyFinalized) {
    try {
      await sendOrderStatusNotification({
        clerkUserId: paidOrder.clerkUserId,
        orderNumber: paidOrder.orderNumber,
        orderId: paidOrder._id,
        status: ORDER_STATUSES.PENDING,
      });
    } catch (error) {
      console.error("Failed to send Razorpay order notification:", error);
    }
  }

  return {
    orderId: paidOrder._id,
    orderNumber: paidOrder.orderNumber,
    alreadyFinalized,
  };
}
