import Container from "./Container";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import dayjs from "dayjs";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import Link from "next/link";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();
  const featuredBlog = blogs?.[0];
  const supportingBlogs = blogs?.slice(1, 4) ?? [];

  if (!featuredBlog) {
    return null;
  }

  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-[#9a7918]">
              The optical journal
            </p>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Perspective beyond the frame.
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#111313] transition-colors hover:text-[#8b6c12]"
          >
            Read all stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 border-t border-black/10 pt-8 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="group">
            <Link
              href={`/blog/${featuredBlog.slug?.current}`}
              className="block"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-[#e7ece9]">
                {featuredBlog.mainImage ? (
                  <Image
                    src={urlFor(featuredBlog.mainImage)
                      .width(1200)
                      .height(675)
                      .fit("crop")
                      .url()}
                    alt={featuredBlog.title || "VisionHub journal story"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                ) : (
                  <BookOpen className="absolute inset-0 m-auto h-16 w-16 text-black/15" />
                )}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-black/45">
                {featuredBlog.blogcategories?.slice(0, 1).map((item, index) => (
                  <span
                    key={index}
                    className="uppercase text-[#8b6c12]"
                  >
                    {item?.title}
                  </span>
                ))}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {dayjs(featuredBlog.publishedAt).format("MMM D, YYYY")}
                </span>
              </div>
              <h3 className="font-display mt-3 max-w-3xl text-2xl font-black leading-tight text-[#111313] transition-colors group-hover:text-[#8b6c12] sm:text-3xl">
                {featuredBlog.title}
              </h3>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#111313]">
                Read story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </article>

          <div className="divide-y divide-black/10 border-y border-black/10 lg:border-t-0">
            {supportingBlogs.length > 0 ? (
              supportingBlogs.map((blog) => (
                <article key={blog._id} className="group py-5 first:pt-0">
                  <Link
                    href={`/blog/${blog.slug?.current}`}
                    className="grid grid-cols-[112px_1fr] gap-4"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md bg-[#e7ece9]">
                      {blog.mainImage ? (
                        <Image
                          src={urlFor(blog.mainImage)
                            .width(360)
                            .height(360)
                            .fit("crop")
                            .url()}
                          alt={blog.title || "VisionHub journal story"}
                          fill
                          sizes="112px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <BookOpen className="absolute inset-0 m-auto h-8 w-8 text-black/15" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase text-[#8b6c12]">
                        {blog.blogcategories?.[0]?.title || "Eyewear journal"}
                      </p>
                      <h3 className="font-display mt-2 line-clamp-3 text-base font-black leading-snug text-[#111313] transition-colors group-hover:text-[#8b6c12]">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-xs text-black/42">
                        {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="py-8 text-sm leading-6 text-black/50">
                More optical stories are being prepared for the journal.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LatestBlog;
