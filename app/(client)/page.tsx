import AnimatedSection from "@/components/AnimatedSection";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import HomeBanner from "@/components/HomeBanner";
import HomeProductShowcase from "@/components/HomeProductShowcase";
import ShopByBrands from "@/components/ShopByBrands";
import AiStylistCTA from "@/components/AiStylistCTA";
import { getCategories, getAllProducts, getBanner } from "@/sanity/queries";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import HomeReviews from "@/components/HomeReviews";


export default async function Home() {
  const categories = await getCategories(8);
  const products = await getAllProducts();
  const banners = await getBanner();

  const totalReviews = products.reduce(
    (sum, p) => sum + (p.totalReviews || 0),
    0
  );
  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + (p.averageRating || 0), 0) /
        products.length
      : 0;

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <div>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <HomeBanner
        products={products}
        banners={banners}
        totalReviews={totalReviews}
        averageRating={avgRating}
      />
      <div>
        <AnimatedSection delay={0.1}>
          <HomeCategories categories={categories} />
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <HomeProductShowcase />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <AiStylistCTA />
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <ShopByBrands />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <HomeReviews />
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <LatestBlog />
        </AnimatedSection>
      </div>
    </div>
  );
}
