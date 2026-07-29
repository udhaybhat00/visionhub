import Container from "@/components/Container";
import AnimatedSection from "@/components/AnimatedSection";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import NewsletterForm from "@/components/NewsletterForm";
import { GET_ALL_BLOGResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const extractDescription = (
  body: GET_ALL_BLOGResult[0]["body"],
  maxLength = 150
) => {
  if (!body || !Array.isArray(body))
    return "Discover insights and stories that matter.";
  let description = "";
  for (const block of body) {
    if (block._type === "block" && block.children) {
      for (const child of block.children) {
        if (child.text && child._type === "span") {
          description += child.text + " ";
          if (description.length > maxLength) {
            return description.substring(0, maxLength).trim() + "...";
          }
        }
      }
    }
  }
  return (
    description.trim() ||
    "Read our latest insights and discover new perspectives."
  );
};

const BlogPage = async () => {
  const blogs = await getAllBlogs(12);

  return (
    <div className="bg-[#f6f6f3] min-h-screen">
      <AnimatedSection>
        <section className="relative overflow-hidden bg-[#101313] py-16 lg:py-24">
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white" />
            <div className="absolute -right-32 -top-10 h-96 w-96 rounded-full border border-white" />
            <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full border border-white" />
          </div>
          <Container>
            <div className="relative">
              <DynamicBreadcrumb />
            </div>
            <div className="relative mt-6 text-center">
              <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#d5b34b]">
                <span className="h-px w-8 bg-[#d5b34b]" />
                The optical journal
                <span className="h-px w-8 bg-[#d5b34b]" />
              </span>
              <h1 className="font-display mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                VisionHub Journal
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                Expert insights on eyewear, eye care, vision solutions, and the
                latest trends. Guides, reviews, and tips for choosing the perfect
                frames.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 sm:mx-auto sm:max-w-sm">
                <div className="rounded-md border border-white/10 bg-black/20 p-3 text-center backdrop-blur-sm">
                  <p className="font-display text-xl font-black text-white sm:text-2xl">
                    {blogs?.length || 0}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Articles
                  </p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/20 p-3 text-center backdrop-blur-sm">
                  <p className="font-display text-xl font-black text-white sm:text-2xl">
                    1K+
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Readers
                  </p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/20 p-3 text-center backdrop-blur-sm">
                  <p className="font-display text-xl font-black text-white sm:text-2xl">
                    20+
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Guides
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </AnimatedSection>

      <Container className="py-12 lg:py-16">
        <AnimatedSection delay={0.1}>
          <div className="mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
              Latest
            </span>
            <h2 className="font-display mt-2 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Recent stories.
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/55">
              Expert advice, buying guides, and eye care tips from the VisionHub
              team.
            </p>
          </div>
        </AnimatedSection>

        {blogs && blogs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog, index) => (
              <AnimatedSection
                key={blog?._id}
                delay={0.05 * Math.min(index, 8)}
              >
                <article
                  className={`group flex min-w-0 flex-col rounded-md border border-black/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                  }`}
                >
                  {blog?.mainImage && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#e7ece9] sm:aspect-[4/3]">
                      <Image
                        src={urlFor(blog.mainImage).url()}
                        alt={blog?.title || "Blog image"}
                        fill
                        sizes={
                          index === 0
                            ? "(max-width: 640px) 100vw, 50vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        }
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      <Link
                        href={`/blog/${blog?.slug?.current}`}
                        className="absolute inset-0"
                      />
                      {blog?.blogcategories && blog.blogcategories.length > 0 && (
                        <span className="absolute left-3 top-3 rounded-sm bg-[#111313] px-2.5 py-1 text-[10px] font-extrabold uppercase text-white">
                          {blog.blogcategories[0]?.title}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase text-black/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dayjs(blog.publishedAt).format("MMM D, YYYY")}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${blog?.slug?.current}`}
                      className="mt-2 block"
                    >
                      <h3
                        className={`font-display font-black leading-tight text-[#111313] transition-colors group-hover:text-[#8b6c12] ${
                          index === 0
                            ? "text-xl sm:text-2xl"
                            : "text-base sm:text-lg"
                        }`}
                      >
                        {blog?.title}
                      </h3>
                    </Link>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/50">
                      {extractDescription(blog?.body || [])}
                    </p>

                    <div className="mt-auto pt-4">
                      <Link
                        href={`/blog/${blog?.slug?.current}`}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#111313] transition-colors hover:text-[#8b6c12]"
                      >
                        Read story
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection delay={0.1}>
            <div className="rounded-md border border-black/10 bg-white p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-black/15" />
              <h3 className="font-display mt-4 text-xl font-black text-[#111313]">
                No blog posts yet
              </h3>
              <p className="mt-2 text-sm leading-6 text-black/55">
                We&apos;re working on some amazing content. Check back soon!
              </p>
              <Link
                href="/"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#111313] transition-colors hover:text-[#8b6c12]"
              >
                Back to home
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        )}
      </Container>

      <AnimatedSection delay={0.15}>
        <Container className="pb-12 lg:pb-16">
          <div className="rounded-md border border-black/10 bg-[#101313] p-8 text-center sm:p-12">
            <BookOpen className="mx-auto h-8 w-8 text-[#d5b34b]" />
            <h2 className="font-display mt-4 text-2xl font-black text-white sm:text-3xl">
              Stay in the loop.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/55">
              Get eyewear trends, eye care guides, and exclusive offers
              delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </Container>
      </AnimatedSection>
    </div>
  );
};

export default BlogPage;
