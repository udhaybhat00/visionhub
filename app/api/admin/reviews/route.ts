import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { isUserAdmin } from "@/lib/adminUtils";

// PATCH - Approve, reject, or update a review reply/admin note
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user details to check admin status
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    // Check if current user is admin
    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reviewId, action, adminNotes } = body;

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: "Review ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject", "reply"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'reject', or 'reply'" },
        { status: 400 }
      );
    }

    // Get the review with product reference
    const review = await writeClient.fetch(
      `*[_type == "review" && _id == $reviewId][0]{
        _id,
        rating,
        product->{
          _id,
          averageRating,
          totalReviews,
          ratingDistribution
        }
      }`,
      { reviewId }
    );

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const newStatus =
      action === "approve"
        ? "approved"
        : action === "reject"
          ? "rejected"
          : undefined;

    // Update the review status
    const reviewPatch = writeClient.patch(reviewId).set({
      updatedAt: now,
      ...(newStatus ? { status: newStatus } : {}),
      ...(action === "approve"
        ? {
            approvedAt: now,
            approvedBy: userEmail,
          }
        : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    });

    await reviewPatch.commit();

    if (action === "reply") {
      return NextResponse.json({
        success: true,
        message: "Review reply saved",
      });
    }

    // If approved, update product rating statistics
    if (action === "approve" && review.product) {
      const productId = review.product._id;

      // Get all approved reviews for this product
      const approvedReviews = await writeClient.fetch(
        `*[_type == "review" && product._ref == $productId && status == "approved"]{
          rating
        }`,
        { productId }
      );

      if (approvedReviews && approvedReviews.length > 0) {
        // Calculate new statistics
        const totalReviews = approvedReviews.length;
        const totalRating = approvedReviews.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        );
        const averageRating = totalRating / totalReviews;

        // Calculate rating distribution
        const distribution = approvedReviews.reduce(
          (
            acc: {
              fiveStars: number;
              fourStars: number;
              threeStars: number;
              twoStars: number;
              oneStar: number;
            },
            r: { rating: number }
          ) => {
            if (r.rating === 5) acc.fiveStars++;
            else if (r.rating === 4) acc.fourStars++;
            else if (r.rating === 3) acc.threeStars++;
            else if (r.rating === 2) acc.twoStars++;
            else if (r.rating === 1) acc.oneStar++;
            return acc;
          },
          {
            fiveStars: 0,
            fourStars: 0,
            threeStars: 0,
            twoStars: 0,
            oneStar: 0,
          }
        );

        // Update product with new statistics
        await writeClient
          .patch(productId)
          .set({
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews,
            ratingDistribution: distribution,
          })
          .commit();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Review ${action}d successfully`,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const reviewIds: string[] = body.reviewIds || (body.reviewId ? [body.reviewId] : []);

    if (reviewIds.length === 0) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    for (const reviewId of reviewIds) {
      await writeClient.delete(reviewId);
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted",
      count: reviewIds.length,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

// GET - Get reviews by status
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user details to check admin status
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;

    // Check if current user is admin
    if (!userEmail || !isUserAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "pending";

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status parameter" },
        { status: 400 }
      );
    }

    // Fetch reviews by status
    const reviews = await writeClient.fetch(
      `*[_type == "review" && status == $status] | order(createdAt desc) {
        _id,
        rating,
        title,
        content,
        isVerifiedPurchase,
        helpful,
        createdAt,
        updatedAt,
        approvedAt,
        adminNotes,
        product->{
          _id,
          name,
          "slug": slug.current,
          "image": images[0].asset->url
        },
        user->{
          _id,
          firstName,
          lastName,
          email,
          profileImage {
            asset-> {
              url
            }
          }
        }
      }`,
      { status }
    );

    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      count: reviews?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
