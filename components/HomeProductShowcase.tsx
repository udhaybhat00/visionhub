import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Glasses, Star } from "lucide-react";

import { ALL_PRODUCTS_QUERYResult, Product } from "@/sanity.types";
import { getAllProducts } from "@/sanity/queries";
import { productImageUrl } from "@/sanity/image";
import AddToCartButton from "./AddToCartButton";
import Container from "./Container";
import PriceView from "./PriceView";
import ProductSideMenu from "./ProductSideMenu";
import Reveal from "./Reveal";

type HomeProduct = ALL_PRODUCTS_QUERYResult[number];

const variantLabels: Record<string, string> = {
  sunglasses: "Sunglasses",
  "computer-glasses": "Screen eyewear",
  prescription: "Prescription",
  premium: "Premium optical",
  sports: "Performance",
};

function getCuratedProducts(products: ALL_PRODUCTS_QUERYResult) {
  const ordered = [
    ...products.filter((product) => product.isFeatured),
    ...products.filter((product) => !product.isFeatured),
  ];

  return ordered
    .filter(
      (product, index, all) =>
        all.findIndex((item) => item._id === product._id) === index
    )
    .slice(0, 8);
}

function ProductTile({ product }: { product: HomeProduct }) {
  const cartProduct = product as Product;
  const image = product.images?.[0];
  const detail =
    [product.frameShape, product.frameMaterial].filter(Boolean).join(" / ") ||
    "Precision-fit eyewear";

  return (
    <article className="group flex min-w-0 flex-col rounded-xl border border-ink/8 bg-bone transition-brand hover:-translate-y-1.5 hover:border-amber-brand/25 hover:shadow-[0_26px_52px_-20px_rgba(34,27,18,0.24)]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-[#efe9dc]">
        <Link
          href={`/product/${product.slug?.current}`}
          aria-label={`View ${product.name || "eyewear"}`}
          className="absolute inset-0"
        >
          {image ? (
            <Image
              src={productImageUrl(image, 800, 900)}
              alt={product.name || "VisionHub eyewear"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:p-7 ${
                product.stock === 0
                  ? "opacity-45"
                  : "group-hover:scale-[1.06]"
              }`}
            />
          ) : (
            <Glasses className="absolute inset-0 m-auto h-16 w-16 text-ink/15" />
          )}
        </Link>

        <div className="absolute left-3 top-3 z-10">
          <span className="rounded-md bg-ink px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-bone transition-brand group-hover:bg-amber-brand-deep">
            {product.isFeatured
              ? "Editor's choice"
              : product.status === "new"
                ? "New arrival"
                : variantLabels[product.variant || ""] || "Optical edit"}
          </span>
        </div>
        <ProductSideMenu
          product={cartProduct}
          className="right-3 top-3 z-20 [&>div]:bg-bone/90 [&>div]:text-ink [&>div]:shadow-sm [&>div]:backdrop-blur-sm"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-amber-brand-deep sm:text-xs">
            {variantLabels[product.variant || ""] || "VisionHub eyewear"}
          </p>
          {product.averageRating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-ink/55">
              <Star className="h-3 w-3 fill-amber-brand text-amber-brand" />
              {product.averageRating.toFixed(1)}
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug?.current}`}>
          <h3 className="font-display mt-2 line-clamp-1 text-lg font-black text-ink transition-brand hover:text-amber-brand-deep sm:text-xl">
            {product.name || "Signature frame"}
          </h3>
        </Link>
        <p className="mt-1 truncate text-xs text-ink-soft">{detail}</p>

        <div className="mt-4">
          <PriceView
            price={product.price}
            discount={product.discount}
            className="text-sm text-ink sm:text-base"
          />
        </div>

        <div className="mt-auto pt-4">
          <AddToCartButton
            product={cartProduct}
            className="h-11 rounded-full bg-ink text-xs font-bold text-bone transition-brand hover:-translate-y-0.5 hover:bg-amber-brand-deep hover:shadow-[0_12px_24px_-10px_rgba(146,64,14,0.5)] active:translate-y-0 sm:text-sm"
          />
        </div>
      </div>
    </article>
  );
}

export default async function HomeProductShowcase() {
  const products = await getAllProducts();
  const curatedProducts = getCuratedProducts(products);

  if (curatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-cream py-14 lg:py-24">
      <Container>
        <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-brand">
              Curated now
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-black leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">
              Distinctive frames, selected with intent.
            </h2>
          </div>
          <div className="flex items-end justify-between gap-5 lg:justify-end">
            <p className="max-w-md text-sm leading-6 text-ink-soft">
              A considered mix of optical, sun, screen, and performance styles
              from the current VisionHub collection.
            </p>
            <Link
              href="/shop"
              className="group hidden shrink-0 items-center gap-2 text-sm font-extrabold text-ink transition-brand hover:text-amber-brand-deep sm:inline-flex"
            >
              <span className="link-underline">Shop all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {curatedProducts.map((product, index) => (
            <Reveal key={product._id} delay={Math.min(index, 7) * 0.05}>
              <ProductTile product={product} />
            </Reveal>
          ))}
        </div>

        <Link
          href="/shop"
          className="group mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-ink transition-brand hover:text-amber-brand-deep sm:hidden"
        >
          <span className="link-underline">Shop all eyewear</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
        </Link>
      </Container>
    </section>
  );
}
