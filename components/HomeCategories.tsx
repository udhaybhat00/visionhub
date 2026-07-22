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
    card: "min-h-[430px] bg-[#cddbd5] lg:row-span-2 lg:min-h-[570px]",
    image: "inset-x-0 top-4 bottom-28 p-7 sm:p-10",
    text: "text-[#111313]",
  },
  {
    card: "min-h-[300px] bg-[#171a19] lg:col-span-2 lg:min-h-0",
    image: "left-[38%] right-0 top-0 bottom-0 p-6 sm:p-8",
    text: "max-w-[48%] text-white",
  },
  {
    card: "min-h-[280px] bg-[#e5dfd2] lg:min-h-0",
    image: "inset-x-0 top-2 bottom-24 p-6",
    text: "text-[#111313]",
  },
  {
    card: "min-h-[280px] bg-[#dbe5e8] lg:min-h-0",
    image: "inset-x-0 top-2 bottom-24 p-6",
    text: "text-[#111313]",
  },
];

const HomeCategories = ({ categories }: Props) => {
  const collections = categories?.slice(0, 4) ?? [];

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f6f6f3] py-14 lg:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-[#9a7918]">
              The collection edit
            </p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Frames for the way you see the world.
            </h2>
          </div>
          <Link
            href="/category"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#111313] transition-colors hover:text-[#8b6c12]"
          >
            View all collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.18fr_0.82fr_0.82fr] lg:grid-rows-2">
          {collections.map((category, index) => {
            const style = collectionStyles[index] ?? collectionStyles[3];
            const href = category?.slug?.current
              ? `/category/${category.slug.current}`
              : "/category";

            return (
              <Link
                key={category?._id}
                href={href}
                className={`group relative overflow-hidden rounded-md ${style.card}`}
              >
                <div className={`absolute ${style.image}`}>
                  {category?.image ? (
                    <Image
                      src={urlFor(category.image)
                        .width(index === 0 ? 900 : 680)
                        .height(index === 0 ? 900 : 520)
                        .fit("max")
                        .url()}
                      alt={`${category?.title || "Eyewear"} collection`}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 1024px) 100vw, 42vw"
                          : "(max-width: 640px) 100vw, 30vw"
                      }
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <Glasses className="m-auto h-full w-20 text-current/20" />
                  )}
                </div>

                <div
                  className={`absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 ${style.text}`}
                >
                  <p className="text-[11px] font-bold uppercase opacity-60">
                    Collection {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-black sm:text-2xl">
                        {category?.title || "Curated eyewear"}
                      </h3>
                      {category?.description && index === 0 && (
                        <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-6 opacity-65">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/30 transition-transform group-hover:translate-x-1">
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
