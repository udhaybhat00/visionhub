"use client";
import { productType } from "@/constants";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
 return (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    
    {/* Categories */}
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {productType?.map((item) => (
          <button
            onClick={() => onTabSelect(item?.value)}
            key={item?.value}
            className={`whitespace-nowrap flex-shrink-0 border border-shop_light_green/30 px-3 py-2 md:px-6 md:py-2 rounded-full text-sm hover:bg-shop_light_green hover:border-shop_light_green hover:text-white transition-all duration-300 ${
              selectedTab === item?.value
                ? "bg-shop_light_green text-white border-shop_light_green"
                : "bg-shop_light_green/10"
            }`}
          >
            {item?.title}
          </button>
        ))}
      </div>
    </div>

    {/* See All */}
    <Link
      href="/shop"
      className="w-fit border border-dark-color px-4 py-2 rounded-full hover:bg-shop_light_green hover:text-white hover:border-shop_light_green transition-all duration-300"
    >
      See all
    </Link>
  </div>
);
};

export default HomeTabbar;
