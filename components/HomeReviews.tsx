"use client";
import { BadgeCheck, Quote, Ruler, ShieldCheck, Star, Truck, Sparkles } from "lucide-react";
import Container from "./Container";

// Expanded Pan-India Dataset covering multiple states, brand lines, and eyewear collections
const row1Reviews = [
  {
    name: "Aditi Sharma",
    city: "Delhi",
    brand: "VisionHub Blue",
    collection: "Blue Light Glasses",
    spec: "Size: Medium (49-18-140) | ClearShield Coating",
    text: "The frame is light enough for long office hours. Surfacing the exact size parameters made selecting online simple and highly predictable.",
  },
  {
    name: "Rohan Mehta",
    city: "Bengaluru",
    brand: "VisionHub Active",
    collection: "Sunglasses",
    spec: "Size: Large (54-16-145) | Polarised UV400 Protection",
    text: "The lenses feel incredibly clear while driving. The high-rebound case construction matches premium luxury optical boutiques.",
  },
  {
    name: "Nisha Iyer",
    city: "Chennai",
    brand: "VisionHub Luxe",
    collection: "Premium Collection",
    spec: "Size: Petite (47-19-135) | Handcrafted Acetate",
    text: "Sturdy multi-barrel hinges with an elegant high-gloss finish. Alignment was impeccably true right out of the delivery box.",
  },
  {
    name: "Vikram Malhotra",
    city: "Mumbai",
    brand: "VisionHub Blue",
    collection: "Blue Light Glasses",
    spec: "Size: Medium (50-20-142) | Screen Shield Tint",
    text: "Absolute elimination of evening digital eye strain. The structural balance distribution on the nasal pads prevents indentation markings.",
  },
  {
    name: "Ananya Sen",
    city: "Kolkata",
    brand: "VisionHub Luxe",
    collection: "Premium Collection",
    spec: "Size: Medium (51-19-140) | Scratch-Resistant Shell",
    text: "Beautiful tint gradient and heavy-duty frame build. The product page metrics are accurate down to the millimeter.",
  },
  {
    name: "Devendra Singh",
    city: "Jaipur",
    brand: "VisionHub Active",
    collection: "Sunglasses",
    spec: "Size: Large (55-17-145) | Hydrophobic Coating",
    text: "Completely repels sweat during my morning tennis drills. Frame grips tightly around the ears without applying painful pinch pressure.",
  }
];

const row2Reviews = [
  {
    name: "Priya Patel",
    city: "Ahmedabad",
    brand: "VisionHub Air",
    collection: "Prescription Frame",
    spec: "Size: Rimless (Flexible) | Ultra-light Beta-Wire",
    text: "Extremely bend-tolerant frames. Feels completely weights-free on the face while looking professional during client syncs.",
  },
  {
    name: "Arjun Rao",
    city: "Hyderabad",
    brand: "VisionHub",
    collection: "Premium Collection",
    spec: "Size: Large (52-21-145) | Scratch-Resistant Shell",
    text: "Robust frame density. The coating handles high hydrophobic water shedding cleanly during humid monsoon commutes.",
  },
  {
    name: "Kriti Verma",
    city: "Pune",
    brand: "VisionHub Luxe",
    collection: "Prescription Frame",
    spec: "Size: Medium (51-18-140) | High-Index Slim Lens",
    text: "The lens customization matches my exact power parameters cleanly. Accurate, crisp focal geometry across all quadrants.",
  },
  {
    name: "Aman Gupta",
    city: "Gurugram",
    brand: "VisionHub Air",
    collection: "Blue Light Glasses",
    spec: "Size: Medium (49-19-140) | Anti-Reflective Layer",
    text: "Elegant matte finish. The lens clarity is transparent, blending the screen viewing and reading zones invisibly.",
  },
  {
    name: "Rahul Nair",
    city: "Kochi",
    brand: "VisionHub Active",
    collection: "Sunglasses",
    spec: "Size: Medium (53-16-142) | Mirror Polarised",
    text: "Excellent contrast definition under harsh direct seaside light conditions. Shipment transit was rapid and safely packed.",
  },
  {
    name: "Siddharth Shukla",
    city: "Lucknow",
    brand: "VisionHub Air",
    collection: "Prescription Frame",
    spec: "Size: Medium (50-18-138) | Titanium Rim",
    text: "The structural hinge feel is outstanding. This is easily the most premium build quality I have encountered online.",
  }
];

