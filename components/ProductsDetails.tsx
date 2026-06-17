"use client";
import { Product } from "@/sanity.types";

interface Props {
  product: Product;
}

import {
  ShieldCheck,
  Sun,
  Ruler,
  Glasses,
  Eye,
  User,
  Palette,
  BadgeCheck,
} from "lucide-react";

const ProductsDetails = ({ product }: Props) => {
  return (
    <div className="w-full space-y-8 mb-10">
      {/* Description Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-shop_dark_green mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-shop_orange rounded-full"></span>
          Description
        </h2>
   <div className="prose prose-sm max-w-none text-gray-600">
  <p>{product?.description || "No description available."}</p>
</div>
      </div>

      {/* Additional Information Section */}
     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
  <div className="flex items-center gap-3 mb-8">
    <div className="w-1.5 h-8 bg-shop_orange rounded-full"></div>

    <div>
      <h2 className="text-xl md:text-2xl font-bold text-shop_dark_green">
        Product Specifications
      </h2>

      <p className="text-sm text-gray-500">
        Detailed information about this eyewear
      </p>
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
    {[
      {
        label: "Frame Material",
        value: product?.frameMaterial,
        icon: <Glasses size={18} />,
      },
      {
        label: "Lens Type",
        value: product?.lensType,
        icon: <Eye size={18} />,
      },
      {
        label: "Gender",
        value: product?.gender,
        icon: <User size={18} />,
      },
      {
        label: "Frame Shape",
        value: product?.frameShape,
        icon: <Glasses size={18} />,
      },
      {
        label: "UV Protection",
        value: product?.uvProtection,
        icon: <Sun size={18} />,
      },
      {
        label: "Warranty",
        value: product?.warranty,
        icon: <ShieldCheck size={18} />,
      },
      {
        label: "Frame Size",
        value: product?.frameSize,
        icon: <Ruler size={18} />,
      },
      {
        label: "Lens Width",
        value: product?.lensWidth,
        icon: <Ruler size={18} />,
      },
      {
        label: "Bridge Width",
        value: product?.bridgeWidth,
        icon: <Ruler size={18} />,
      },
      {
        label: "Temple Length",
        value: product?.templeLength,
        icon: <Ruler size={18} />,
      },
      {
        label: "Lens Color",
        value: product?.lensColor,
        icon: <Palette size={18} />,
      },
      {
        label: "Prescription",
        value: product?.prescriptionAvailable
          ? "Available"
          : "Not Available",
        icon: <BadgeCheck size={18} />,
      },
    ].map((item) => (
      <div
        key={item.label}
        className="group bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-5 hover:shadow-lg hover:border-shop_orange/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-shop_orange/10 text-shop_orange flex items-center justify-center">
            {item.icon}
          </div>

          <p className="text-xs md:text-sm font-medium text-gray-500">
            {item.label}
          </p>
        </div>

        <p className="text-sm md:text-lg font-semibold text-shop_dark_green">
          {item.value || "N/A"}
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default ProductsDetails;
