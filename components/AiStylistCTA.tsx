import Link from "next/link";
import { ArrowRight, Camera, ScanFace } from "lucide-react";
import Container from "./Container";

export default function AiStylistCTA({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <section className="rounded-lg border border-black/10 bg-[#f6f6f3] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#111313] text-[#d5b34b]">
            <ScanFace className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase text-gold-text">
              Virtual try-on
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#111313]">
              See this frame on you.
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/55">
              Compare fit and shape using your camera before making a choice.
            </p>
            <Link
              href="/ai-stylist"
              className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#111313]"
            >
              Start try-on
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-[#101414] text-white">
      <Container className="relative grid min-h-[380px] items-center gap-10 py-14 lg:grid-cols-[1fr_0.85fr] lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase text-gold-text-on-dark">
            <span className="h-px w-8 bg-gold-text-on-dark" />
            VisionHub live fit
          </p>
          <h2 className="font-display mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            See the frame on you, not just the shelf.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Point, try, compare. Our virtual stylist lets you test frames in
            real time using your camera — no uploads, no waiting.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d5b34b]/20 text-[10px] font-bold text-[#d5b34b]">
                1
              </span>
              Open your camera
            </li>
            <li className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d5b34b]/20 text-[10px] font-bold text-[#d5b34b]">
                2
              </span>
              Try any frame instantly
            </li>
            <li className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d5b34b]/20 text-[10px] font-bold text-[#d5b34b]">
                3
              </span>
              Compare styles side by side
            </li>
            <li className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d5b34b]/20 text-[10px] font-bold text-[#d5b34b]">
                4
              </span>
              Pick your perfect fit
            </li>
          </ul>
          <Link
            href="/ai-stylist"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-[#d5b34b] px-8 text-sm font-bold text-[#111313] shadow-lg shadow-[#d5b34b]/20 transition-all duration-300 hover:bg-[#ead477] hover:shadow-xl hover:shadow-[#d5b34b]/30"
          >
            <Camera className="h-4 w-4" />
            Start virtual try-on
          </Link>
        </div>

        <div className="relative hidden min-h-[300px] items-center justify-center lg:flex">
          <div className="absolute h-64 w-64 rounded-full border border-white/10 animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute h-48 w-48 rounded-full border border-[#d5b34b]/30 animate-[float_6s_ease-in-out_infinite_0.5s]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d5b34b]/10 ring-1 ring-[#d5b34b]/30">
              <Camera className="h-10 w-10 text-[#d5b34b]" strokeWidth={1.5} />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-1.5 w-8 rounded-full bg-[#d5b34b]/40" />
              <div className="h-1.5 w-4 rounded-full bg-white/20" />
              <div className="h-1.5 w-6 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="absolute bottom-6 right-4 border-l border-[#d5b34b] pl-4">
            <p className="text-xs font-bold uppercase text-white/45">
              Live camera fit
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              Compare. Refine. Choose.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 top-0 h-full w-1/2 border-l border-white/5 bg-white/[0.015] [transform:skewX(-12deg)]" />
      </Container>
    </section>
  );
}
