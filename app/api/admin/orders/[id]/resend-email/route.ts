import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { isUserAdmin } from "@/lib/adminUtils";
import { sendOrderStatusEmail } from "@/lib/orderEmails";
import { writeClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const order = await writeClient.fetch(
      `*[_type == "order" && _id == $id][0]{
        _id,
        orderNumber,
        customerName,
        email,
        status
      }`,
      { id }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.email) {
      return NextResponse.json(
        { error: "Order does not have a customer email" },
        { status: 400 }
      );
    }

    const result = await sendOrderStatusEmail(
      order.email,
      order.customerName || "Customer",
      order.orderNumber || order._id,
      order.status || "pending"
    );

    await writeClient
      .patch(order._id)
      .set({ orderEmailSentAt: new Date().toISOString() })
      .commit();

    return NextResponse.json({
      success: true,
      message: "Order email resent",
      result,
    });
  } catch (error) {
    console.error("Error resending admin order email:", error);
    return NextResponse.json(
      { error: "Failed to resend order email" },
      { status: 500 }
    );
  }
}
