import { BadgeCheck, Quote, Ruler, ShieldCheck, Star, Truck } from "lucide-react";
import Container from "./Container";

const reviews = [
  {
    name: "Aditi Sharma",
    city: "Delhi",
    collection: "Screen eyewear",
    spec: "Medium / 49-18-140",
    text: "The frame stays light through long office hours, and the measurements made choosing the right size online straightforward.",
  },
  {
    name: "Rohan Mehta",
    city: "Bengaluru",
    collection: "Polarised sunglasses",
    spec: "Large / 54-16-145",
    text: "The lenses feel crisp while driving, the frame sits securely, and the protective packaging arrived in excellent condition.",
  },
  {
    name: "Nisha Iyer",
    city: "Chennai",
    collection: "Acetate optical",
    spec: "Petite / 47-19-135",
    text: "The finish feels considered and the hinges are solid. Most importantly, the dimensions shown online matched the frame I received.",
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

          <div className="grid gap-3 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="flex min-h-[300px] flex-col rounded-md border border-black/10 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-extrabold uppercase text-[#8b6c12]">
                    {review.collection}
                  </span>
                  <Quote className="h-5 w-5 text-black/18" />
                </div>
                <p className="mt-6 text-sm leading-7 text-[#252827]">
                  “{review.text}”
                </p>
                <div className="mt-auto border-t border-black/10 pt-5">
                  <p className="text-xs font-bold text-black/45">
                    {review.spec}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-display font-black text-[#111313]">
                      {review.name}
                    </span>
                    <BadgeCheck className="h-4 w-4 text-[#315d55]" />
                  </div>
                  <p className="mt-1 text-xs text-black/45">{review.city}</p>
                </div>
              </article>
            ))}
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
