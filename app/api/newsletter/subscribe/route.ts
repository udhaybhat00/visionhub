import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/actions/subscriptionActions";
import { resend } from "@/lib/resend";
import {
  getEmailSender,
  renderNewsletterWelcomeEmail,
} from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email presence
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get client info
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email,
      source: "footer",
      ipAddress,
      userAgent,
    });

    // If subscription failed or already subscribed
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
          alreadySubscribed: result.alreadySubscribed || false,
        },
        { status: result.alreadySubscribed ? 200 : 400 }
      );
    }

    // Send welcome email
   try {
  const welcomeEmail = renderNewsletterWelcomeEmail(email);
  await resend.emails.send({
    from: getEmailSender(),
    to: email,
    subject: "Welcome to VisionHub",
    html: welcomeEmail.html,
    text: welcomeEmail.text,
  });

  console.log("Welcome email sent successfully");
} catch (error) {
  console.error("Failed to send welcome email:", error);
}

    return NextResponse.json(
      {
        message: result.message,
        subscriptionId: result.data?.subscriptionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
