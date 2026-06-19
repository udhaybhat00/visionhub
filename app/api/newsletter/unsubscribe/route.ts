import { NextRequest, NextResponse } from "next/server";
import { unsubscribeFromNewsletter } from "@/actions/subscriptionActions";
import { escapeHtml } from "@/lib/emailTemplates";

async function unsubscribe(email: string) {
  if (!email) {
    return {
      success: false,
      status: 400,
      body: { error: "Email is required" },
    };
  }

  const result = await unsubscribeFromNewsletter(email);

  if (!result.success) {
    return {
      success: false,
      status: 400,
      body: { error: result.message },
    };
  }

  return {
    success: true,
    status: 200,
    body: { message: result.message },
  };
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email") || "";
    const result = await unsubscribe(email);
    const escapedEmail = escapeHtml(email);

    if (!result.success) {
      return NextResponse.json(result.body, { status: result.status });
    }

    return new NextResponse(
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Unsubscribed</title>
  </head>
  <body style="margin:0;background:#f4f5f7;font-family:Arial,sans-serif;color:#111111;">
    <main style="max-width:560px;margin:48px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:32px;text-align:center;">
      <h1 style="margin:0 0 12px;font-size:28px;line-height:34px;">You are unsubscribed</h1>
      <p style="margin:0;color:#667085;font-size:15px;line-height:24px;">You will no longer receive VisionHub newsletter emails at ${escapedEmail}.</p>
      <p style="margin:24px 0 0;"><a href="/" style="color:#111111;font-weight:700;">Return to VisionHub</a></p>
    </main>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Newsletter unsubscribe API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const result = await unsubscribe(email);

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Newsletter unsubscribe API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
