import { memo } from "react";
import { Product } from "@/sanity.types";
import PriceView from "./PriceView";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import Title from "./Title";
import { StarIcon } from "@sanity/icons";
import ProductSideMenu from "./ProductSideMenu";
import { Flame, ImageOff } from "lucide-react";
import { productImageUrl } from "@/sanity/image";

const ProductCard = memo(({ product }: { product: Product }) => {
  const images = product?.images;
  const hasImages = images && images.length > 0;
  const primaryImage = images?.[0] ?? null;
  const secondaryImage = images && images.length > 1 ? images[1] : null;

  return (
    <div className="text-sm border rounded-xl border-ink/10 group bg-bone transition-brand hover:-translate-y-1 hover:border-amber-brand/25 hover:shadow-[0_22px_44px_-18px_rgba(34,27,18,0.22)]">
      <div className="relative group/image overflow-hidden bg-cream-deep aspect-square rounded-t-xl">
        <Link href={`/product/${product?.slug?.current}`}>
          {primaryImage ? (
            <>
              <img
                src={productImageUrl(primaryImage, 700, 700)}
                className={`w-full h-full object-contain object-center p-4 transition-opacity duration-500 ${
                  secondaryImage
                    ? "group-hover/image:opacity-0"
                    : ""
                } ${
                  product?.stock !== 0
                    ? "group-hover:scale-105"
                    : "opacity-50"
                }`}
                alt={product?.name || "Product Image"}
                loading="lazy"
              />
              {secondaryImage && (
                <img
                  src={productImageUrl(secondaryImage, 700, 700)}
                  className="absolute inset-0 w-full h-full object-contain object-center p-4 opacity-0 transition-opacity duration-500 group-hover/image:opacity-100 group-hover:scale-105"
                  alt={`${product?.name || "Product"} alternate view`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 p-4">
              <ImageOff className="h-8 w-8 text-gray-300" />
              <span className="text-xs font-medium text-gray-400">
                Image coming soon
              </span>
            </div>
          )}
        </Link>
        <ProductSideMenu product={product} />
        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-xs border border-dark-color/50 px-2 rounded-full group-hover:border-light-green hover:text-shop_dark_green hoverEffect">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-light-text">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={
                  index < Math.round(product?.averageRating || 0)
                    ? "text-shop_light_green"
                    : " text-light-text"
                }
                fill={
                  index < Math.round(product?.averageRating || 0)
                    ? "#93D991"
                    : "#ababab"
                }
              />
            ))}
          </div>
          <p className="text-light-text text-xs tracking-wide">
            {product?.totalReviews
              ? `${product.totalReviews} ${
                  product.totalReviews === 1 ? "Review" : "Reviews"
                }`
              : "No Reviews"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${
              product?.stock === 0
                ? "text-red-600"
                : "text-shop_dark_green/80 font-semibold"
            }`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        <AddToCartButton product={product}className="w-full rounded-full" />
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
