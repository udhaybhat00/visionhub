import { Category } from "@/sanity.types";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight, Monitor, ShieldCheck, Sun, Trophy } from "lucide-react";

interface Props {
  categories: Category[];
}

const needs = [
  {
    title: "Sun Protection",
    description: "Polarized and UV-focused styles for daily outdoor use.",
    href: "/shop?type=sunglasses",
    icon: Sun,
  },
  {
    title: "Screen Comfort",
    description: "Computer glasses built for long workdays and study hours.",
    href: "/shop?type=computer-glasses",
    icon: Monitor,
  },
  {
    title: "Prescription Ready",
    description: "Frames selected for comfort, fit, and everyday wear.",
    href: "/shop?type=prescription",
    icon: ShieldCheck,
  },
  {
    title: "Active Eyewear",
    description: "Secure-fit sports styles for movement and performance.",
    href: "/shop?type=sports",
    icon: Trophy,
  },
];

const HomeCategories = ({ categories }: Props) => {
  return (
    <Container className="py-12 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-shop_light_green">
            Shop By Need
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-slate-950 lg:text-4xl">
            Start with how you use your eyewear.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Choose by protection, screen comfort, prescription use, or active
            fit. Every product page shows lens and frame details before you buy.
          </p>
          <Link
            href="/category"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-950 hover:text-shop_dark_green"
          >
            View all collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {needs.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-shop_light_green hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-shop_dark_green">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-shop_dark_green">
                Shop styles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {categories?.length > 0 && (
        <div className="mt-10 border-t border-slate-200 pt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-950">
                Browse Collections
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Curated eyewear categories from the VisionHub catalog.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category?._id}
                href={`/category/${category?.slug?.current}`}
                className="group rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-shop_light_green"
              >
                <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-50 p-4">
                  {category?.image ? (
                    <Image
                      src={urlFor(category.image).width(260).height(180).url()}
                      alt={`${category?.title} eyewear collection`}
                      width={260}
                      height={180}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <Sun className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h4 className="min-w-0 truncate text-sm font-extrabold text-slate-950">
                    {category?.title}
                  </h4>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-shop_dark_green" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default HomeCategories;