const trustSignals = [
  {
    title: "Fit-first buying",
    description: "Frame size, shape, material, and lens notes are surfaced before checkout.",
    icon: Ruler,
  },
  {
    title: "Protected delivery",
    description: "Eyewear is packed with lens-safe handling and shipment tracking.",
    icon: Truck,
  },
  {
    title: "Quality checks",
    description: "Frames are checked for finish, alignment, and product condition.",
    icon: ShieldCheck,
  },
];

export default function HomeReviews() {
  return (
    <section className="border-y border-slate-200 bg-slate-950 py-20 text-white overflow-hidden selection:bg-shop_orange selection:text-slate-950">
      {/* Dynamic 24s loop velocity optimized for swift and seamless rendering on high-refresh mobile displays */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeL {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes marqueeR {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-loop-left { animation: marqueeL 24s linear infinite; will-change: transform; }
        .animate-loop-right { animation: marqueeR 24s linear infinite; will-change: transform; }
      `}} />

      <Container>
        {/* Header Grid Section */}
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-shop_orange/10 px-3 py-1.5 rounded-full border border-shop_orange/20">
              <Sparkles className="h-3.5 w-3.5 text-shop_orange animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-shop_orange">
                VisionHub Verified Feed
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-4xl text-slate-50">
              Real eyewear confidence, from fit to delivery.
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-400">
              Trust on an eyewear store comes down to operational transparency: how accurately the frame sits, crisp focal clarity, and flawless protective shipping.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {trustSignals.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-5 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-shop_orange text-slate-950 shadow-lg shadow-shop_orange/10">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-shop_orange transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Asymmetric Bidirectional Track Wrapper */}
      <div 
        className="group/track relative flex flex-col gap-6 w-full py-4 bg-slate-900/10"
        style={{
  WebkitMaskImage:
    "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
  maskImage:
    "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
}}
      >
        {/* ROW 1: Gliding Left (Pauses on mouse-hover) */}
        <div className="flex gap-6 animate-loop-left whitespace-nowrap min-w-full group-hover/track:[animation-play-state:paused]">
          {[...row1Reviews, ...row1Reviews, ...row1Reviews].map((review, idx) => (
            <Card key={`r1-${idx}`} review={review} />
          ))}
        </div>

        {/* ROW 2: Gliding Right (Pauses on mouse-hover) */}
        <div className="flex gap-6 animate-loop-right whitespace-nowrap min-w-full group-hover/track:[animation-play-state:paused]">
          {[...row2Reviews, ...row2Reviews, ...row2Reviews].map((review, idx) => (
            <Card key={`r2-${idx}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Individual Premium Branded Review Card Component */
function Card({ review }: { review: typeof row1Reviews[0] }) {
  return (
    <article className="inline-block w-[300px] sm:w-[390px] shrink-0 whitespace-normal rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-slate-700/80 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            {review.collection}
          </span>
          <h4 className="mt-2 text-xs sm:text-sm font-black text-slate-100 tracking-tight">
            {review.brand}
          </h4>
        </div>
        <div className="flex gap-0.5 text-shop_orange shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current" />
          ))}
        </div>
      </div>

      <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium min-h-[68px]">
        "{review.text}"
      </p>

      {/* Frame Dimensions Sub-Tray */}
      <div className="mt-4 rounded-lg bg-slate-950/70 border border-white/[0.02] p-2.5">
        <p className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-500 tracking-tight">
          {review.spec}
        </p>
      </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-shop_orange font-black text-slate-950">
            {review.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-100">
                {review.name}
              </span>
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
            </div>

            <span className="text-xs text-slate-500">
              {review.city}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified Order
        </div>
      </div>

   <div className="mt-4 flex justify-end">
  <Quote className="h-5 w-5 text-shop_orange/50" />
</div>
    </article>
  );
}

