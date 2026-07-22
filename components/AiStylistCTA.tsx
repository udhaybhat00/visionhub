import Link from "next/link";
import { ArrowRight, Camera, Glasses, ScanFace } from "lucide-react";
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
            <p className="text-xs font-extrabold uppercase text-[#8b6c12]">
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
      <Container className="relative grid min-h-[340px] items-center gap-10 py-14 lg:grid-cols-[1fr_0.85fr] lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-extrabold uppercase text-[#d5b34b]">
            <span className="h-px w-8 bg-[#d5b34b]" />
            VisionHub live fit
          </p>
          <h2 className="font-display mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            See the frame on you, not just the shelf.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
            Compare silhouettes and proportions with the VisionHub camera
            try-on, then return to the collection with a clearer choice.
          </p>
          <Link
            href="/ai-stylist"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d5b34b] px-6 text-sm font-extrabold text-[#111313] transition-colors hover:bg-[#ead477]"
          >
            <Camera className="h-4 w-4" />
            Start virtual try-on
          </Link>
        </div>

        <div className="relative hidden min-h-[250px] items-center justify-center lg:flex">
          <div className="absolute h-60 w-60 rounded-full border border-white/10" />
          <div className="absolute h-44 w-44 rounded-full border border-[#d5b34b]/30" />
          <Glasses className="relative z-10 h-40 w-40 text-white" strokeWidth={1} />
          <div className="absolute bottom-5 right-2 border-l border-[#d5b34b] pl-4">
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
