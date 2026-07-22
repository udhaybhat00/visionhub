import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Glasses,
  ScanFace,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { banner_1 } from "@/images";
import Container from "./Container";

const trustItems = [
  {
    title: "Authenticity checked",
    description: "Frames inspected before dispatch",
    icon: BadgeCheck,
  },
  {
    title: "Fit guidance",
    description: "Sizing and frame details upfront",
    icon: Glasses,
  },
  {
    title: "Protected delivery",
    description: "Tracked, lens-safe packaging",
    icon: Truck,
  },
  {
    title: "Secure checkout",
    description: "Verified Razorpay payments",
    icon: ShieldCheck,
  },
];

export default function HomeBanner() {
  return (
    <section className="bg-[#101313] text-white">
      <div className="relative min-h-[560px] overflow-hidden sm:min-h-[590px] lg:min-h-[620px]">
        <Image
          src={banner_1}
          alt="VisionHub signature black optical frame"
          fill
          priority
          sizes="100vw"
          className="home-hero-frame object-cover object-[62%_center] sm:object-[58%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,10,0.96)_0%,rgba(7,10,10,0.84)_36%,rgba(7,10,10,0.22)_69%,rgba(7,10,10,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,10,10,0.72)_0%,transparent_48%)] lg:hidden" />

        <Container className="relative z-10 flex min-h-[560px] items-center py-12 sm:min-h-[590px] lg:min-h-[620px] lg:py-16">
          <div className="max-w-xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase text-[#e2c86e]">
              <span className="h-px w-10 bg-[#e2c86e]" />
              Independent optical edit
            </div>

            <h1 className="font-display text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
              VisionHub
            </h1>
            <p className="font-display mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
              Eyewear engineered for every angle.
            </p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
              Discover considered frames for sun, screen, prescription, and
              movement. Built around precise fit, confident materials, and
              everyday clarity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d5b34b] px-6 text-sm font-bold text-[#111313] transition-colors hover:bg-[#ebd47f]"
              >
                Explore the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ai-stylist"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/35 bg-black/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-[#111313]"
              >
                <ScanFace className="h-4 w-4" />
                Try frames live
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/20 pt-5 text-xs font-semibold text-white/72">
              <span>UV400 protection options</span>
              <span>Prescription-ready styles</span>
              <span>Pan India delivery</span>
            </div>
          </div>
        </Container>

        <div className="pointer-events-none absolute bottom-5 right-5 hidden text-right lg:block">
          <p className="text-xs font-bold uppercase text-white/60">
            Signature edit 01
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Sculpted optical acetate
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#f6f6f3] text-[#171919]">
        <Container className="grid grid-cols-2 divide-x divide-y divide-black/10 lg:grid-cols-4 lg:divide-y-0">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex min-h-[96px] items-center gap-3 px-3 py-5 sm:px-5"
            >
              <item.icon className="h-5 w-5 shrink-0 text-[#a17f1a]" />
              <div>
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-black/55">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}
