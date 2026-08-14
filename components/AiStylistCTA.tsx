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
      <section className="rounded-xl border border-ink/10 bg-cream-deep p-5 transition-brand hover:shadow-[0_20px_40px_-20px_rgba(34,27,18,0.25)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-brand text-bone transition-brand hover:-translate-y-0.5">
            <ScanFace className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-brand-deep">
              Virtual try-on
            </p>
            <h2 className="font-display mt-1 text-lg font-black text-ink">
              See this frame on you.
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Compare fit and shape using your camera before making a choice.
            </p>
            <Link
              href="/ai-stylist"
              className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-ink transition-brand hover:text-amber-brand-deep"
            >
              <span className="link-underline">Start try-on</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-ink text-bone">
      <Container className="relative grid min-h-[380px] items-center gap-10 py-14 lg:grid-cols-[1fr_0.85fr] lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-brand-soft">
            <span className="h-px w-8 bg-amber-brand-soft" />
            VisionHub live fit
          </p>
          <h2 className="font-display mt-4 text-3xl font-black leading-[1.08] tracking-[-0.01em] sm:text-4xl lg:text-5xl">
            See the frame on you, not just the shelf.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-bone/60 sm:text-base">
            Point, try, compare. Our virtual stylist lets you test frames in
            real time using your camera — no uploads, no waiting.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li className="flex items-center gap-2.5 text-sm text-bone/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-brand-soft/15 text-[10px] font-bold text-amber-brand-soft">
                1
              </span>
              Open your camera
            </li>
            <li className="flex items-center gap-2.5 text-sm text-bone/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-brand-soft/15 text-[10px] font-bold text-amber-brand-soft">
                2
              </span>
              Try any frame instantly
            </li>
            <li className="flex items-center gap-2.5 text-sm text-bone/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-brand-soft/15 text-[10px] font-bold text-amber-brand-soft">
                3
              </span>
              Compare styles side by side
            </li>
            <li className="flex items-center gap-2.5 text-sm text-bone/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-brand-soft/15 text-[10px] font-bold text-amber-brand-soft">
                4
              </span>
              Pick your perfect fit
            </li>
          </ul>
          <Link
            href="/ai-stylist"
            className="mt-8 inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-amber-brand px-8 text-sm font-bold text-bone shadow-[0_12px_32px_-10px_rgba(180,83,9,0.6)] transition-brand hover:-translate-y-0.5 hover:bg-amber-brand-deep hover:shadow-[0_16px_36px_-10px_rgba(146,64,14,0.6)] active:translate-y-0"
          >
            <Camera className="h-4 w-4" />
            Start virtual try-on
          </Link>
        </div>

        <div className="relative hidden min-h-[300px] items-center justify-center lg:flex">
          <div className="absolute h-64 w-64 rounded-full border border-bone/10 animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute h-48 w-48 rounded-full border border-amber-brand/40 animate-[float_6s_ease-in-out_infinite_0.5s]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-brand-soft/10 ring-1 ring-amber-brand/40">
              <Camera className="h-10 w-10 text-amber-brand-soft" strokeWidth={1.5} />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-1.5 w-8 rounded-full bg-amber-brand/50" />
              <div className="h-1.5 w-4 rounded-full bg-bone/20" />
              <div className="h-1.5 w-6 rounded-full bg-bone/20" />
            </div>
          </div>
          <div className="absolute bottom-6 right-4 border-l border-amber-brand pl-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-bone/45">
              Live camera fit
            </p>
            <p className="mt-1 text-sm font-bold text-bone">
              Compare. Refine. Choose.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 top-0 h-full w-1/2 border-l border-bone/5 bg-bone/[0.015] [transform:skewX(-12deg)]" />
      </Container>
    </section>
  );
}
