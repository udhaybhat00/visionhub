import { cn } from "@/lib/utils";
import Link from "next/link";
import { Glasses } from "lucide-react";

interface Props {
  className?: string;
  variant?: "default" | "sm";
}

const Logo = ({ className, variant = "default" }: Props) => {
  if (variant === "sm") {
    return (
      <Link
        href="/"
        aria-label="VisionHub home"
        className={cn("group inline-flex items-center gap-2", className)}
      >
        <Glasses
          className="h-5 w-5 text-[#d5b34b] transition-transform group-hover:scale-105"
          strokeWidth={2}
        />
        <span className="font-display text-sm font-black uppercase">
          Vision<span className="text-[#d5b34b]">Hub</span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="VisionHub home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <Glasses
        className="h-7 w-7 text-current transition-transform group-hover:scale-105 md:h-8 md:w-8"
        strokeWidth={2}
      />
      <span className="font-display text-2xl font-black uppercase md:text-3xl">
        Vision<span className="text-[#c49e2f]">Hub</span>
      </span>
    </Link>
  );
};

export default Logo;
