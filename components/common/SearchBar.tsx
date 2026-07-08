"use client";

import {
  ArrowRight,
  Clock,
  Loader2,
  Mic,
  Search,
  Star,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Input } from "../ui/input";
import { productImageUrl } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import PriceView from "../PriceView";
import Image from "next/image";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";

type SearchProduct = Product & {
  brandTitle?: string;
  categoryTitles?: string[];
  averageRating?: number;
  totalReviews?: number;
};

const POPULAR_SEARCHES = [
  "Premium frames",
  "Sunglasses",
  "Computer glasses",
  "Prescription",
  "UV400",
  "Sports eyewear",
];

const COLLECTION_LINKS = [
  {
    title: "Sunglasses",
    href: "/shop?type=sunglasses",
    description: "UV protection for everyday wear",
  },
  {
    title: "Computer Glasses",
    href: "/shop?type=computer-glasses",
    description: "Blue-light comfort for screens",
  },
  {
    title: "Premium",
    href: "/shop?type=premium",
    description: "Elevated frames and finishes",
  },
];

const productProjection = `{
  ...,
  "brandTitle": brand->title,
  "categoryTitles": categories[]->title,
  "averageRating": coalesce(math::avg(*[_type == "review" && product._ref == ^._id && status == "approved"].rating), 0),
  "totalReviews": count(*[_type == "review" && product._ref == ^._id && status == "approved"])
}`;

const formatLabel = (value?: string) =>
  value
    ? value
        .split("-")
        .filter(Boolean)
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ")
    : "Eyewear";

