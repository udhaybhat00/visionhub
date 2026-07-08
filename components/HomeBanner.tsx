import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Glasses,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { banner_1 } from "@/images";
import Container from "./Container";

const heroStats = [
  { value: "UV400", label: "Sun protection" },
  { value: "48h", label: "Dispatch target" },
  { value: "Pan India", label: "Delivery" },
];

const HomeBanner = async () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f5f8f7]">
      <Container className="relative min-h-[calc(100svh-190px)] py-10 sm:py-14 lg:min-h-[620px] lg:py-16">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#f5f8f7_0%,rgba(245,248,247,0.78)_20%,rgba(245,248,247,0.1)_58%,rgba(245,248,247,0)_100%)]" />
          <Image
            src={banner_1}
            alt="VisionHub premium eyewear frame"
            priority
            sizes="58vw"
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-shop_orange" />
              VisionHub Eyewear
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Frames made for clear vision and everyday style.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Shop sunglasses, computer glasses, prescription-ready frames, and
              sports eyewear with fit details, lens specs, and secure delivery
              shown upfront.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-bold text-white transition-colors hover:bg-shop_dark_green"
              >
                Shop Eyewear
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ai-stylist"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 text-sm font-bold text-slate-900 transition-colors hover:border-shop_light_green hover:text-shop_dark_green"
              >
                Try Frames Live
                <Glasses className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
              {heroStats.map((stat) => (
                <div key={stat.label} className="px-3 py-4">
                  <p className="text-base font-extrabold text-slate-950 sm:text-lg">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-shop_light_green" />
                Genuine product checks
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-shop_light_green" />
                Secure checkout
              </span>
            </div>
          </div>

          <div className="relative flex min-h-[250px] items-center justify-center lg:hidden">
            <Image
              src={banner_1}
              alt="VisionHub premium eyewear frame"
              priority
              sizes="100vw"
              className="max-h-[300px] w-full object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeBanner;
