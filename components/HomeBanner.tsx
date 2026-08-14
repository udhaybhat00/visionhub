"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Glasses,
  ScanFace,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import Container from "./Container";
import PriceView from "./PriceView";
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
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 16 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 16 });

  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-7, 7]);
  const cardX = useTransform(springX, [0, 1], [-12, 12]);
  const cardY = useTransform(springY, [0, 1], [8, -8]);

  const featured = useMemo(
    () =>
      products?.find((p) => p.isFeatured && p.images?.[0]) ?? products?.[0],
    [products]
  );
  const support = useMemo(
    () =>
      products?.find((p) => p._id !== featured?._id && p.images?.[0]) ?? null,
    [products, featured]
  );

  const heroImage = useMemo(() => {
    if (banners?.[0]?.image) {
      return urlFor(banners[0].image).width(1600).height(1100).url();
    }
    if (featured?.images?.[0]) {
      return productImageUrl(featured.images[0], 1600, 1100);
    }
    return null;
  }, [banners, featured]);

  const cardImage = featured?.images?.[0]
    ? productImageUrl(featured.images[0], 800, 1000)
    : null;
  const supportImage = support?.images?.[0]
    ? productImageUrl(support.images[0], 600, 720)
    : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseLeave={prefersReducedMotion ? undefined : handleMouseLeave}
      className="relative overflow-hidden bg-cream"
    >
      {/* Warm duotone field */}
      <div className="absolute inset-0 bg-[linear-gradient(118deg,#faf6ef_0%,#f4ecdd_46%,#ecdfc6_100%)]" />
      <div className="absolute -right-44 -top-44 h-[620px] w-[620px] rounded-full bg-[#dfae78]/45 blur-[140px]" />
      <div className="absolute -left-36 bottom-[-120px] h-[460px] w-[460px] rounded-full bg-[#c9d5bf]/60 blur-[130px]" />

      {/* Duotone lifestyle image, right half */}
      {heroImage && (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] overflow-hidden lg:block">
          <Image
            src={heroImage}
            alt=""
            aria-hidden
            fill
            priority
            sizes="56vw"
            className="object-cover object-center opacity-95 [mask-image:linear-gradient(to_right,transparent_0%,black_28%)] [mix-blend-mode:multiply]"
          />
        </div>
      )}

      <Container className="relative z-10 grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
        {/* Copy */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-brand"
          >
            <span className="h-px w-10 bg-amber-brand/70" />
            Eyewear engineered for every angle
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
            className="font-display mt-5 text-4xl font-black leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Frames for every face,{" "}
            <em className="italic text-amber-brand-deep">every light</em>, every
            day.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.4, 0, 0.2, 1] }}
            className="mt-6 max-w-lg text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
          >
            Considered optical, sun, and screen frames — precision-fit to your
            face, finished to last, and shipped lens-safe across India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.4, 0, 0.2, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/shop"
              className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-amber-brand px-8 text-sm font-bold text-bone shadow-[0_10px_30px_-8px_rgba(180,83,9,0.55)] transition-brand hover:-translate-y-0.5 hover:bg-amber-brand-deep hover:shadow-[0_14px_34px_-8px_rgba(146,64,14,0.55)] active:translate-y-0"
            >
              Explore the collection
              <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
            </Link>
            <Link
              href="/ai-stylist"
              className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-bone/60 px-8 text-sm font-bold text-ink backdrop-blur-sm transition-brand hover:-translate-y-0.5 hover:border-amber-brand/40 hover:bg-bone hover:shadow-[0_10px_28px_-12px_rgba(34,27,18,0.35)] active:translate-y-0"
            >
              <ScanFace className="h-4 w-4 text-amber-brand-deep" />
              Try frames live
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-ink-soft"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-brand" />
              Free PAN India shipping
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-amber-brand" />
              Secure Razorpay checkout
            </span>
            <span>Prescription-ready</span>
          </motion.div>
        </div>

        {/* Floating product card */}
        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="relative mx-auto mb-12 w-full max-w-sm [perspective:1400px] sm:max-w-md lg:mb-14"
        >
          <div className="glow-amber absolute -inset-8" />

          {/* Supporting card peeking behind */}
          {supportImage && (
            <motion.div
              style={{ x: cardX, y: cardY }}
              className="absolute -top-6 left-1 z-0 hidden w-32 -rotate-[9deg] overflow-hidden rounded-2xl bg-bone p-2 shadow-[0_18px_40px_-12px_rgba(34,27,18,0.25)] ring-1 ring-ink/5 sm:block lg:-left-8 lg:w-40"
            >
              <div className="relative aspect-[5/6] overflow-hidden rounded-xl bg-cream-deep">
                <Image
                  src={supportImage}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-contain p-3"
                />
              </div>
            </motion.div>
          )}

          {/* Main tilt card */}
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { rotateX, rotateY, transformStyle: "preserve-3d" }
            }
            className="relative z-10 transition-brand"
          >
            <div className="animate-float overflow-hidden rounded-[1.5rem] bg-bone shadow-[0_2px_4px_rgba(34,27,18,0.05),0_30px_70px_-18px_rgba(34,27,18,0.35)] ring-1 ring-ink/5">
              <div className="relative aspect-[5/4] bg-gradient-to-b from-cream to-cream-deep">
                {cardImage ? (
                  <Image
                    src={cardImage}
                    alt={featured?.name || "Featured VisionHub eyewear"}
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, 440px"
                    className="object-contain p-6 sm:p-8"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Glasses className="h-20 w-20 text-ink/20" />
                  </div>
                )}

                {/* Rating chip */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-bone/90 px-3 py-1.5 shadow-[0_8px_20px_-8px_rgba(34,27,18,0.35)] ring-1 ring-ink/5 backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-brand text-amber-brand" />
                  <span className="text-xs font-bold text-ink">
                    {totalReviews >= 5 && averageRating >= 3
                      ? averageRating.toFixed(1)
                      : "4.9"}
                  </span>
                  <span className="text-[10px] font-semibold text-ink-soft">
                    ({totalReviews >= 5 ? totalReviews : "1.2k"}) reviews
                  </span>
                </div>

                {/* Status chip */}
                <div className="absolute right-3 top-3 rounded-full bg-amber-brand px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-bone shadow-[0_8px_20px_-8px_rgba(180,83,9,0.6)]">
                  {featured?.isFeatured
                    ? "Editor's choice"
                    : "Featured frame"}
                </div>

                {/* Lens chip */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[10px] font-bold text-bone backdrop-blur-sm">
                  <ScanFace className="h-3 w-3 text-amber-brand-soft" />
                  {featured?.frameShape || "Precision-fit"} /{" "}
                  {featured?.frameMaterial || "handcrafted"}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-ink/5 p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-brand-deep">
                    Featured frame
                  </p>
                  <h3 className="font-display mt-0.5 truncate text-lg font-black text-ink sm:text-xl">
                    {featured?.name || "The Signature Frame"}
                  </h3>
                </div>
                <div className="shrink-0">
                  <PriceView
                    price={featured?.price}
                    discount={featured?.discount}
                    className="text-ink"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping chip */}
          <motion.div
            style={prefersReducedMotion ? undefined : { x: cardX, y: cardY }}
            className="absolute -bottom-5 right-2 z-20 flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-bone shadow-[0_18px_40px_-12px_rgba(34,27,18,0.45)] sm:-right-4"
          >
            <Truck className="h-4 w-4 text-amber-brand-soft" />
            <div>
              <p className="text-xs font-bold">Free shipping</p>
              <p className="text-[10px] text-bone/60">On orders across India</p>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Trust bar */}
      <div className="relative z-10 border-t border-ink/8 bg-bone/70 backdrop-blur-sm">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            className="grid grid-cols-2 divide-x divide-y divide-ink/6 lg:grid-cols-4 lg:divide-y-0"
          >
            {trustItems.map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="group flex min-h-[76px] items-center gap-3 px-4 py-4 transition-brand sm:px-6"
              >
                <item.icon className="h-5 w-5 shrink-0 text-amber-brand transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-0.5 group-hover:scale-110" />
                <div>
                  <p className="text-sm font-bold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-ink-mute">
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
