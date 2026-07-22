import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import HomeBanner from "@/components/HomeBanner";
import HomeProductShowcase from "@/components/HomeProductShowcase";
import ShopByBrands from "@/components/ShopByBrands";
import AiStylistCTA from "@/components/AiStylistCTA";
import { getCategories } from "@/sanity/queries";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import HomeReviews from "@/components/HomeReviews";


export default async function Home() {
  const categories = await getCategories(8);

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

      <HomeBanner />
      <div>
        <HomeCategories categories={categories} />
        <HomeProductShowcase />
        <AiStylistCTA />
        <ShopByBrands />
        <HomeReviews />
        <LatestBlog />
      </div>
    </div>
  );
}
