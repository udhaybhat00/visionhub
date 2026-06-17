import { resend } from "@/lib/resend";

export async function sendOrderStatusEmail(
  email: string,
  customerName: string,
  orderNumber: string,
  status: string
) {
  const statusMessages: Record<string, string> = {
    order_confirmed:
      "✅ Your order has been confirmed and is being processed.",

    packed:
      "📦 Your order has been packed and is ready for dispatch.",

    ready_for_delivery:
      "🚚 Your order is ready for delivery.",

    shipped:
      "🚛 Your order is out for delivery.",

    delivered:
      "🎉 Your order has been delivered successfully.",

    cancelled:
      "❌ Your order has been cancelled.",
  };

  const message =
    statusMessages[status] ||
    `Your order status has been updated to ${status}`;

  return await resend.emails.send({
    from: "VisionHub <onboarding@resend.dev>",
    to: email,
    subject: `Order Update - ${orderNumber}`,
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>VisionHub Order Update</h2>

        <p>Hello ${customerName},</p>

        <p>${message}</p>

        <p>
          <strong>Order Number:</strong>
          ${orderNumber}
        </p>

        <hr>

        <p>
          Thank you for shopping with VisionHub.
        </p>
      </div>
    `,
  });
}