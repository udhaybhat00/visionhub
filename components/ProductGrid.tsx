"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import NoProductAvailable from "./product/NoProductAvailable";
import { Grid3X3, LayoutGrid, List, Filter, SortAsc, Eye } from "lucide-react";
import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductGridSkeleton } from "./ProductSkeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

type ViewMode = "grid-2" | "grid-3" | "grid-4" | "grid-5" | "list";
type SortOption =
  | "manual"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [filteredProducts, setFilteredProducts] =
    useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.value || "");
  const [viewMode, setViewMode] =
  useState<ViewMode>("grid-4");
  const [sortBy, setSortBy] = useState<SortOption>("manual");
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage] = useState(20);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");
 const maxPrice = Math.max(
  ...products.map((p) => {
    const price = p.price || 0;

    return Math.floor(
      p.discount
        ? price - price * (p.discount / 100)
        : price
    );
  }),
  1000
);

  const query = `*[_type == "product" && variant == $variant] | order(${getSortQuery(
    sortBy
  )}){
  ...,
  "categories": categories[]->title,
  "averageRating": coalesce(math::avg(*[_type == "review" && product._ref == ^._id && status == "approved"].rating), 0),
  "totalReviews": count(*[_type == "review" && product._ref == ^._id && status == "approved"])
}`;
  const params = { variant: selectedTab };

  function getSortQuery(sort: SortOption): string {
    switch (sort) {
      case "manual":
        return "coalesce(sortOrder, 999999) asc, name asc";
      case "name-asc":
        return "name asc";
      case "name-desc":
        return "name desc";
      case "price-asc":
        return "price asc";
      case "price-desc":
        return "price desc";
      case "newest":
        return "_createdAt desc";
      default:
        return "coalesce(sortOrder, 999999) asc, name asc";
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);

        setProducts(await response);
        setFilteredProducts(await response);
  const highestPrice = Math.max(
  ...response.map((p: any) => {
    const price = p.price || 0;

    return Math.floor(
      p.discount
        ? price - price * (p.discount / 100)
        : price
    );
  }),
  1000
);

setPriceRange([0, highestPrice]);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, sortBy]);

  // Apply filters to products
  const applyFilters = () => {
    let filtered = [...products];

    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
     const finalPrice = Math.floor(
  product.discount
    ? price - price * (product.discount / 100)
    : price
);
        return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
      });
    }

    // Filter by stock status
    if (stockStatus !== "all") {
      filtered = filtered.filter((product) => {
        if (stockStatus === "in-stock") {
          return (product.stock || 0) > 0;
        } else if (stockStatus === "out-of-stock") {
          return (product.stock || 0) === 0;
        }
        return true;
      });
    }

    // Filter by gender
