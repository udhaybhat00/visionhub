import Container from "./Container";
import { getAllBrands } from "@/sanity/queries";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight, BadgeCheck } from "lucide-react";

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  if (!brands?.length) {
    return null;
  }

  return (
    <section className="border-y border-ink/8 bg-[#e9e4d8] py-14 lg:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-brand">
              Selected labels
            </p>
            <h2 className="font-display mt-3 max-w-md text-3xl font-black leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">
              Optical names worth knowing.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-ink-soft">
              Explore the labels shaping our current edit, chosen for design,
              build, lens quality, and dependable everyday wear.
            </p>
            <Link
              href="/brands"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-ink transition-brand hover:text-amber-brand-deep"
            >
              <span className="link-underline">Explore all brands</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {brands.slice(0, 8).map((brand) => (
              <Link
                key={brand?._id}
                href={{
                  pathname: "/shop",
                  query: { brand: brand?.slug?.current },
                }}
                className="group flex aspect-[3/2] items-center justify-center rounded-lg border border-ink/10 bg-bone/80 p-4 transition-brand hover:-translate-y-1 hover:border-amber-brand/40 hover:bg-bone hover:shadow-[0_20px_40px_-18px_rgba(34,27,18,0.25)]"
              >
                {brand?.image ? (
                  <Image
                    src={urlFor(brand.image).width(260).height(160).fit("max").url()}
                    alt={`${brand?.title || "Eyewear brand"} logo`}
                    width={260}
                    height={160}
                    className="max-h-full max-w-full object-contain opacity-70 transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : (
                  <span className="font-display text-center text-sm font-black text-ink transition-brand group-hover:text-amber-brand-deep">
                    {brand?.title}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-9 flex items-center gap-3 border-t border-ink/8 pt-6 text-xs font-bold text-ink-soft">
          <BadgeCheck className="h-4 w-4 text-sage-brand" />
          Brand and product information is checked before it reaches the
          storefront.
        </div>
      </Container>
    </section>
  );
};

export default ShopByBrands;
