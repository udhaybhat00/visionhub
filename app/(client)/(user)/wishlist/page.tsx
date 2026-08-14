import { currentUser } from "@clerk/nextjs/server";
import Container from "@/components/Container";
import NoAccessToCart from "@/components/NoAccessToCart";
import WishlistProducts from "@/components/WishlistProducts";
import { Heart } from "lucide-react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";

const WishListPage = async () => {
  const user = await currentUser();

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <DynamicBreadcrumb />

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-5 w-5 text-amber-brand" />
        <div>
          <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">
            My Wishlist
          </h1>
          <p className="text-ink-soft mt-1 text-sm">
            Save your favorite items for later
          </p>
        </div>
      </div>

      {/* Content */}
      {user ? (
        <WishlistProducts />
      ) : (
        <NoAccessToCart details="Log in to save and view your favorite products. Don't miss out on the items you love!" />
      )}
    </Container>
  );
};

export default WishListPage;
