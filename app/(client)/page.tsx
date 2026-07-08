import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
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
      <div className="pb-10">
        <HomeCategories categories={categories} />
        <AiStylistCTA />
        <ProductGrid />
        <ShopByBrands />
        <HomeReviews />
        <LatestBlog />
      </div>
    </div>
  );
}
