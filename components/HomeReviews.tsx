"use client";

import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Container from "./Container";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    name: "Aditi Sharma",
    city: "Delhi",
    collection: "Screen eyewear",
    spec: "Medium / 49-18-140",
    text: "The frame stays light through long office hours, and the measurements made choosing the right size online straightforward.",
    verified: true,
  },
  {
    name: "Rohan Mehta",
    city: "Bengaluru",
    collection: "Polarised sunglasses",
    spec: "Large / 54-16-145",
    text: "The lenses feel crisp while driving, the frame sits securely, and the protective packaging arrived in excellent condition.",
    verified: true,
  },
  {
    name: "Nisha Iyer",
    city: "Chennai",
    collection: "Acetate optical",
    spec: "Petite / 47-19-135",
    text: "The finish feels considered and the hinges are solid. Most importantly, the dimensions shown online matched the frame I received.",
    verified: true,
  },
];

const trustSignals = [
  {
    title: "Fit-first details",
    description: "Dimensions, shape, material, and lens notes before checkout.",
    icon: Ruler,
  },
  {
    title: "Protected delivery",
    description: "Lens-safe handling, protective packaging, and tracking.",
    icon: Truck,
  },
  {
    title: "Frame inspection",
    description: "Finish, alignment, and product condition checked before dispatch.",
    icon: ShieldCheck,
  },
];

export default function HomeReviews() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="border-y border-black/10 bg-[#f6f6f3] py-14 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-extrabold uppercase text-[#9a7918]">
              Customer notes
            </p>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Confidence is found in the details.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-black/55 sm:text-base">
              From accurate sizing to careful delivery, the experience around
              the frame matters as much as the frame itself.
            </p>
            <div className="mt-7 flex gap-1 text-[#c49e2f]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-md">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <article className="flex min-h-[280px] flex-col rounded-md border border-black/10 bg-white p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-extrabold uppercase text-[#8b6c12]">
                        {reviews[current].collection}
                      </span>
                      <Quote className="h-5 w-5 text-black/18" />
                    </div>
                    <p className="mt-5 text-sm leading-7 text-[#252827]">
                      &ldquo;{reviews[current].text}&rdquo;
                    </p>
                    <div className="mt-auto border-t border-black/10 pt-5">
                      <p className="text-xs font-bold text-black/45">
                        {reviews[current].spec}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111313] text-[10px] font-bold text-white">
                          {reviews[current].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-[#111313]">
                              {reviews[current].name}
                            </span>
                            {reviews[current].verified && (
                              <BadgeCheck className="h-3.5 w-3.5 text-[#315d55]" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-black/45">
                            {reviews[current].city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={prev}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-black/50 transition-colors hover:border-[#9a7918] hover:text-[#9a7918]"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-6 bg-[#9a7918]"
                        : "w-2 bg-black/15"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white text-black/50 transition-colors hover:border-[#9a7918] hover:text-[#9a7918]"
                aria-label="Next review"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid border-t border-black/10 pt-8 sm:grid-cols-3">
          {trustSignals.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 border-b border-black/10 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
            >
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#9a7918]" />
              <div>
                <h3 className="text-sm font-extrabold text-[#111313]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-black/50">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
