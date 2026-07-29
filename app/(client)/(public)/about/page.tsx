"use client";

import { motion } from "motion/react";
import {
  Heart,
  Users,
  Award,
  ShoppingBag,
  Target,
  Globe,
  Zap,
  Shield,
  Star,
  ArrowRight,
  ScanFace,
  BadgeCheck,
  Truck,
} from "lucide-react";
import Container from "@/components/Container";
import Link from "next/link";

const stats = [
  { number: "100+", label: "Eyewear styles", icon: ShoppingBag },
  { number: "10+", label: "Categories", icon: Award },
  { number: "24/7", label: "Customer support", icon: Users },
  { number: "100%", label: "Authentic products", icon: Shield },
];

const values = [
  {
    icon: Target,
    title: "Customer first",
    description: "Every decision starts with what's best for the person wearing the frames.",
  },
  {
    icon: Shield,
    title: "Premium quality",
    description: "Every product is checked against our standards before it reaches you.",
  },
  {
    icon: Zap,
    title: "Vision & comfort",
    description: "Frames built for real life — screen time, sunlight, sport, and prescription needs.",
  },
  {
    icon: Globe,
    title: "Responsible sourcing",
    description: "Committed to working with suppliers who share our values on quality and ethics.",
  },
];

const milestones = [
  { year: "2025", event: "VisionHub founded with a focus on quality eyewear and customer-first service." },
  { year: "2026", event: "Expanded catalog across categories including AI-powered virtual try-on." },
];

const team = [
  {
    name: "Udhay Bhat",
    role: "Founder & CEO",
    initials: "UB",
    description:
      "Building VisionHub with a focus on premium eyewear — from sun and screen to prescription and performance — while delivering a seamless shopping experience.",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-[#f6f6f3] min-h-screen">
      <section className="relative overflow-hidden bg-[#101313] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white" />
          <div className="absolute -right-32 -top-10 h-96 w-96 rounded-full border border-white" />
          <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full border border-white" />
        </div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative text-center"
          >
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#d5b34b]">
              <span className="h-px w-8 bg-[#d5b34b]" />
              Est. 2025
              <span className="h-px w-8 bg-[#d5b34b]" />
            </span>
            <h1 className="font-display mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              About VisionHub
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
              VisionHub is your destination for premium eyewear — sunglasses, computer
              glasses, prescription frames, and sports eyewear — built around precise
              fit, confident materials, and everyday clarity.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-14 lg:pb-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-md border border-black/10 bg-white px-5 py-7 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <stat.icon className="mx-auto h-7 w-7 text-[#9a7918]" />
                <p className="font-display mt-4 text-3xl font-black leading-none text-[#111313] sm:text-4xl">
                  {stat.number}
                </p>
                <p className="mt-2 text-xs font-semibold text-black/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="border-y border-black/10 bg-white py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
                Our story
              </span>
              <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
                Helping you see better, every day.
              </h2>
              <p className="mt-5 text-sm leading-7 text-black/55 sm:text-base">
                VisionHub was built around a straightforward idea: premium eyewear
                should be accessible, fit well, and last. We curate frames for sun,
                screen, prescription, and movement — pairing each with clear
                measurements, material details, and lens options so you know exactly
                what you&apos;re choosing.
              </p>
              <p className="mt-4 text-sm leading-7 text-black/55 sm:text-base">
                Whether you need blue-light protection for long office hours,
                polarised sun lenses for the road, or lightweight sports frames that
                stay put, VisionHub is built around precision and everyday wear.
              </p>
              <Link
                href="/contact"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#111313] transition-colors hover:text-[#8b6c12]"
              >
                Get in touch
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-md border border-black/10 bg-[#f6f6f3] p-8">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-black/10 bg-white p-4 text-center">
                    <Star className="mx-auto h-5 w-5 text-[#9a7918]" />
                    <p className="mt-2 text-xs font-extrabold text-[#111313]">
                      Premium quality
                    </p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-white p-4 text-center">
                    <BadgeCheck className="mx-auto h-5 w-5 text-[#315d55]" />
                    <p className="mt-2 text-xs font-extrabold text-[#111313]">
                      Authentic products
                    </p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-white p-4 text-center">
                    <Truck className="mx-auto h-5 w-5 text-[#315d55]" />
                    <p className="mt-2 text-xs font-extrabold text-[#111313]">
                      Protected delivery
                    </p>
                  </div>
                  <div className="rounded-md border border-black/10 bg-white p-4 text-center">
                    <ScanFace className="mx-auto h-5 w-5 text-[#9a7918]" />
                    <p className="mt-2 text-xs font-extrabold text-[#111313]">
                      Virtual try-on
                    </p>
                  </div>
                </div>
                <blockquote className="mt-6 border-t border-black/10 pt-6">
                  <p className="text-sm leading-7 italic text-black/55">
                    &ldquo;Great vision starts with quality eyewear. Our goal is to
                    help every customer find the perfect balance of comfort, style,
                    and clarity.&rdquo;
                  </p>
                  <p className="mt-3 text-xs font-extrabold text-[#111313]">
                    — VisionHub Team
                  </p>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f6f6f3] py-14 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
              Our values
            </span>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              What we stand for.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-black/55">
              These principles guide everything from product selection to how we
              support you.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group rounded-md border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f6f6f3] text-[#315d55] transition-colors group-hover:bg-[#315d55] group-hover:text-white">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-extrabold text-[#111313]">
                  {value.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-black/50">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="border-y border-black/10 bg-white py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
                Timeline
              </span>
              <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
                Our journey so far.
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/55">
                From founding to first collection, here&apos;s how VisionHub has
                grown.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-black/10"
            >
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative"
                >
                  <span className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white text-[10px] font-extrabold text-[#9a7918]">
                    {i + 1}
                  </span>
                  <span className="text-xs font-extrabold uppercase text-[#9a7918]">
                    {m.year}
                  </span>
                  <p className="mt-1 text-sm leading-7 text-black/55">
                    {m.event}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f6f6f3] py-14 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
              Leadership
            </span>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Meet the founder.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-black/55">
              VisionHub was built on a mission to combine quality eyewear with a
              shopping experience that puts the customer first.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group rounded-md border border-black/10 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#101313] text-xl font-black text-[#d5b34b] transition-transform group-hover:scale-105">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-base font-extrabold text-[#111313]">
                  {member.name}
                </h3>
                <span className="mt-1 inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#9a7918]">
                  {member.role}
                </span>
                <p className="mt-3 text-xs leading-6 text-black/50">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#101313] py-16 lg:py-20">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white" />
        </div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative text-center"
          >
            <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
              Find your perfect pair.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/62">
              Explore our collection of sunglasses, computer glasses, prescription
              frames, and sports eyewear — built for the way you see the world.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d5b34b] px-6 text-sm font-extrabold text-[#111313] transition-all duration-300 hover:bg-[#ead477] hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start shopping
                <ShoppingBag className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-6 text-sm font-extrabold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#111313] hover:-translate-y-0.5 hover:shadow-lg"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
