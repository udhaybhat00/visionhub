import Container from "./Container";
import { getAllBrands } from "@/sanity/queries";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight, BadgeCheck, Headset, ShieldCheck, Truck } from "lucide-react";

const assurances = [
  {
    title: "Quality Checked",
    description: "Every frame is inspected before dispatch.",
    icon: BadgeCheck,
  },
  {
    title: "Secure Delivery",
    description: "Protective packaging and tracked shipping.",
    icon: Truck,
  },
  {
    title: "Fit Guidance",
    description: "Support for frame shape, size, and lens choices.",
    icon: Headset,
  },
  {
    title: "Authentic Products",
    description: "Eyewear sourced from trusted brand partners.",
    icon: ShieldCheck,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();

  return (
    <Container className="py-12 lg:py-16">
      <section className="grid gap-8 border-t border-slate-200 pt-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-shop_light_green">
            Brands And Service
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-slate-950 lg:text-4xl">
            Eyewear selected for fit, finish, and trust.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Browse verified eyewear brands and buy with the practical details a
            frame shopper needs: size, lens type, material, stock, and delivery.
          </p>
          <Link
            href="/brands"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-950 hover:text-shop_dark_green"
          >
            Explore brands
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          {brands?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {brands.slice(0, 12).map((brand) => (
                <Link
                  key={brand?._id}
                  href={{
                    pathname: "/shop",
                    query: { brand: brand?.slug?.current },
                  }}
                  className="flex aspect-[3/2] items-center justify-center rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-shop_light_green"
                >
                  {brand?.image ? (
                    <Image
                      src={urlFor(brand.image).width(220).height(140).url()}
                      alt={`${brand?.title || "Eyewear brand"} logo`}
                      width={220}
                      height={140}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-bold text-slate-500">
                      {brand?.title}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assurances.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-shop_orange">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default ShopByBrands;
