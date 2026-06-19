import { resend } from "@/lib/resend";
import {
  getEmailSender,
  renderOrderStatusEmail,
} from "@/lib/emailTemplates";

export async function sendOrderStatusEmail(
  email: string,
  customerName: string,
  orderNumber: string,
  status: string
) {
  const renderedEmail = renderOrderStatusEmail({
    email,
    customerName,
    orderNumber,
    status,
  });

  return await resend.emails.send({
    from: getEmailSender(),
    to: email,
    subject: `Order update - ${orderNumber}`,
    html: renderedEmail.html,
    text: renderedEmail.text,
  });
}
