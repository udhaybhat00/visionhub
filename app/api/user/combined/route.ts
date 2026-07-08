import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// Direct relative path to bypass the path alias issue
import { backendClient } from "../../../../sanity/lib/backendClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Combined API endpoint to fetch all user data in a single request
 * Optimized for Next.js 16 and React 19
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all data in parallel
    const [user, orders, notifications] = await Promise.all([
      // Get user data including employee status
      backendClient.fetch(
        `*[_type == "user" && clerkUserId == $userId][0]{
          _id,
          email,
          role,
          isEmployee,
          walletBalance,
          notifications[] {
            read
          }
        }`,
        { userId }
      ),
      // Get orders count
      backendClient.fetch(`count(*[_type == "order" && clerkUserId == $userId])`, {
        userId,
      }),
      Promise.resolve(null),
    ]);

    const unreadNotifications =
      user?.notifications?.filter((notification: { read?: boolean }) => !notification.read)
        ?.length || 0;

    return NextResponse.json(
      {
        user: user || null,
        ordersCount: orders || 0,
        isEmployee: user?.isEmployee || false,
        unreadNotifications,
        walletBalance: user?.walletBalance || 0,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching combined user data:", error);
    return NextResponse.json(
      {
        user: null,
        ordersCount: 0,
        isEmployee: false,
        unreadNotifications: 0,
        walletBalance: 0,
      },
      { status: 200 }
    );
  }
}
