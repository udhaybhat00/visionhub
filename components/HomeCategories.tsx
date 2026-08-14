import { Category } from "@/sanity.types";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight, Glasses } from "lucide-react";

interface Props {
  categories: Category[];
}

const collectionStyles = [
  {
    card: "min-h-[430px] bg-[#dde6df] lg:row-span-2 lg:min-h-[570px]",
    image: "inset-x-0 top-4 bottom-28",
    scrim: "bg-gradient-to-t from-[#dde6df]/95 via-[#dde6df]/40 to-transparent",
    text: "text-ink",
  },
  {
    card: "min-h-[300px] bg-ink lg:row-span-2 lg:min-h-0",
    image: "inset-x-0 top-2 bottom-24",
    scrim: "bg-gradient-to-t from-black/75 via-black/30 to-transparent",
    text: "text-bone",
  },
  {
    card: "min-h-[280px] bg-[#ecdfc6] lg:min-h-0",
    image: "inset-x-0 top-2 bottom-24",
    scrim: "bg-gradient-to-t from-[#ecdfc6]/95 via-[#ecdfc6]/40 to-transparent",
    text: "text-ink",
  },
  {
    card: "min-h-[280px] bg-[#e4e6da] lg:min-h-0",
    image: "inset-x-0 top-2 bottom-24",
    scrim: "bg-gradient-to-t from-[#e4e6da]/95 via-[#e4e6da]/40 to-transparent",
    text: "text-ink",
  },
];

const HomeCategories = ({ categories }: Props) => {
  const collections = categories?.slice(0, 4) ?? [];

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="bg-cream-deep py-14 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-brand">
              The collection edit
            </p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-black leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">
              Frames for the way you see the world.
            </h2>
          </div>
          <Link
            href="/category"
            className="group inline-flex items-center gap-2 text-sm font-extrabold text-ink transition-brand hover:text-amber-brand-deep"
          >
            <span className="link-underline">View all collections</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.18fr_0.82fr_0.82fr] lg:grid-rows-2">
          {collections.map((category, index) => {
            const style = collectionStyles[index] ?? collectionStyles[3];
            const href = category?.slug?.current
              ? `/category/${category.slug.current}`
              : "/category";
            const imageBuilder = category?.image
              ? urlFor(category.image).width(
                  index === 1 ? 680 : index === 0 ? 900 : 680
                )
              : null;
            const imageUrl = imageBuilder
              ? index === 1
                ? imageBuilder.fit("max").url()
                : imageBuilder
                    .height(index === 0 ? 900 : 520)
                    .fit("crop")
                    .url()
              : null;

            return (
              <Link
                key={category?._id}
                href={href}
                className={`group relative isolate overflow-hidden rounded-lg transition-brand hover:-translate-y-1 hover:shadow-[0_28px_56px_-20px_rgba(34,27,18,0.3)] ${style.card}`}
              >
                <div
                  className={`absolute inset-0 z-0 ${
                    index === 1
                      ? "flex items-center justify-center bg-ink p-8"
                      : ""
                  } ${style.image}`}
                >
                  {category?.image ? (
                    index === 1 ? (
                      <Image
                        src={imageUrl || ""}
                        alt={`${category?.title || "Eyewear"} collection`}
                        width={680}
                        height={680}
                        sizes="(max-width: 639px) 100vw, (max-width: 1024px) 50vw, 30vw"
                        className="max-h-full max-w-full object-contain object-center transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.05]"
                      />
                    ) : (
                      <Image
                        src={imageUrl || ""}
                        alt={`${category?.title || "Eyewear"} collection`}
                        fill
                        sizes={
                          index === 0
                            ? "(max-width: 639px) 100vw, (max-width: 1024px) 50vw, 42vw"
                            : "(max-width: 639px) 100vw, (max-width: 1024px) 50vw, 30vw"
                        }
                        className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.05]"
                      />
                    )
                  ) : (
                    <Glasses className="m-auto h-full w-20 text-current/20" />
                  )}
                </div>

                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 ${style.scrim}`}
                />

                <div
                  className={`absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 ${style.text}`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-60">
                    Collection {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-black tracking-[-0.01em] sm:text-3xl">
                        {category?.title || "Curated eyewear"}
                      </h3>
                      {category?.description && index === 0 && (
                        <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-6 opacity-65">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/25 text-current ring-1 ring-current/40 backdrop-blur-md transition-brand group-hover:translate-x-1 group-hover:bg-amber-brand group-hover:text-bone group-hover:ring-amber-brand">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default HomeCategories;
