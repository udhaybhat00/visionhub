"use client";
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/common/ImageView";
import PriceView from "@/components/PriceView";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import ProductSpecs from "@/components/ProductSpecs";
import ProductReviews from "@/components/ProductReviews";
import { trackProductView } from "@/lib/analytics";
import Link from "next/link";
import Image from "next/image";
import { productImageUrl } from "@/sanity/lib/image";
import RecentlyViewed from "@/components/RecentlyViewed";
import AiStylistCTA from "@/components/AiStylistCTA";

import { Product } from "@/sanity.types";
import {
  BadgeCheck,
  Headphones,
  Ruler,
  ShieldCheck,
  Sparkles,
  StarIcon,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ProductAnimationWrapper,
  ProductImageWrapper,
  ProductDetailsWrapper,
  ProductActionWrapper,
  ProductSectionWrapper,
} from "@/components/ProductClientWrapper";
import RelatedProducts from "./RelatedProducts";
import { BRAND_QUERYResult } from "@/sanity.types";

interface ProductContentProps {
  product: Product;
  relatedProducts: Product[];
  brand: BRAND_QUERYResult | null;
}

const ProductContent = ({
  product,
  relatedProducts,
  brand,
}: ProductContentProps) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [showStickyCart, setShowStickyCart] = useState(false);

  const handleBuyNow = () => {
    addItem(product);
    router.push("/cart");
  };

  const averageRating = product?.averageRating || 0;
  const totalReviews = product?.totalReviews || 0;
  const brandName = brand?.[0]?.brandName || "VisionHub";
  const productTypeLabel = product?.variant
    ? product.variant
        .split("-")
        .filter(Boolean)
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ")
    : "Eyewear";
  const assuranceItems = [
    {
      title: "Authentic Eyewear",
      text: `${brandName} product details verified before dispatch.`,
      icon: BadgeCheck,
    },
    {
      title: "Fit Checked",
      text: "Frame dimensions and sizing shown clearly before purchase.",
      icon: Ruler,
    },
    {
      title: "Protected Delivery",
      text: "Secure packaging with reliable Pan India shipping.",
      icon: Truck,
    },
    {
      title: "Support Ready",
      text: "Help with fit, order status, and product guidance.",
      icon: Headphones,
    },
  ];

  // Track product view on component mount
  useEffect(() => {
    if (product) {
      trackProductView({
        productId: product._id,
        name: product.name || "Unknown",
      });

      const slug = product.slug?.current;
      if (!slug) return;

      const viewedProduct = {
        productId: product._id,
        slug,
        name: product.name || "Product",
        imageUrl: product.images?.[0]
          ? productImageUrl(product.images[0], 500, 500)
          : "",
        price: product.price,
        discount: product.discount || 0,
      };

      try {
        const stored = JSON.parse(
          localStorage.getItem("recentlyViewed") || "[]",
        );
        const existing = Array.isArray(stored) ? stored : [];
        const next = [
          viewedProduct,
          ...existing.filter((item) => item.slug !== slug),
        ].slice(0, 8);

        localStorage.setItem("recentlyViewed", JSON.stringify(next));
      } catch {
        localStorage.setItem("recentlyViewed", JSON.stringify([viewedProduct]));
      }
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setShowStickyCart(true);
      } else {
        setShowStickyCart(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    try {
      const shareData = {
        title: product?.name || "VisionHub",
        text: product?.description || "",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Product link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <ProductAnimationWrapper>
      <Container className="pb-32 md:pb-24">
        {/* Breadcrumb Navigation */}
        <DynamicBreadcrumb
          productData={{
            name: product?.name || "",
            slug: product?.slug?.current || "",
          }}
        />

        <div className="flex flex-col min-[900px]:flex-row gap-5 min-[900px]:gap-10 pb-6">
          {/* Product Images */}
          {product?.images && (
            <ProductImageWrapper>
              <ImageView images={product?.images} isStock={product?.stock} />
            </ProductImageWrapper>
          )}

          {/* Product Details */}
          <ProductDetailsWrapper>
            {/* Title and Category */}
            <div className="space-y-3">
              {product?.brand && (
                <Badge className="bg-shop_light_green/10 text-shop_dark_green hover:bg-shop_light_green/20 w-fit">
                  {brand && brand.length > 0 && (
                    <span className="font-semibold tracking-wide">
                      {brand[0]?.brandName}
                    </span>
                  )}
                </Badge>
              )}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-shop_dark_green leading-tight">
                {product?.name}
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-dark-text leading-relaxed">
                {product?.description}
              </p>

              {/* Enhanced Rating Display */}
              {totalReviews > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        size={16}
                        className={`${
                          index < Math.floor(averageRating)
                            ? "text-shop_light_green fill-shop_light_green"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-shop_dark_green">
                    {averageRating.toFixed(1)} ({totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        size={16}
                        className="text-gray-300"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">No reviews yet</span>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 border-t border-b border-gray-200 py-6 bg-white/70 rounded-lg px-4">
              <PriceView
                price={product?.price}
                discount={product?.discount}
                className="text-2xl font-bold"
              />

              {/* Enhanced Stock Status */}
              <div className="flex items-center gap-3">
                <Badge
                  className={`text-sm font-semibold ${
                    product?.stock === 0
                      ? "bg-red-100 text-red-700 hover:bg-red-100"
                      : product?.stock && product.stock < 10
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {product?.stock === 0
                    ? "Out of Stock"
                    : product?.stock && product.stock < 10
                      ? `Only ${product.stock} left!`
                      : "In Stock"}
                </Badge>
              </div>

              {product?.discount && product.discount > 0 && (
                <div className="rounded-lg bg-shop_orange/10 px-3 py-2 text-sm font-semibold text-shop_orange">
                  Save {product.discount}% on this frame
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <ProductActionWrapper delay={0.3}>
              <div className="space-y-3">
                <AddToCartButton product={product} />

                <div className="flex gap-3">
                  <Button
                    className="flex-1 h-14 rounded-xl bg-shop_orange hover:bg-shop_orange/90 text-base font-bold"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>

                  <div className="w-14 h-14 flex items-center justify-center border border-shop_orange/30 rounded-xl bg-white">
                    <FavoriteButton showProduct={true} product={product} />
                  </div>
                </div>
              </div>
            </ProductActionWrapper>

            {/* Product Highlights */}
            {product?.highlights && product.highlights.length > 0 && (
              <div className="bg-shop_light_green/5 border border-shop_light_green/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-shop_dark_green mb-3">
                  Product Highlights
                </h3>

                <ul className="space-y-2">
                  {product.highlights.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <span className="text-shop_light_green">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Links */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
              <Link
                href="/faq"
                className="flex items-center gap-2 text-sm text-black hover:text-shop_light_green hoverEffect transition-colors"
              >
                <FaRegQuestionCircle className="text-lg" />
                <span>Ask a Question</span>
              </Link>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-black hover:text-shop_light_green hoverEffect transition-colors"
              >
                <FiShare2 className="text-lg" />
                <span>Share</span>
              </button>
            </div>
          </ProductDetailsWrapper>
        </div>

        <ProductSectionWrapper delay={0.6}>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] md:p-6">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-shop_light_green">
                  VisionHub Assurance
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                  Built for a confident eyewear purchase
                </h2>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600">
                <Sparkles className="h-4 w-4 text-shop_orange" />
                {productTypeLabel}
              </div>
            </div>

            <div className="grid gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              {assuranceItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-shop_orange shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ProductSectionWrapper>

        <ProductSectionWrapper delay={0.7}>
          <ProductSpecs product={product} brand={brand} />
        </ProductSectionWrapper>

        <ProductSectionWrapper delay={0.75}>
          <AiStylistCTA compact />
        </ProductSectionWrapper>

        {/* Customer Reviews */}
        <ProductSectionWrapper delay={0.8}>
          <ProductReviews
            productId={product._id}
            productName={product.name || "this product"}
          />
        </ProductSectionWrapper>

        <ProductSectionWrapper delay={0.85}>
          <RecentlyViewed currentSlug={product.slug?.current} />
        </ProductSectionWrapper>

        {/* Related Products */}
        <ProductSectionWrapper delay={0.9}>
          <RelatedProducts
            currentProduct={product}
            relatedProducts={relatedProducts}
          />
        </ProductSectionWrapper>
        {showStickyCart && (
          <div className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-slate-200/80 bg-white/95 shadow-[0_-16px_38px_rgba(15,23,42,0.12)] backdrop-blur-xl md:block">
            <div className="mx-auto flex max-w-7xl items-center gap-5 px-8 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                  {product?.images?.[0] ? (
                    <Image
                      src={productImageUrl(product.images[0], 180, 180)}
                      alt={product?.name || "Product"}
                      width={64}
                      height={64}
                      className="size-full object-contain p-1.5"
                    />
                  ) : (
                    <ShieldCheck className="size-6 text-shop_orange" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-950">
                    {brandName}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                    {product?.name}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-5">
                <PriceView
                  price={product?.price}
                  discount={product?.discount}
                  className="text-2xl font-extrabold"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <FavoriteButton showProduct={true} product={product} />
                </div>

                <div className="w-[320px]">
                  <AddToCartButton
                    product={product}
                    className="!h-12 rounded-full bg-shop_light_green text-base font-extrabold shadow-[0_10px_24px_rgba(0,148,157,0.28)] hover:bg-shop_dark_green"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showStickyCart && (
          <div className="fixed inset-x-0 bottom-[72px] z-40 px-3 md:hidden">
            <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg border border-gray-200/80 bg-white/95 px-3 py-2 shadow-[0_16px_45px_rgba(15,15,15,0.18)] backdrop-blur-xl">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  {product?.images?.[0] ? (
                    <Image
                      src={productImageUrl(product.images[0], 160, 160)}
                      alt={product?.name || "Product"}
                      width={52}
                      height={52}
                      className="size-full object-contain p-1"
                    />
                  ) : (
                    <ShieldCheck className="size-5 text-shop_orange" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-5 text-gray-950">
                    {product?.name}
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <p className="text-base font-extrabold leading-none text-shop_dark_green">
                      ₹{product?.price?.toLocaleString()}
                    </p>

                    {product?.discount ? (
                      <p className="whitespace-nowrap text-[11px] font-bold leading-none text-shop_orange">
                        Save ₹
                        {Math.round(
                          (product.price || 0) * (product.discount / 100),
                        )}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="w-[124px] shrink-0">
                <AddToCartButton
                  product={product}
                  className="!h-11 rounded-lg text-sm font-bold tracking-normal shadow-md shadow-black/10"
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </ProductAnimationWrapper>
  );
};

export default ProductContent;