if (gender !== "all") {
  filtered = filtered.filter(
    (product) =>
      product.gender?.toLowerCase() === gender.toLowerCase()
  );
}

    setFilteredProducts(filtered);
  };

  // Auto-apply filters when filter values change
 useEffect(() => {
  applyFilters();
}, [
  products,
  priceRange,
  stockStatus,
  gender,
]);

  const getGridClasses = () => {
    switch (viewMode) {
      case "grid-2":
  return "grid-cols-2 gap-3 sm:grid-cols-2";
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5";
      case "grid-4":
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid-5":
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2";
      case "list":
        return "grid-cols-1 gap-4";
      default:
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  const ViewModeButton = ({
    mode,
    icon,
    label,
  }: {
    mode: ViewMode;
    icon: React.ReactNode;
    label: string;
  }) => (
    <Button
      variant={viewMode === mode ? "default" : "outline"}
      size="sm"
      onClick={() => setViewMode(mode)}
      className={`p-2 hoverEffect ${
        viewMode === mode
          ? "bg-shop_light_green hover:bg-shop_dark_green border-shop_light_green"
          : "hover:border-shop_light_green hover:text-shop_light_green"
      }`}
      title={label}
    >
      {icon}
    </Button>
  );

  return (
    <Container className="flex flex-col mt-4 px-3 sm:px-4 lg:px-0">
      {/* Header Section */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-shop_light_green to-shop_dark_green rounded-full"></div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-dark-color">
            Featured Products
          </h2>
          <div className="h-1 w-12 bg-gradient-to-l from-shop_light_green to-shop_dark_green rounded-full"></div>
        </div>
          <p className="text-light-color text-sm sm:text-lg max-w-2xl mx-auto">
        Premium eyewear crafted for style and performance
        </p>
      </div>

      {/* Enhanced Controls Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-shop_light_green/10 p-3 md:p-6 mb-8">
        {/* Tab Bar */}
        <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

        {/* Advanced Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
          {/* Left Side - View Options */}
          <div className="flex w-full sm:w-auto items-center gap-2">
            {/* View Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-dark-color hidden sm:block">
                View:
              </span>
             <div className="hidden md:flex items-center gap-1">
  <ViewModeButton
    mode="grid-2"
    icon={<Grid3X3 size={16} />}
    label="2 Columns"
  />

  <ViewModeButton
    mode="grid-4"
    icon={<LayoutGrid size={16} />}
    label="4 Columns"
  />

  <ViewModeButton
    mode="list"
    icon={<List size={16} />}
    label="List View"
  />
</div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none flex items-center gap-2 hoverEffect ${
                showFilters
                  ? "bg-shop_light_green hover:bg-shop_dark_green border-shop_light_green"
                  : "hover:border-shop_light_green hover:text-shop_light_green"
              }`}
            >
              <Filter size={16} />
              <span>
  Filters
</span>
            </Button>
          </div>

          {/* Right Side - Sort and Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <SortAsc size={16} className="text-light-color" />
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-shop_light_green">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Order</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">
                    Price (High to Low)
                  </SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Count */}
            <div className="hidden md:flex items-center gap-2 text-sm text-light-color">
              <Eye size={16} />
              <Badge
                variant="secondary"
                className="bg-shop_light_pink text-shop_dark_green"
              >
                {filteredProducts.length} products
              </Badge>
            </div>
          </div>
        </div>

        {/* Expandable Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Separator className="my-6" />
              <Card className="rounded-lg border-slate-200 bg-slate-50/80 shadow-none">
                <CardContent className="p-4 md:p-6">
                  <div className="mb-6">
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold text-slate-950">
                      Filter frames
                    </h3>
                    <p className="text-sm leading-6 text-slate-500">
                      Narrow the collection by price, stock, and fit audience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Price Range Filter */}
                    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <Label className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                        <IndianRupee className="h-4 w-4 text-shop_light_green" />
                        Price Range
                      </Label>
                      <div className="space-y-4">
                        <div className="px-2">
                          <Slider
                    value={priceRange}
                   onValueChange={setPriceRange}
                     max={maxPrice}
                            min={0}
                            step={100}
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Label className="text-xs text-light-color">
                              Min Price
                            </Label>
                            <Input
  type="number"
  min={0}
                              placeholder="0"
                              value={priceRange[0]}
                            onChange={(e) =>
  setPriceRange([
    Math.max(0, parseInt(e.target.value) || 0),
    priceRange[1],
  ])
}
                              className="h-9 rounded-lg border-slate-300 focus:border-shop_light_green"
                            />
                          </div>
                          <div className="pt-5 font-bold text-slate-400">
                            -
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-light-color">
                              Max Price
                            </Label>
                            <Input
                              type="number"
                              placeholder="1000"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  Math.max(
  priceRange[0],
  parseInt(e.target.value) || maxPrice
),
                                ])
                              }
                              className="h-9 rounded-lg border-slate-300 focus:border-shop_light_green"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge className="rounded-lg border-shop_light_green/30 bg-shop_light_green/15 text-shop_dark_green">
                            ₹{Math.floor(priceRange[0])} - ₹{Math.floor(priceRange[1])}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Filter */}
                    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <Label className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                        <PackageCheck className="h-4 w-4 text-shop_light_green" />
                        Stock Status
                      </Label>
                      <Select
                        value={stockStatus}
                        onValueChange={setStockStatus}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-slate-300 focus:border-shop_light_green">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              All Products
                            </span>
                          </SelectItem>
                          <SelectItem value="in-stock">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              In Stock
                            </span>
                          </SelectItem>
                          <SelectItem value="out-of-stock">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Out of Stock
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {stockStatus && stockStatus !== "all" && (
                        <div className="text-center">
                          <Badge
                            variant="outline"
                            className="w-fit rounded-lg border-shop_light_green/30"
                          >
                            {stockStatus === "in-stock"
                              ? "In Stock Only"
                              : "Out of Stock Only"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Quality Filter */}
                  <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
  <Label className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
    <UserRound className="h-4 w-4 text-shop_light_green" />
    Fit Audience
  </Label>

  <Select
    value={gender}
    onValueChange={setGender}
  >
    <SelectTrigger className="h-10 rounded-lg border-slate-300 focus:border-shop_light_green">
      <SelectValue placeholder="Select audience..." />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">
        All Products
      </SelectItem>

      <SelectItem value="Men">
        Men's
      </SelectItem>

      <SelectItem value="Women">
        Women's
      </SelectItem>

      <SelectItem value="Unisex">
        Unisex
      </SelectItem>
    </SelectContent>
  </Select>

  {gender !== "all" && (
    <div className="text-center">
      <Badge
        variant="outline"
        className="rounded-lg border-shop_light_green/30"
      >
        {gender}
      </Badge>
    </div>
  )}
</div>

                    {/* Action Buttons */}
                    <div className="flex flex-col justify-end gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="text-center mb-2">
                        <Label className="text-sm font-extrabold text-slate-950">
                          Quick Actions
                        </Label>
                      </div>
                  <Button
  disabled
  className="w-full"
>
  {filteredProducts.length} Products Found
</Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg border-shop_light_green/30 text-shop_dark_green hover:border-shop_light_green hover:bg-shop_light_green/10"
                        onClick={() => {
                          setPriceRange([0, maxPrice]);
setStockStatus("all");
setGender("all");

                        }}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(priceRange[0] > 0 ||
  priceRange[1] < maxPrice ||
  (stockStatus && stockStatus !== "all") ||
  gender !== "all") && (
                    <div className="mt-6 border-t border-slate-200 pt-4">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <span className="text-sm font-semibold text-slate-700">
                          Active Filters:
                        </span>
                        {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                          <Badge
                            variant="secondary"
                            className="rounded-lg bg-slate-100 text-slate-800"
                          >
                            ₹{Math.floor(priceRange[0])} - ₹{Math.floor(priceRange[1])}
                          </Badge>
                        )}
                        {stockStatus && stockStatus !== "all" && (
                          <Badge
                            variant="secondary"
                            className="rounded-lg bg-slate-100 text-slate-800"
                          >
                            Stock:{" "}
                            {stockStatus === "in-stock"
                              ? "In Stock"
                              : "Out of Stock"}
                          </Badge>
                        )}
                        {gender !== "all" && (
  <Badge
    variant="secondary"
    className="rounded-lg bg-slate-100 text-slate-800"
  >
    Gender: {gender}
  </Badge>
)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : filteredProducts?.length ? (
        <div className={`grid ${getGridClasses()}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts
              ?.slice(0, productsPerPage)
              .map((product, index) => (
                <motion.div
                  key={product?._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3 },
                  }}
                  className="group"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}

      {/* Load More Section */}
      {filteredProducts?.length > productsPerPage && (
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="px-8 py-3 bg-gradient-to-r from-shop_light_green to-shop_dark_green text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 hoverEffect"
          >
            Load More Products
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ProductGrid;
