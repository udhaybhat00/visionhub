"use client";
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/common/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductsDetails from "@/components/ProductsDetails";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import ProductSpecs from "@/components/ProductSpecs";
import ProductReviews from "@/components/ProductReviews";
import { trackProductView } from "@/lib/analytics";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Product } from "@/sanity.types";
import {
  CornerDownLeft,
  StarIcon,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import React, { useEffect } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  // Get actual review data from product
  const averageRating = product?.averageRating || 0;
  const totalReviews = product?.totalReviews || 0;

  // Track product view on component mount
  useEffect(() => {
    if (product) {
      trackProductView({
        productId: product._id,
        name: product.name || "Unknown",
      });
    }
  }, [product]);

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
      <Container>
        {/* Breadcrumb Navigation */}
        <DynamicBreadcrumb
          productData={{
            name: product?.name || "",
            slug: product?.slug?.current || "",
          }}
        />

        <div className="flex flex-col md:flex-row gap-5 md:gap-10 pb-6">
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

              {/* Discount Information */}
              {product?.discount && product.discount > 0 && (
                <div className="bg-shop_orange/10 text-shop_orange px-3 py-2 rounded-lg text-sm font-medium">
                  💰 Save {product.discount}% on this item!
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <ProductActionWrapper delay={0.3}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-5">
                <AddToCartButton product={product} />
                <FavoriteButton showProduct={true} product={product} />
              </div>
            </ProductActionWrapper>

            {/* Product Characteristics */}
            <ProductActionWrapper delay={0.4}>
              <ProductCharacteristics product={product} brand={brand} />
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
</Link>        <button className="flex items-center gap-2 text-sm text-black hover:text-shop_light_green hoverEffect transition-colors">
                <TbTruckDelivery className="text-lg" />
                <span>Fast Delivery</span>
              </button>
             <button
  onClick={handleShare}
  className="flex items-center gap-2 text-sm text-black hover:text-shop_light_green hoverEffect transition-colors"
>
  <FiShare2 className="text-lg" />
  <span>Share</span>
</button>
            </div>

            {/* Delivery Information */}
            <ProductActionWrapper delay={0.5}>
              <div className="flex flex-col">
                <div className="border border-light-color/25 border-b-0 p-4 flex items-center gap-3 bg-white/70 rounded-t-lg">
                  <Truck size={32} className="text-shop_orange" />
                  <div>
                    <p className="text-lg font-semibold text-black">
                          Pan India Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Fast and reliable shipping available across India.
                    </p>
                  </div>
                </div>
                <div className="border border-light-color/25 p-4 flex items-center gap-3 bg-white/70 rounded-b-lg">
                  <ShieldCheck size={32} className="text-shop_orange" />
                 <div>
  <p className="text-lg font-semibold text-black">
    Secure Shopping
  </p>
  <p className="text-sm text-gray-500">
    Safe payments, order tracking, and dedicated customer support.
  </p>
</div>
                </div>
              </div>
            </ProductActionWrapper>
          </ProductDetailsWrapper>
        </div>

        {/* Product Details Section */}
        <ProductSectionWrapper delay={0.6}>
  <ProductsDetails product={product} />
</ProductSectionWrapper>

        {/* Trust Indicators & Guarantees */}
        <ProductSectionWrapper delay={0.7}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-8">
            <Card className="border-2 border-gray-100 text-center p-4">
              <Shield className="h-8 w-8 text-shop_orange mx-auto mb-2" />
              <h3 className="font-semibold text-shop_dark_green mb-1">
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600">
                100% secure payment with SSL encryption
              </p>
            </Card>

            <Card className="border-2 border-gray-100 text-center p-4">
              <Truck className="h-8 w-8 text-shop_orange mx-auto mb-2" />
              <h3 className="font-semibold text-shop_dark_green mb-1">
                Fast Delivery
              </h3>
              <p className="text-sm text-gray-600">
                Free shipping on orders over ₹999

              </p>
            </Card>

<Card className="border-2 border-gray-100 text-center p-4">
  <ShieldCheck className="h-8 w-8 text-shop_orange mx-auto mb-2" />
  <h3 className="font-semibold text-shop_dark_green mb-1">
    100% Authentic
  </h3>
  <p className="text-sm text-gray-600">
    Genuine branded eyewear guaranteed
  </p>
</Card>
          </div>
        </ProductSectionWrapper>

        {/* Product Specifications */}
        <ProductSectionWrapper delay={0.8}>
          <ProductSpecs product={product} />
        </ProductSectionWrapper>

        {/* Customer Reviews */}
        <ProductSectionWrapper delay={0.9}>
          <ProductReviews
            productId={product._id}
            productName={product.name || "this product"}
          />
        </ProductSectionWrapper>

        {/* Related Products */}
        <ProductSectionWrapper delay={1.0}>
          <RelatedProducts
            currentProduct={product}
            relatedProducts={relatedProducts}
          />
        </ProductSectionWrapper>
      </Container>
    </ProductAnimationWrapper>
  );
};

export default ProductContent;
