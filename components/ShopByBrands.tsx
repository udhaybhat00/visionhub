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
    <section className="border-y border-black/10 bg-[#e8efec] py-14 lg:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase text-[#8b6c12]">
              Selected labels
            </p>
            <h2 className="font-display mt-3 max-w-md text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Optical names worth knowing.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-black/55">
              Explore the labels shaping our current edit, chosen for design,
              build, lens quality, and dependable everyday wear.
            </p>
            <Link
              href="/brands"
              className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#111313] transition-colors hover:text-[#8b6c12]"
            >
              Explore all brands
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {brands.slice(0, 8).map((brand) => (
              <Link
                key={brand?._id}
                href={{
                  pathname: "/shop",
                  query: { brand: brand?.slug?.current },
                }}
                className="group flex aspect-[3/2] items-center justify-center rounded-md border border-black/10 bg-white/75 p-4 transition-colors hover:border-[#9a7918]"
              >
                {brand?.image ? (
                  <Image
                    src={urlFor(brand.image).width(260).height(160).fit("max").url()}
                    alt={`${brand?.title || "Eyewear brand"} logo`}
                    width={260}
                    height={160}
                    className="max-h-full max-w-full object-contain opacity-70 transition-opacity group-hover:opacity-100"
                  />
                ) : (
                  <span className="font-display text-center text-sm font-black text-[#111313]">
                    {brand?.title}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-9 flex items-center gap-3 border-t border-black/10 pt-6 text-xs font-bold text-black/55">
          <BadgeCheck className="h-4 w-4 text-[#315d55]" />
          Brand and product information is checked before it reaches the
          storefront.
        </div>
      </Container>
    </section>
  );
};

export default ShopByBrands;
