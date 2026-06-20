import Link from "next/link";
import { Camera, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AiStylistCTA({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
          : "mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-8"
      }
    >
      <div
        className={
          compact
            ? ""
            : "overflow-hidden rounded-[36px] bg-gray-950 p-6 text-white shadow-2xl sm:p-10"
        }
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-600 sm:text-white">
              <Sparkles className="h-3.5 w-3.5" />
              AI Recommended For You
            </div>
            <h2 className={compact ? "text-xl font-semibold" : "text-3xl font-semibold sm:text-4xl"}>
              Try frames live before you buy.
            </h2>
            <p className={compact ? "mt-2 text-sm text-gray-500" : "mt-3 max-w-2xl text-sm leading-6 text-gray-300"}>
              Open the camera, fit the frame on your face, lock the placement, and switch styles instantly.
            </p>
          </div>
          <Button asChild className={compact ? "rounded-full" : "h-12 rounded-full bg-white px-6 text-gray-950 hover:bg-gray-100"}>
            <Link href="/ai-stylist">
              <Camera className="mr-2 h-4 w-4" />
              Start Try-On
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
