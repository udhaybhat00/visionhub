import { contactConfig } from "@/config/contact";

export type RenderedEmail = {
  html: string;
  text: string;
};

type EmailLayoutOptions = {
  title: string;
  preheader: string;
  eyebrow?: string;
  headline: string;
  introHtml?: string;
  bodyHtml: string;
  cta?: {
    label: string;
    href: string;
  };
  footerNote?: string;
  unsubscribeEmail?: string;
};

export type EmailOrderItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type EmailShippingAddress = {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type OrderConfirmationEmailData = {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderDate: string;
  items: EmailOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: EmailShippingAddress;
  estimatedDelivery?: string;
};

const colors = {
  page: "#f4f5f7",
  panel: "#ffffff",
  ink: "#111111",
  muted: "#667085",
  border: "#e5e7eb",
  soft: "#f8fafc",
  gold: "#d4af37",
  goldSoft: "#fbf6df",
  success: "#0f7a46",
  danger: "#b42318",
};

const escapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => escapeMap[char]);
}

export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://visionhub.vercel.app")
    .replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  if (!path) return getBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getEmailSender(): string {
  const configuredFrom =
    process.env.RESEND_FROM_EMAIL || process.env.SENDER_EMAIL_ADDRESS;
  const companyName = contactConfig.company.name || "VisionHub";

  if (!configuredFrom) {
    return `${companyName} <onboarding@resend.dev>`;
  }

  if (configuredFrom.includes("<")) {
    return configuredFrom;
  }

  return `${companyName} <${configuredFrom}>`;
}

export function formatEmailCurrency(amount: number, currency = "INR"): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const value = safeAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency.toUpperCase() === "INR" ? `Rs. ${value}` : `${currency} ${value}`;
}

