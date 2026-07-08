"use client";

import { BRAND_QUERYResult, Product } from "@/sanity.types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, ArrowUpDown, Glasses, Ruler } from "lucide-react";
import type { ReactNode } from "react";

interface ProductSpecsProps {
  product: Product;
  brand?: BRAND_QUERYResult | null;
}

const emptyValue = "Not specified";

const formatValue = (value?: string | number | boolean | null) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === undefined || value === null || value === "") return emptyValue;
  return String(value);
};

const formatDimension = (value?: string) => {
  if (!value) return emptyValue;
  return /\d/.test(value) && !/mm|cm|inch|inches/i.test(value)
    ? `${value} mm`
    : value;
};

const makeSku = (product: Product) =>
  product?.slug?.current
    ? `VH-${product.slug.current.slice(-10).toUpperCase()}`
    : `VH-${product._id.slice(-10).toUpperCase()}`;

const ProductSpecs = ({ product, brand }: ProductSpecsProps) => {
  const brandName = brand?.[0]?.brandName || "VisionHub";

  const dimensions = [
    {
      label: "Temple Size",
      value: formatDimension(product.templeLength),
      icon: <Ruler className="h-9 w-9" />,
      direction: <ArrowLeftRight className="h-3.5 w-3.5" />,
    },
    {
      label: "Bridge",
      value: formatDimension(product.bridgeWidth),
      icon: <Glasses className="h-9 w-9" />,
      direction: <ArrowLeftRight className="h-3.5 w-3.5" />,
    },
    {
      label: "Lens Width",
      value: formatDimension(product.lensWidth),
      icon: <Glasses className="h-9 w-9" />,
      direction: <ArrowLeftRight className="h-3.5 w-3.5" />,
    },
    {
      label: "Frame Size",
      value: formatValue(product.frameSize),
      icon: <Glasses className="h-9 w-9" />,
      direction: <ArrowUpDown className="h-3.5 w-3.5" />,
    },
  ];

  const specs = [
    { label: "SKU", value: makeSku(product) },
    { label: "Brand", value: brandName },
    { label: "Gender", value: formatValue(product.gender) },
    { label: "Size", value: formatValue(product.frameSize) },
    { label: "Lens Color", value: formatValue(product.lensColor) },
    { label: "Frame Shape", value: formatValue(product.frameShape) },
    { label: "Frame Material", value: formatValue(product.frameMaterial) },
    { label: "Lens Type", value: formatValue(product.lensType) },
    { label: "UV Protection", value: formatValue(product.uvProtection) },
    { label: "Warranty", value: formatValue(product.warranty) },
    {
      label: "Prescription",
      value: formatValue(product.prescriptionAvailable),
    },
    {
      label: "Availability",
      value:
        product.stock === 0
          ? "Out of stock"
          : product.stock
            ? "In stock"
            : emptyValue,
    },
  ];

  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden rounded-lg border-0 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <h2 className="text-lg font-extrabold uppercase tracking-[0.08em] text-slate-700">
              Frame Dimensions
            </h2>
            <span className="text-sm font-bold text-shop_light_green">
              Size Guide
            </span>
          </div>

          <div className="mx-4 mb-4 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2 sm:gap-4 lg:p-6">
            {dimensions.map((item) => (
              <DimensionItem key={item.label} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-lg border-0 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        <CardContent className="p-0">
          <div className="px-6 py-5">
            <h2 className="text-lg font-extrabold uppercase tracking-[0.08em] text-slate-700">
              Product Specifications
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6 px-6 pb-6 sm:grid-cols-3 lg:grid-cols-4">
            {specs.map((item) => (
              <SpecItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

const DimensionItem = ({
  label,
  value,
  icon,
  direction,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  direction: ReactNode;
}) => (
  <div className="grid min-h-[96px] grid-cols-[92px_1fr] items-center gap-4 rounded-lg bg-white/55 p-3">
    <div className="relative flex h-16 items-center justify-center text-slate-500">
      <span className="absolute top-0 flex h-5 min-w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600">
        {direction}
      </span>
      <span className="mt-4 text-shop_orange">{icon}</span>
    </div>

    <div className="min-w-0 border-l border-slate-200 pl-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-base font-extrabold text-slate-950">{value}</p>
    </div>
  </div>
);

const SpecItem = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="min-w-0">
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-2 break-words text-base font-extrabold leading-snug text-slate-950">
      {value}
    </p>
  </div>
);

export default ProductSpecs;