const getProductHref = (product: SearchProduct) =>
  product?.slug?.current ? `/product/${product.slug.current}` : "/shop";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<SearchProduct[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMac, setIsMac] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useOutsideClick<HTMLDivElement>(() => setShowSearch(false));

  const trimmedSearch = search.trim();
  const canSearch = trimmedSearch.length >= 2;

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      const parsed = stored ? JSON.parse(stored) : [];

      if (Array.isArray(parsed)) {
        setRecentSearches(
          parsed.filter((item) => typeof item === "string").slice(0, 6)
        );
      }
    } catch {
      localStorage.removeItem("recentSearches");
    }
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    const normalizedTerm = term.trim();

    if (!normalizedTerm) return;

    setRecentSearches((currentSearches) => {
      const updatedSearches = [
        normalizedTerm,
        ...currentSearches.filter(
          (item) => item.toLowerCase() !== normalizedTerm.toLowerCase()
        ),
      ].slice(0, 6);

      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      return updatedSearches;
    });
  }, []);

  const handleSearch = useCallback(
    (term = search) => {
      const normalizedTerm = term.trim();

      if (normalizedTerm.length < 2) return;

      saveRecentSearch(normalizedTerm);
    },
    [saveRecentSearch, search]
  );

  const closeSearch = useCallback(() => {
    setShowSearch(false);
    setIsListening(false);
  }, []);

  const openSearch = useCallback(() => {
    setShowSearch(true);
  }, []);

  const handleTermSelect = useCallback(
    (term: string) => {
      setSearch(term);
      saveRecentSearch(term);
    },
    [saveRecentSearch]
  );

  const clearSearch = useCallback(() => {
    setSearch("");
    setProducts([]);
    inputRef.current?.focus();
  }, []);

  const startVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      setSearch(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const query = `*[_type == "product" && isFeatured == true] | order(coalesce(sortOrder, 999999) asc, name asc)[0...6] ${productProjection}`;
      const response = await client.fetch<SearchProduct[]>(query);
      setFeaturedProduct(response);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  }, []);

  useEffect(() => {
    if (!showSearch) return;

    fetchFeaturedProducts();

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [fetchFeaturedProducts, showSearch]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSearch) {
        closeSearch();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.body.style.overflow = showSearch ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  }, [closeSearch, openSearch, showSearch]);

  const fetchProducts = useCallback(async () => {
    if (!canSearch) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const query = `
        *[
          _type == "product" &&
          (
            name match $search ||
            description match $search ||
            variant match $search ||
            frameShape match $search ||
            lensType match $search ||
            references(*[_type in ["brand", "category"] && title match $search]._id)
          )
        ] | order(coalesce(sortOrder, 999999) asc, name asc)[0...10] ${productProjection}
      `;

      const response = await client.fetch<SearchProduct[]>(query, {
        search: `*${trimmedSearch}*`,
      });

      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [canSearch, trimmedSearch]);

  useEffect(() => {
    if (!canSearch) {
      setProducts([]);
      return;
    }

    const debounceTimer = window.setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => window.clearTimeout(debounceTimer);
  }, [canSearch, fetchProducts]);

  const statusText = useMemo(() => {
    if (!trimmedSearch) return "Trending searches and featured frames";
    if (!canSearch) return "Keep typing to refine your search";
    if (loading) return `Searching for "${trimmedSearch}"`;

    return `${products.length} result${products.length === 1 ? "" : "s"} for "${trimmedSearch}"`;
  }, [canSearch, loading, products.length, trimmedSearch]);

  const renderSearchTermButton = (term: string) => (
    <button
      key={term}
      type="button"
      onClick={() => handleTermSelect(term)}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-sm font-medium text-gray-700 transition-all hover:border-shop_orange hover:bg-shop_light_bg hover:text-shop_dark_green"
    >
      <Search className="h-3.5 w-3.5 text-gray-400" />
      <span className="max-w-[180px] truncate">{term}</span>
    </button>
  );

  const renderProductCard = (product: SearchProduct, compact = false) => {
    const productImage = product.images?.[0];
    const categoryLabel =
      product.categoryTitles?.[0] || formatLabel(product.variant);
    const isInStock = (product.stock || 0) > 0;

    return (
      <Link
        key={product._id}
        href={getProductHref(product)}
        onClick={() => {
          handleSearch(trimmedSearch || product.name || "");
          closeSearch();
        }}
        className={
          compact
            ? "group grid grid-cols-[72px_1fr] gap-3 rounded-lg border border-black/[0.06] bg-white p-3 transition-all hover:border-shop_orange/50 hover:shadow-md"
            : "group grid grid-cols-[76px_1fr_auto] items-center gap-4 px-5 py-4 transition-all hover:bg-shop_light_bg"
        }
      >
        <div className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-gray-50">
          {productImage?.asset ? (
            <Image
              width={96}
              height={96}
              src={productImageUrl(productImage, 160, 160)}
              alt={product.name || "Eyewear product"}
              className={`h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${
                !isInStock ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : (
            <Search className="h-6 w-6 text-gray-300" />
          )}

          {product.discount ? (
            <span className="absolute right-1 top-1 rounded-full bg-shop_orange px-1.5 py-0.5 text-[10px] font-bold text-white">
              -{product.discount}%
            </span>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              {categoryLabel}
            </span>
            {product.status === "hot" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                <TrendingUp className="h-3 w-3" />
                Hot
              </span>
            ) : null}
            {product.status === "new" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                <Clock className="h-3 w-3" />
                New
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] font-semibold text-yellow-700">
                <Star className="h-3 w-3" />
                Featured
              </span>
            ) : null}
          </div>

          <h3 className="line-clamp-1 text-sm font-semibold text-gray-950 sm:text-base">
            {product.name}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            {product.brandTitle ? <span>{product.brandTitle}</span> : null}
            <span className={isInStock ? "text-emerald-600" : "text-red-500"}>
              {isInStock ? "In stock" : "Out of stock"}
            </span>
            {product.totalReviews ? (
              <span>{product.averageRating?.toFixed(1)} rating</span>
            ) : null}
          </div>

          <PriceView
            price={product.price}
            discount={product.discount}
            className="mt-2 text-sm"
          />
        </div>

        {!compact ? (
          <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-500 transition-all group-hover:border-shop_orange group-hover:bg-white group-hover:text-shop_dark_green sm:flex">
            <ArrowRight className="h-4 w-4" />
          </div>
        ) : null}
      </Link>
    );
  };

  return (
    <>
      <div className="flex">
        <button
          type="button"
          onClick={openSearch}
          className="group hidden h-11 min-w-[230px] grid-cols-[auto_1fr_auto] items-center gap-3 rounded-full border border-black/10 bg-white px-4 shadow-[0_8px_24px_rgba(15,15,15,0.06)] ring-1 ring-black/[0.02] transition-all duration-200 hover:border-shop_orange/60 hover:bg-shop_light_bg md:w-[260px] xl:grid xl:w-[320px] 2xl:w-[380px]"
          aria-label={`Open search (${isMac ? "Cmd" : "Ctrl"}+K)`}
        >
          <Search className="h-5 w-5 text-gray-400 transition-colors group-hover:text-shop_dark_green" />
          <span className="truncate text-left text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-800">
            Search frames, lenses, brands
          </span>
          <kbd className="hidden rounded-full border border-black/10 bg-gray-50 px-2 py-1 font-mono text-[11px] font-medium text-gray-500 transition-colors group-hover:border-shop_orange/40 sm:inline-flex">
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </button>

        <button
          type="button"
          onClick={openSearch}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-gray-500 shadow-sm transition-all hover:border-shop_orange hover:bg-shop_light_bg hover:text-shop_dark_green xl:hidden"
          aria-label="Open search"
        >
          <Search className="h-4 w-4 transition-colors" />
        </button>
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-0 backdrop-blur-md sm:px-4 sm:pt-20">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
            className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[calc(100vh-7rem)] sm:max-w-4xl sm:rounded-2xl"
          >
            <div className="border-b border-black/[0.06] bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-shop_orange">
                    VisionHub Search
                  </p>
                  <h2
                    id="site-search-title"
                    className="mt-1 text-xl font-semibold text-gray-950"
                  >
                    Find the right frame
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-500 transition-all hover:border-shop_orange hover:bg-shop_light_bg hover:text-shop_dark_green"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearch();
                }}
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    ref={inputRef}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search sunglasses, computer glasses, UV400..."
                    autoComplete="off"
                    className="h-14 rounded-lg border-black/10 bg-gray-50 pl-12 pr-32 text-base font-medium text-gray-950 shadow-inner placeholder:text-gray-400 focus:border-shop_orange focus:bg-white focus:ring-shop_orange/20"
                  />

                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                    {search ? (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={startVoiceSearch}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Voice search"
                    >
                      <Mic
                        className={`h-4 w-4 ${
                          isListening ? "animate-pulse text-red-500" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="submit"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-shop_dark_green text-white transition-all hover:bg-shop_orange"
                      aria-label="Submit search"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] bg-gray-50 px-5 py-3">
              <p className="truncate text-sm font-medium text-gray-600">
                {statusText}
              </p>
              {trimmedSearch ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="hidden text-sm font-semibold text-shop_dark_green hover:text-shop_orange sm:inline"
                >
                  Reset
                </button>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-3 p-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid animate-pulse grid-cols-[76px_1fr] gap-4 rounded-lg border border-black/[0.06] p-3"
                    >
                      <div className="h-[72px] w-[72px] rounded-lg bg-gray-100" />
                      <div className="space-y-3 py-1">
                        <div className="h-3 w-24 rounded-full bg-gray-100" />
                        <div className="h-4 w-2/3 rounded-full bg-gray-100" />
                        <div className="h-3 w-1/2 rounded-full bg-gray-100" />
                        <div className="h-4 w-24 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching products
                  </div>
                </div>
              ) : canSearch && products.length > 0 ? (
                <div className="divide-y divide-black/[0.06]">
                  {products.map((product) => renderProductCard(product))}
                </div>
              ) : canSearch ? (
                <div className="p-6 text-center sm:p-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-950">
                    No matching products
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    Try another style, frame shape, brand, or category.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {POPULAR_SEARCHES.slice(0, 4).map(renderSearchTermButton)}
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 p-5 sm:p-6">
                  {recentSearches.length > 0 ? (
                    <section>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-950">
                          Recent searches
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem("recentSearches");
                            setRecentSearches([]);
                          }}
                          className="text-sm font-medium text-gray-500 hover:text-shop_orange"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(renderSearchTermButton)}
                      </div>
                    </section>
                  ) : null}

                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-gray-950">
                      Popular searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map(renderSearchTermButton)}
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-3 text-sm font-semibold text-gray-950">
                      Shop by need
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {COLLECTION_LINKS.map((collection) => (
                        <Link
                          key={collection.title}
                          href={collection.href}
                          onClick={closeSearch}
                          className="group rounded-lg border border-black/[0.06] bg-white p-4 transition-all hover:border-shop_orange/50 hover:bg-shop_light_bg hover:shadow-md"
                        >
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-shop_dark_green transition-colors group-hover:bg-shop_dark_green group-hover:text-white">
                            <Tag className="h-4 w-4" />
                          </div>
                          <h4 className="font-semibold text-gray-950">
                            {collection.title}
                          </h4>
                          <p className="mt-1 text-sm leading-5 text-gray-500">
                            {collection.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>

                  {featuredProduct.length > 0 ? (
                    <section>
                      <h3 className="mb-3 text-sm font-semibold text-gray-950">
                        Popular picks
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {featuredProduct
                          .slice(0, 4)
                          .map((product) => renderProductCard(product, true))}
                      </div>
                    </section>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
