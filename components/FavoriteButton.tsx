"use client";
import { Product } from "@/sanity.types";
import useCartStore from "@/store";
import { Heart } from "lucide-react";
import BreadcrumbLink from "@/components/BreadcrumbLink";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import _ from "lodash";

const FavoriteButton = ({
  showProduct = false,
  product,
  variant = "default",
}: {
  showProduct?: boolean;
  product?: Product;
  variant?: "default" | "header";
}) => {
  const { favoriteProduct, addToFavorite } = useCartStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const availableItem = _.find(
      favoriteProduct,
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      const isRemoving = !!existingProduct;

      addToFavorite(product).then(() => {
        toast.success(
          isRemoving ? "Removed from wishlist" : "Added to wishlist",
          {
            description: isRemoving
              ? "Product removed successfully!"
              : "Product added successfully!",
            duration: 3000,
          }
        );
      });
    }
  };
  return (
    <>
      {!showProduct ? (
        <BreadcrumbLink
          href={"/wishlist"}
          className={
            variant === "header"
              ? "group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-gray-700 shadow-sm transition-all hover:border-shop_orange hover:bg-shop_light_bg hover:text-shop_dark_green"
              : "group relative hover:text-shop_light_green hoverEffect"
          }
        >
          <Heart
            className={
              variant === "header"
                ? "h-5 w-5 transition-colors"
                : "group-hover:text-shop_light_green hoverEffect mt-.5"
            }
          />
          {/* {isArray(favoriteProduct) && favoriteProduct.length > 0 && ( */}
          <span
            className={`absolute -right-1 -top-1 flex ${
              variant === "header"
                ? "h-4 min-w-4 text-[10px]"
                : "h-[14px] min-w-[14px] text-xs"
            } items-center justify-center rounded-full bg-shop_btn_dark_green font-semibold text-white ${
              favoriteProduct.length > 9 ? "px-1" : ""
            }`}
          >
            {/* {favoriteProduct.length > 9 ? "9+" : favoriteProduct.length} */}
            {Array.isArray(favoriteProduct) && favoriteProduct.length > 0
              ? favoriteProduct.length > 9
                ? "9+"
                : favoriteProduct.length
              : 0}
          </span>
          {/* )} */}
        </BreadcrumbLink>
      ) : (
        <button
          onClick={handleFavorite}
        className="

    group

    relative

    w-full

    h-full

    flex

    items-center

    justify-center

    border

    border-shop_orange/40

    rounded-xl

    bg-white

    hover:bg-shop_orange/5

    transition-all

    duration-300

  "
        >
        <Heart

  size={24}

  fill={existingProduct ? "#d4af37" : "transparent"}

  className="

    text-shop_orange

    group-hover:scale-110

    transition-all

    duration-300

  "

/>
        </button>
      )}
    </>
  );
};

export default FavoriteButton;