function buildButton(label: string, href: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
      <tr>
        <td align="center" bgcolor="${colors.ink}" style="border-radius:6px;">
          <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 24px;font-family:Arial,sans-serif;font-size:14px;line-height:18px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:6px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function buildInfoRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${colors.border};font-family:Arial,sans-serif;font-size:13px;line-height:18px;color:${colors.muted};">
        ${escapeHtml(label)}
      </td>
      <td align="right" style="padding:10px 0;border-bottom:1px solid ${colors.border};font-family:Arial,sans-serif;font-size:13px;line-height:18px;font-weight:700;color:${colors.ink};">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function renderEmailLayout(options: EmailLayoutOptions): string {
  const companyName = escapeHtml(contactConfig.company.name || "VisionHub");
  const supportEmail = escapeHtml(contactConfig.emails.support);
  const companyPhone = escapeHtml(contactConfig.company.phone);
  const address = escapeHtml(contactConfig.company.address);
  const city = escapeHtml(contactConfig.company.city);
  const privacyUrl = absoluteUrl(contactConfig.legal.privacyPolicy || "/privacy");
  const termsUrl = absoluteUrl(contactConfig.legal.terms || "/terms");
  const unsubscribeUrl = options.unsubscribeEmail
    ? `${absoluteUrl("/api/newsletter/unsubscribe")}?email=${encodeURIComponent(
        options.unsubscribeEmail
      )}`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${escapeHtml(options.title)}</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
      table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
      img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
      table { border-collapse:collapse !important; }
      body { margin:0 !important; padding:0 !important; width:100% !important; background:${colors.page}; }
      a { color:${colors.ink}; }
      @media screen and (max-width: 640px) {
        .email-container { width:100% !important; }
        .mobile-padding { padding-left:20px !important; padding-right:20px !important; }
        .mobile-stack { display:block !important; width:100% !important; max-width:100% !important; }
        .mobile-center { text-align:center !important; }
        .mobile-hide { display:none !important; }
        .mobile-full { width:100% !important; }
        .mobile-fluid-img { width:100% !important; height:auto !important; }
        .headline { font-size:28px !important; line-height:34px !important; }
        .item-name { font-size:14px !important; line-height:19px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${colors.page};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(options.preheader)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${colors.page};">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" class="email-container" width="640" cellspacing="0" cellpadding="0" border="0" style="width:640px;max-width:640px;">
            <tr>
              <td style="padding:0 0 14px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="font-family:Arial,sans-serif;font-size:22px;line-height:28px;font-weight:800;letter-spacing:0.2px;color:${colors.ink};">
                      ${companyName}
                    </td>
                    <td align="right" class="mobile-hide" style="font-family:Arial,sans-serif;font-size:12px;line-height:18px;color:${colors.muted};">
                      Premium eyewear store
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="background:${colors.ink};border-radius:10px 10px 0 0;padding:30px 34px;" class="mobile-padding">
                ${
                  options.eyebrow
                    ? `<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${colors.gold};">${escapeHtml(
                        options.eyebrow
                      )}</p>`
                    : ""
                }
                <h1 class="headline" style="margin:0;font-family:Arial,sans-serif;font-size:34px;line-height:40px;font-weight:800;color:#ffffff;">
                  ${escapeHtml(options.headline)}
                </h1>
                ${
                  options.introHtml
                    ? `<div style="margin-top:14px;font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:#e5e7eb;">${options.introHtml}</div>`
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="background:${colors.panel};border:1px solid ${colors.border};border-top:0;border-radius:0 0 10px 10px;padding:30px 34px;" class="mobile-padding">
                ${options.bodyHtml}
                ${
                  options.cta
                    ? `<div style="padding:26px 0 4px;">${buildButton(
                        options.cta.label,
                        options.cta.href
                      )}</div>`
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="padding:22px 24px 0;text-align:center;">
                <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:12px;line-height:18px;color:${colors.muted};">
                  ${options.footerNote ? escapeHtml(options.footerNote) : `Need help? Contact ${supportEmail} or ${companyPhone}.`}
                </p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:18px;color:${colors.muted};">
                  ${address}${city ? `, ${city}` : ""}
                </p>
                <p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:12px;line-height:18px;color:${colors.muted};">
                  <a href="${escapeHtml(privacyUrl)}" target="_blank" style="color:${colors.muted};text-decoration:underline;">Privacy</a>
                  <span style="color:#c1c7d0;">&nbsp;|&nbsp;</span>
                  <a href="${escapeHtml(termsUrl)}" target="_blank" style="color:${colors.muted};text-decoration:underline;">Terms</a>
                  ${
                    unsubscribeUrl
                      ? `<span style="color:#c1c7d0;">&nbsp;|&nbsp;</span><a href="${escapeHtml(
                          unsubscribeUrl
                        )}" target="_blank" style="color:${colors.muted};text-decoration:underline;">Unsubscribe</a>`
                      : ""
                  }
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOrderConfirmationEmail(
  data: OrderConfirmationEmailData
): RenderedEmail {
  const orderUrl = absoluteUrl("/user/orders");
  const itemRows = data.items
    .map((item) => {
      const image = item.image
        ? `<img src="${escapeHtml(item.image)}" width="72" alt="${escapeHtml(
            item.name
          )}" style="display:block;width:72px;max-width:72px;height:auto;border-radius:6px;border:1px solid ${colors.border};background:${colors.soft};">`
        : `<div style="width:72px;height:72px;border-radius:6px;border:1px solid ${colors.border};background:${colors.soft};font-family:Arial,sans-serif;font-size:11px;line-height:72px;color:${colors.muted};text-align:center;">Image</div>`;

      return `
        <tr>
          <td width="84" valign="top" style="padding:16px 12px 16px 0;border-bottom:1px solid ${colors.border};">${image}</td>
          <td valign="top" style="padding:16px 12px 16px 0;border-bottom:1px solid ${colors.border};">
            <p class="item-name" style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:15px;line-height:21px;font-weight:700;color:${colors.ink};">${escapeHtml(
              item.name
            )}</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:18px;color:${colors.muted};">Quantity: ${escapeHtml(
              item.quantity
            )}</p>
          </td>
          <td align="right" valign="top" style="padding:16px 0;border-bottom:1px solid ${colors.border};font-family:Arial,sans-serif;font-size:14px;line-height:20px;font-weight:700;color:${colors.ink};white-space:nowrap;">
            ${formatEmailCurrency(item.price * item.quantity)}
          </td>
        </tr>`;
    })
    .join("");

  const bodyHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px;background:${colors.goldSoft};border:1px solid #efe2a5;border-radius:8px;">
      <tr>
        <td style="padding:16px 18px;font-family:Arial,sans-serif;font-size:14px;line-height:22px;color:${colors.ink};">
          <strong>Payment received.</strong> Your order is confirmed and our team will start preparing it for dispatch.
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
      ${buildInfoRow("Order number", data.orderId)}
      ${buildInfoRow("Order date", data.orderDate)}
      ${data.estimatedDelivery ? buildInfoRow("Estimated delivery", data.estimatedDelivery) : ""}
    </table>

    <h2 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:18px;line-height:24px;color:${colors.ink};">Items in your order</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
      ${itemRows}
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${colors.soft};border:1px solid ${colors.border};border-radius:8px;margin:0 0 24px;">
      <tr>
        <td style="padding:18px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${buildInfoRow("Subtotal", formatEmailCurrency(data.subtotal))}
            ${buildInfoRow("Shipping", data.shipping === 0 ? "Free" : formatEmailCurrency(data.shipping))}
            ${buildInfoRow("Tax", formatEmailCurrency(data.tax))}
            <tr>
              <td style="padding:16px 0 0;font-family:Arial,sans-serif;font-size:16px;line-height:22px;font-weight:800;color:${colors.ink};">Total paid</td>
              <td align="right" style="padding:16px 0 0;font-family:Arial,sans-serif;font-size:20px;line-height:26px;font-weight:800;color:${colors.ink};">${formatEmailCurrency(
                data.total
              )}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td class="mobile-stack" width="50%" valign="top" style="padding:0 10px 16px 0;">
          <h3 style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;color:${colors.ink};">Shipping address</h3>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:22px;color:${colors.muted};">
            <strong style="color:${colors.ink};">${escapeHtml(data.shippingAddress.name)}</strong><br>
            ${escapeHtml(data.shippingAddress.street)}<br>
            ${escapeHtml(data.shippingAddress.city)}, ${escapeHtml(data.shippingAddress.state)} ${escapeHtml(data.shippingAddress.zipCode)}<br>
            ${escapeHtml(data.shippingAddress.country)}
          </p>
        </td>
        <td class="mobile-stack" width="50%" valign="top" style="padding:0 0 16px 10px;">
          <h3 style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;color:${colors.ink};">What happens next</h3>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:22px;color:${colors.muted};">
            We will pack your eyewear carefully, notify you when it ships, and keep your order status updated in your account.
          </p>
        </td>
      </tr>
    </table>
  `;

  const text = [
    `Order confirmed: ${data.orderId}`,
    `Hi ${data.customerName},`,
    "Your payment was received and your order is confirmed.",
    "",
    "Items:",
    ...data.items.map(
      (item) =>
        `- ${item.name} x ${item.quantity}: ${formatEmailCurrency(
          item.price * item.quantity
        )}`
    ),
    "",
    `Subtotal: ${formatEmailCurrency(data.subtotal)}`,
    `Shipping: ${data.shipping === 0 ? "Free" : formatEmailCurrency(data.shipping)}`,
    `Tax: ${formatEmailCurrency(data.tax)}`,
    `Total paid: ${formatEmailCurrency(data.total)}`,
    "",
    `Ship to: ${data.shippingAddress.name}, ${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}, ${data.shippingAddress.country}`,
    data.estimatedDelivery ? `Estimated delivery: ${data.estimatedDelivery}` : "",
    `View orders: ${orderUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    html: renderEmailLayout({
      title: `Order confirmation - ${data.orderId}`,
      preheader: `Your VisionHub order ${data.orderId} is confirmed.`,
      eyebrow: "Order confirmation",
      headline: "Your order is confirmed",
      introHtml: `<p style="margin:0;">Hi ${escapeHtml(
        data.customerName
      )}, thanks for shopping with VisionHub. Here is your receipt and delivery summary.</p>`,
      bodyHtml,
      cta: {
        label: "View my orders",
        href: orderUrl,
      },
    }),
    text,
  };
}

export function renderNewsletterWelcomeEmail(email: string): RenderedEmail {
  const shopUrl = absoluteUrl("/shop");
  const bodyHtml = `
    <p style="margin:0 0 22px;font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:${colors.muted};">
      You are subscribed with <strong style="color:${colors.ink};">${escapeHtml(
        email
      )}</strong>. We will send curated eyewear drops, useful lens guides, and subscriber-only offers.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td class="mobile-stack" width="50%" valign="top" style="padding:0 8px 16px 0;">
          <div style="border:1px solid ${colors.border};border-radius:8px;padding:16px;background:${colors.soft};">
            <h3 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;color:${colors.ink};">Early access</h3>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:20px;color:${colors.muted};">See new sunglasses, eyeglasses, and accessories before broad promotions.</p>
          </div>
        </td>
        <td class="mobile-stack" width="50%" valign="top" style="padding:0 0 16px 8px;">
          <div style="border:1px solid ${colors.border};border-radius:8px;padding:16px;background:${colors.soft};">
            <h3 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;color:${colors.ink};">Better buying guides</h3>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:20px;color:${colors.muted};">Get practical advice on frame fit, lens types, UV protection, and care.</p>
          </div>
        </td>
      </tr>
      <tr>
        <td class="mobile-stack" width="50%" valign="top" style="padding:0 8px 16px 0;">
          <div style="border:1px solid ${colors.border};border-radius:8px;padding:16px;background:${colors.soft};">
            <h3 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;color:${colors.ink};">Private offers</h3>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:20px;color:${colors.muted};">Receive sale alerts and subscriber-only promotions when they are available.</p>
          </div>
        </td>
        <td class="mobile-stack" width="50%" valign="top" style="padding:0 0 16px 8px;">
          <div style="border:1px solid ${colors.border};border-radius:8px;padding:16px;background:${colors.soft};">
            <h3 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:15px;line-height:20px;color:${colors.ink};">No clutter</h3>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:20px;color:${colors.muted};">We keep updates relevant and easy to scan from mobile or desktop.</p>
          </div>
        </td>
      </tr>
    </table>
  `;

  return {
    html: renderEmailLayout({
      title: "Welcome to VisionHub",
      preheader: "You are now subscribed to VisionHub updates.",
      eyebrow: "Newsletter",
      headline: "You are on the list",
      introHtml:
        '<p style="margin:0;">Thanks for subscribing. We will keep you close to the best eyewear updates from VisionHub.</p>',
      bodyHtml,
      cta: {
        label: "Shop eyewear",
        href: shopUrl,
      },
      footerNote:
        "You received this email because you subscribed to VisionHub newsletters.",
      unsubscribeEmail: email,
    }),
    text: [
      "Welcome to VisionHub.",
      `You are subscribed with ${email}.`,
      "You will receive curated eyewear drops, buying guides, and subscriber-only offers.",
      `Shop eyewear: ${shopUrl}`,
      `Unsubscribe: ${absoluteUrl("/api/newsletter/unsubscribe")}?email=${encodeURIComponent(
        email
      )}`,
    ].join("\n"),
  };
}

function getStatusContent(status: string) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  const statuses: Record<
    string,
    { headline: string; message: string; tone: "neutral" | "success" | "danger" }
  > = {
    pending: {
      headline: "We received your order",
      message: "Your order is in our queue and will be reviewed shortly.",
      tone: "neutral",
    },
    confirmed: {
      headline: "Your order is confirmed",
      message: "Our team has confirmed your order and will begin preparing it.",
      tone: "success",
    },
    order_confirmed: {
      headline: "Your order is confirmed",
      message: "Our team has confirmed your order and will begin preparing it.",
      tone: "success",
    },
    processing: {
      headline: "Your eyewear is being prepared",
      message: "We are checking and packing your items for dispatch.",
      tone: "neutral",
    },
    packed: {
      headline: "Your order is packed",
      message: "Your order has been packed and is ready for dispatch.",
      tone: "neutral",
    },
    ready_for_delivery: {
      headline: "Your order is ready for delivery",
      message: "Your package is ready for the delivery handoff.",
      tone: "neutral",
    },
    shipped: {
      headline: "Your order is on the way",
      message: "Your package has left our facility and is moving toward you.",
      tone: "neutral",
    },
    delivered: {
      headline: "Your order has been delivered",
      message: "Your order was marked delivered. We hope the fit is perfect.",
      tone: "success",
    },
    cancelled: {
      headline: "Your order was cancelled",
      message: "This order has been cancelled. Contact support if you need help.",
      tone: "danger",
    },
  };

  return (
    statuses[key] || {
      headline: "Your order status changed",
      message: `Your order status is now ${status}.`,
      tone: "neutral" as const,
    }
  );
}

export function renderOrderStatusEmail(data: {
  email: string;
  customerName: string;
  orderNumber: string;
  status: string;
}): RenderedEmail {
  const statusContent = getStatusContent(data.status);
  const ordersUrl = absoluteUrl("/user/orders");
  const badgeColor =
    statusContent.tone === "success"
      ? colors.success
      : statusContent.tone === "danger"
        ? colors.danger
        : colors.ink;

  const bodyHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
      ${buildInfoRow("Order number", data.orderNumber)}
      ${buildInfoRow("Current status", data.status)}
    </table>

    <div style="border:1px solid ${colors.border};border-radius:8px;background:${colors.soft};padding:18px;margin:0 0 22px;">
      <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:12px;line-height:16px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${badgeColor};">
        ${escapeHtml(data.status)}
      </p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:${colors.muted};">
        ${escapeHtml(statusContent.message)}
      </p>
    </div>

    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:22px;color:${colors.muted};">
      You can view your order history any time from your VisionHub account. We will send another update when there is a meaningful change.
    </p>
  `;

  return {
    html: renderEmailLayout({
      title: `Order update - ${data.orderNumber}`,
      preheader: `Your VisionHub order ${data.orderNumber} is now ${data.status}.`,
      eyebrow: "Order update",
      headline: statusContent.headline,
      introHtml: `<p style="margin:0;">Hi ${escapeHtml(
        data.customerName
      )}, here is the latest update for your order.</p>`,
      bodyHtml,
      cta: {
        label: "View order history",
        href: ordersUrl,
      },
    }),
    text: [
      `Order update: ${data.orderNumber}`,
      `Hi ${data.customerName},`,
      `Status: ${data.status}`,
      statusContent.message,
      `View orders: ${ordersUrl}`,
    ].join("\n"),
  };
}

export function renderBasicEmail(data: {
  subject: string;
  preheader?: string;
  text: string;
  html?: string;
}): RenderedEmail {
  const bodyHtml = data.html
    ? data.html
    : `<p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:24px;color:${colors.muted};white-space:pre-line;">${escapeHtml(
        data.text
      )}</p>`;

  return {
    html: renderEmailLayout({
      title: data.subject,
      preheader: data.preheader || data.text.slice(0, 120),
      eyebrow: "VisionHub",
      headline: data.subject,
      bodyHtml,
    }),
    text: data.text,
  };
}
