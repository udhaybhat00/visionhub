"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ScanFace,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult, BANNER_QUERYResult } from "@/sanity.types";
import { productImageUrl, urlFor } from "@/sanity/lib/image";

interface HomeBannerProps {
  products: ALL_PRODUCTS_QUERYResult;
  banners: BANNER_QUERYResult;
  totalReviews: number;
  averageRating: number;
}

const trustItems = [
  {
    title: "Authenticity checked",
    description: "Frames inspected before dispatch",
    icon: BadgeCheck,
  },
  {
    title: "Fit guidance",
    description: "Sizing and frame details upfront",
    icon: ScanFace,
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

export default function HomeBanner({
  products,
  banners,
  totalReviews,
  averageRating,
}: HomeBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const imageX = useTransform(springX, [0, 1], [8, -8]);
  const imageY = useTransform(springY, [0, 1], [8, -8]);

  const hasGoodImage = useMemo(() => {
    if (banners?.[0]?.image) return true;
    const featured = products?.find((p) => p.isFeatured && p.images?.[0]);
    return !!featured?.images?.[0];
  }, [banners, products]);

  const heroImage = useMemo(() => {
    if (banners?.[0]?.image) {
      return urlFor(banners[0].image).width(1920).height(1080).url();
    }
    const featured = products?.find((p) => p.isFeatured && p.images?.[0]);
    if (featured?.images?.[0]) {
      return productImageUrl(featured.images[0], 1920, 1080);
    }
    return null;
  }, [banners, products]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="bg-[#070a0a] text-white">
      <div className="relative min-h-[520px] overflow-hidden sm:min-h-[560px] lg:min-h-[600px]">
        {hasGoodImage && heroImage ? (
          <motion.div
            className="absolute inset-0"
            style={{ x: imageX, y: imageY }}
          >
            <Image
              src={heroImage}
              alt="VisionHub eyewear collection"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-105"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#070a0a] via-[#0f1212] to-[#0a0c0a]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#070a0a]/98 via-[#070a0a]/75 via-40% to-[#070a0a]/15 to-80%" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a0a]/70 via-transparent to-transparent" />

        {!hasGoodImage && (
          <>
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.04]">
              <div className="absolute right-20 top-1/4 h-72 w-72 rounded-full bg-[#d5b34b] blur-[120px]" />
              <div className="absolute bottom-1/4 right-40 h-48 w-48 rounded-full bg-white blur-[100px]" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(212,175,55,0.08),transparent)]" />
          </>
        )}

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDI1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60" />

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d5b34b]/30 to-transparent" />

        <Container className="relative z-10 flex min-h-[520px] items-center py-12 sm:min-h-[560px] lg:min-h-[600px] lg:py-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#e2c86e]">
                <span className="h-px w-10 bg-[#e2c86e]" />
                Eyewear engineered for every angle
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="font-display text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl"
            >
              VisionHub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="font-display mt-4 text-2xl font-semibold leading-tight text-white/90 sm:text-3xl"
            >
              Frames for every face, every light, every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-[#d5b34b] px-8 text-sm font-bold text-[#111313] shadow-lg shadow-[#d5b34b]/20 transition-all duration-300 hover:bg-[#ebd47f] hover:shadow-xl hover:shadow-[#d5b34b]/30"
                >
                  Explore the collection
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/ai-stylist"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-white/25 bg-white/8 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#111313]"
                >
                  <ScanFace className="h-4 w-4" />
                  Try frames live
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-white/60"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Free PAN India shipping
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" />
                Secure Razorpay checkout
              </span>
              <span>Prescription-ready</span>
            </motion.div>
          </div>
        </Container>
      </div>

      <div className="border-t border-black/6 bg-white text-[#171919]">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-2 divide-x divide-y divide-black/6 lg:grid-cols-4 lg:divide-y-0"
          >
            <div className="flex min-h-[72px] items-center gap-3 px-4 py-4 sm:px-6">
              <Star className="h-5 w-5 shrink-0 fill-[#c9a227] text-[#c9a227]" />
              <div>
                <p className="text-sm font-bold">
                  {totalReviews >= 5 && averageRating >= 3
                    ? `${averageRating.toFixed(1)} (${totalReviews} reviews)`
                    : "Rated by customers"}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-black/45">
                  {totalReviews >= 5
                    ? `Across ${products.length} styles`
                    : "Join our verified reviewers"}
                </p>
              </div>
            </div>
            {trustItems.map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex min-h-[72px] items-center gap-3 px-4 py-4 transition-all duration-300 sm:px-6"
              >
                <item.icon className="h-5 w-5 shrink-0 text-[#a17f1a]" />
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-black/45">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
