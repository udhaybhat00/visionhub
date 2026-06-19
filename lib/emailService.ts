import { resend } from "@/lib/resend";
import {
  getEmailSender,
  renderBasicEmail,
  renderOrderConfirmationEmail,
  type EmailOrderItem as OrderItem,
  type EmailShippingAddress as ShippingAddress,
  type OrderConfirmationEmailData as OrderConfirmationData,
} from "@/lib/emailTemplates";

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface SendMailParams {
  email: string;
  subject: string;
  text: string;
  html?: string;
}

const sendOrderConfirmationEmail = async (
  data: OrderConfirmationData
): Promise<EmailResponse> => {
  try {
    const email = renderOrderConfirmationEmail(data);
    const result = await resend.emails.send({
      from: getEmailSender(),
      to: data.customerEmail,
      subject: `Order confirmed - ${data.orderId}`,
      html: email.html,
      text: email.text,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

const sendMail = async ({
  email,
  subject,
  text,
  html,
}: SendMailParams): Promise<EmailResponse> => {
  try {
    const renderedEmail = renderBasicEmail({ subject, text, html });
    const result = await resend.emails.send({
      from: getEmailSender(),
      to: email,
      subject,
      html: renderedEmail.html,
      text: renderedEmail.text,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export { sendOrderConfirmationEmail, sendMail };
export type {
  OrderConfirmationData,
  OrderItem,
  ShippingAddress,
  EmailResponse,
  SendMailParams,
};
