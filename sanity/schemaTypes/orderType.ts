import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "invoice",
      type: "object",
      fields: [
        { name: "id", type: "string" },
        { name: "number", type: "string" },
        { name: "hosted_invoice_url", type: "url" },
      ],
    },
    defineField({
      name: "stripeCheckoutSessionId",
      title: "Stripe Checkout Session ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkPaymentId",
      title: "Clerk Payment ID",
      type: "string",
      description: "Clerk payment session or transaction ID",
      hidden: ({ document }) => document?.paymentMethod !== "clerk",
    }),
    defineField({
      name: "clerkPaymentStatus",
      title: "Clerk Payment Status",
      type: "string",
      description: "Status of Clerk payment",
      hidden: ({ document }) => document?.paymentMethod !== "clerk",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "razorpayOrderId",
      title: "Razorpay Order ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "razorpay",
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay Payment ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "razorpay",
    }),
    defineField({
      name: "razorpaySignature",
      title: "Razorpay Signature",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "razorpay",
      readOnly: true,
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "tax",
      title: "Tax Amount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shipping",
      title: "Shipping Cost",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
  name: "couponCode",
  title: "Coupon Code",
  type: "string",
}),

defineField({
  name: "couponDiscount",
  title: "Coupon Discount",
  type: "number",
  initialValue: 0,
}),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "zip", title: "Zip Code", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "name", title: "Name", type: "string" }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
  list: [
    { title: "Pending", value: "pending" },
    { title: "Confirmed", value: "confirmed" },
    { title: "Preparing Eyewear", value: "processing" },
    { title: "Shipped", value: "shipped" },
    { title: "Delivered", value: "delivered" },
    { title: "Cancelled", value: "cancelled" },
  ],
},
initialValue: "pending",
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stockReducedAt",
      title: "Stock Reduced At",
      type: "datetime",
      readOnly: true,
      description:
        "Set when product stock has been decremented for this order.",
    }),
    defineField({
      name: "stockReductionFailedAt",
      title: "Stock Reduction Failed At",
      type: "datetime",
      readOnly: true,
      description:
        "Set if a paid order could not decrement stock automatically.",
    }),
    defineField({
      name: "stockReductionError",
      title: "Stock Reduction Error",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "paymentCompletedAt",
      title: "Payment Completed At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "razorpayWebhookProcessedAt",
      title: "Razorpay Webhook Processed At",
      type: "datetime",
      hidden: ({ document }) => document?.paymentMethod !== "razorpay",
      readOnly: true,
    }),
    defineField({
      name: "orderEmailSentAt",
      title: "Order Email Sent At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "couponUsageCountedAt",
      title: "Coupon Usage Counted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
   defineField({
  name: "paymentMethod",
  title: "Payment Method",
  type: "string",
  options: {
    list: [
      { title: "Razorpay", value: "razorpay" },
    ],
  },
}),
   
    // Cancellation tracking fields
    defineField({
      name: "cancellationRequested",
      title: "Cancellation Requested",
      type: "boolean",
      initialValue: false,
      description:
        "Whether customer has requested cancellation (pending admin approval)",
    }),
    defineField({
      name: "cancellationRequestedAt",
      title: "Cancellation Requested At",
      type: "datetime",
      description: "When the customer requested cancellation",
    }),
    defineField({
      name: "cancellationRequestReason",
      title: "Cancellation Request Reason",
      type: "text",
      description: "Reason provided by customer for cancellation request",
    }),
    defineField({
      name: "cancelledAt",
      title: "Cancelled At",
      type: "datetime",
      description: "When the order was actually cancelled",
    }),
    defineField({
      name: "cancelledBy",
      title: "Cancelled By",
      type: "string",
      description: "Who cancelled the order (customer, admin email, or system)",
    }),
    defineField({
      name: "cancellationReason",
      title: "Cancellation Reason",
      type: "text",
      description: "Final cancellation reason (used when actually cancelled)",
    }),
    defineField({
      name: "amountPaid",
      title: "Amount Paid",
      type: "number",
      description: "Total amount paid by customer (for refund tracking)",
    }),
    defineField({
      name: "refundedToWallet",
      title: "Refunded to Wallet",
      type: "boolean",
      initialValue: false,
      description: "Whether refund was added to customer's wallet",
    }),
    defineField({
      name: "refundAmount",
      title: "Refund Amount",
      type: "number",
      description: "Amount refunded to wallet",
    }),
    defineField({
      name: "statusHistory",
      title: "Status History",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "changedBy",
              title: "Changed By",
              type: "string",
              description: "Employee email or admin who changed the status",
            }),
            defineField({
              name: "changedByRole",
              title: "Changed By Role",
              type: "string",
              options: {
               list: [
  { title: "Admin", value: "admin" },
  { title: "System", value: "system" },
]
              },
            }),
            defineField({
              name: "changedAt",
              title: "Changed At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "notes",
              title: "Notes",
              type: "text",
            }),
          ],
          preview: {
            select: {
              status: "status",
              changedBy: "changedBy",
              changedAt: "changedAt",
            },
            prepare(select) {
              return {
                title: select.status,
                subtitle: `By ${select.changedBy} on ${new Date(
                  select.changedAt
                ).toLocaleDateString()}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
      paymentStatus: "paymentStatus",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(
        0,
        5
      )}...${select.orderId.slice(-5)}`;

      // Format status for display
    const statusMap: Record<string, string> = {
  pending: "🟡 Pending",
  confirmed: "🟢 Confirmed",
  processing: "👓 Processing",
  shipped: "🚚 Shipped",
  delivered: "✅ Delivered",
  cancelled: "❌ Cancelled",
};

      const statusDisplay = statusMap[select.status] || select.status;
      const paymentDisplay =
        select.paymentStatus === "paid"
          ? "💳 Paid"
          : "💰 " + select.paymentStatus;

      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${statusDisplay} | ${select.amount} ${select.currency} | ${paymentDisplay}`,
        media: BasketIcon,
      };
    },
  },
});
