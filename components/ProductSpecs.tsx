"use client";

import { BRAND_QUERYResult, Product } from "@/sanity.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import {
  Award,
  Check,
  Clock3,
  Package,
  Shield,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

interface ProductSpecsProps {
  product: Product;
  brand?: BRAND_QUERYResult | null;
}

const ProductSpecs = ({ product, brand }: ProductSpecsProps) => {
  const stockCount = product?.stock ?? 0;
  const isOutOfStock = stockCount === 0;
  const brandName = brand?.[0]?.brandName || "VisionHub Select";
  const warranty = product?.warranty || "1 Year Warranty";
  const sku = product?.slug?.current
    ? `YE-${product.slug.current.slice(-8).toUpperCase()}`
    : "YE-READY";

  const Row = ({
    label,
    value,
    accent,
  }: {
    label: string;
    value: ReactNode;
    accent?: boolean;
  }) => (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-gray-50/80 px-3 py-2">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span
        className={`text-sm font-semibold text-right ${
          accent ? "text-shop_dark_green" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );

  const CheckItem = ({ children }: { children: ReactNode }) => (
    <div className="flex items-center gap-2.5 text-sm text-gray-700">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="font-medium">{children}</span>
    </div>
  );

  const cardClass =
    "group overflow-hidden border border-gray-200/80 bg-white shadow-[0_12px_35px_rgba(15,15,15,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-shop_orange/40 hover:shadow-[0_18px_45px_rgba(15,15,15,0.09)]";
  const iconClass =
    "flex size-9 items-center justify-center rounded-lg bg-shop_orange/10 text-shop_orange ring-1 ring-shop_orange/15";

  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {/* Product Features */}
      <Card className={cardClass}>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <span className={iconClass}>
              <Package className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base font-bold text-shop_dark_green">
                Product Info
              </CardTitle>
              <p className="text-xs text-gray-500">Essentials at a glance</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          <Row
            label="Stock"
            accent
            value={
              <Badge
                variant={isOutOfStock ? "destructive" : "default"}
                className={
                  isOutOfStock
                    ? "rounded-md"
                    : "rounded-md bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-50"
                }
              >
                {isOutOfStock ? "Out of Stock" : `${stockCount} Available`}
              </Badge>
            }
          />
          <Row label="Brand" value={brandName} />
          <Row
            label="SKU"
            value={
              <span className="font-mono text-xs text-gray-600">{sku}</span>
            }
          />
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card className={cardClass}>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <span className={iconClass}>
              <Truck className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base font-bold text-shop_dark_green">
                Shipping
              </CardTitle>
              <p className="text-xs text-gray-500">Fast delivery options</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <CheckItem>Free Shipping</CheckItem>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Clock3 className="size-3.5" />
                Standard
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                2-5 days
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Sparkles className="size-3.5" />
                Express
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                1-2 days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warranty */}
      <Card className={cardClass}>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <span className={iconClass}>
              <Shield className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base font-bold text-shop_dark_green">
                Warranty
              </CardTitle>
              <p className="text-xs text-gray-500">Protected purchase</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <CheckItem>{warranty}</CheckItem>
          <CheckItem>Secure payments</CheckItem>
          <CheckItem>Dedicated assistance</CheckItem>
        </CardContent>
      </Card>

      {/* Quality Assurance */}
      <Card className={cardClass}>
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <span className={iconClass}>
              <Award className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base font-bold text-shop_dark_green">
                Quality
              </CardTitle>
              <p className="text-xs text-gray-500">Checked before dispatch</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <CheckItem>Quality tested</CheckItem>
          <CheckItem>Authentic product</CheckItem>
          <div className="flex items-center gap-2.5 text-sm text-gray-700">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-shop_orange/10 text-shop_orange">
              <ShieldCheck className="size-3.5" strokeWidth={2.6} />
            </span>
            <span className="font-medium">Secure packaging</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSpecs;
