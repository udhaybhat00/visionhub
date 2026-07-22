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
    <article className="group flex min-w-0 flex-col border border-black/10 bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f1f3f1]">
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
              className={`object-contain p-5 transition-transform duration-500 sm:p-7 ${
                product.stock === 0
                  ? "opacity-45"
                  : "group-hover:scale-[1.045]"
              }`}
            />
          ) : (
            <Glasses className="absolute inset-0 m-auto h-16 w-16 text-black/15" />
          )}
        </Link>

        <div className="absolute left-3 top-3 z-10">
          <span className="rounded-sm bg-[#111313] px-2.5 py-1 text-[10px] font-extrabold uppercase text-white">
            {product.isFeatured
              ? "Editor's choice"
              : product.status === "new"
                ? "New arrival"
                : variantLabels[product.variant || ""] || "Optical edit"}
          </span>
        </div>
        <ProductSideMenu
          product={cartProduct}
          className="right-3 top-3 z-20 [&>div]:bg-white/90 [&>div]:text-[#111313] [&>div]:shadow-sm"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-bold uppercase text-[#8b6c12] sm:text-xs">
            {variantLabels[product.variant || ""] || "VisionHub eyewear"}
          </p>
          {product.averageRating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-black/55">
              <Star className="h-3 w-3 fill-[#c49e2f] text-[#c49e2f]" />
              {product.averageRating.toFixed(1)}
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug?.current}`}>
          <h3 className="font-display mt-2 line-clamp-1 text-base font-black text-[#111313] transition-colors hover:text-[#8b6c12] sm:text-lg">
            {product.name || "Signature frame"}
          </h3>
        </Link>
        <p className="mt-1 truncate text-xs text-black/48">{detail}</p>

        <div className="mt-4">
          <PriceView
            price={product.price}
            discount={product.discount}
            className="text-sm text-[#111313] sm:text-base"
          />
        </div>

        <div className="mt-auto pt-4">
          <AddToCartButton
            product={cartProduct}
            className="h-11 rounded-md bg-[#111313] text-xs text-white hover:bg-[#315d55] sm:text-sm"
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
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase text-[#9a7918]">
              Curated now
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Distinctive frames, selected with intent.
            </h2>
          </div>
          <div className="flex items-end justify-between gap-5 lg:justify-end">
            <p className="max-w-md text-sm leading-6 text-black/55">
              A considered mix of optical, sun, screen, and performance styles
              from the current VisionHub collection.
            </p>
            <Link
              href="/shop"
              className="hidden shrink-0 items-center gap-2 text-sm font-extrabold text-[#111313] transition-colors hover:text-[#8b6c12] sm:inline-flex"
            >
              Shop all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {curatedProducts.map((product) => (
            <ProductTile key={product._id} product={product} />
          ))}
        </div>

        <Link
          href="/shop"
          className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#111313] sm:hidden"
        >
          Shop all eyewear
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
