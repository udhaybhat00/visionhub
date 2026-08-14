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
    <section className="bg-cream py-14 lg:py-24">
      <Container>
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-brand">
              The optical journal
            </p>
            <h2 className="font-display mt-3 text-3xl font-black leading-[1.08] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">
              Perspective beyond the frame.
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-extrabold text-ink transition-brand hover:text-amber-brand-deep"
          >
            <span className="link-underline">Read all stories</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 border-t border-ink/10 pt-8 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="group transition-brand hover:-translate-y-1">
            <Link
              href={`/blog/${featuredBlog.slug?.current}`}
              className="block"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-cream-deep shadow-[0_2px_8px_rgba(34,27,18,0.04)] transition-shadow duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:shadow-[0_24px_48px_-20px_rgba(34,27,18,0.25)]">
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
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <BookOpen className="absolute inset-0 m-auto h-16 w-16 text-ink/15" />
                )}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-ink-mute">
                {featuredBlog.blogcategories?.slice(0, 1).map((item, index) => (
                  <span key={index} className="uppercase text-amber-brand-deep">
                    {item?.title}
                  </span>
                ))}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {dayjs(featuredBlog.publishedAt).format("MMM D, YYYY")}
                </span>
              </div>
              <h3 className="font-display mt-3 max-w-3xl text-3xl font-black leading-[1.1] tracking-[-0.01em] text-ink transition-brand group-hover:text-amber-brand-deep sm:text-4xl">
                {featuredBlog.title}
              </h3>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-ink">
                <span className="link-underline">Read story</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
              </span>
            </Link>
          </article>

          <div className="divide-y divide-ink/10 border-y border-ink/10 lg:border-t-0">
            {supportingBlogs.length > 0 ? (
              supportingBlogs.map((blog) => (
                <article key={blog._id} className="group rounded-xl py-5 first:pt-0 transition-brand hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(34,27,18,0.2)]">
                  <Link
                    href={`/blog/${blog.slug?.current}`}
                    className="grid grid-cols-[112px_1fr] gap-4"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-deep">
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
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.06]"
                        />
                      ) : (
                        <BookOpen className="absolute inset-0 m-auto h-8 w-8 text-ink/15" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-brand-deep">
                        {blog.blogcategories?.[0]?.title || "Eyewear journal"}
                      </p>
                      <h3 className="font-display mt-2 line-clamp-3 text-base font-black leading-snug text-ink transition-brand group-hover:text-amber-brand-deep">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-xs text-ink-mute">
                        {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="py-8 text-sm leading-6 text-ink-mute">
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
