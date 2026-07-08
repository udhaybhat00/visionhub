import Link from "next/link";
import Logo from "./common/Logo";
import {
  categoriesData,
  quickLinksData,
  visionHubCollectionsData,
} from "@/constants";
import { contactConfig } from "@/config/contact";
import FooterTop from "./layout/FooterTop";
import SocialMedia from "./common/SocialMedia";
import NewsletterForm from "./NewsletterForm";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FooterTop />

        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="mb-2 flex justify-center md:justify-start">
              <Logo variant="sm" />
            </div>
            <p className="text-gray-600 text-sm leading-6">
              {contactConfig.company.description}
            </p>
            <SocialMedia
              className="justify-center text-dark-color/60 md:justify-start"
              iconClassName="border-dark-color/60 hover:border-shop_dark_green hover:text-shop_dark_green"
              tooltipClassName="bg-dark-color text-white"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-gray-600 hover:text-shop_dark_green text-sm font-medium hoverEffect"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-3">
              {categoriesData.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-gray-600 hover:text-shop_dark_green text-sm font-medium hoverEffect"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              VisionHub Collections
            </h3>
            <ul className="space-y-3">
              {visionHubCollectionsData.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-shop_dark_green text-sm font-medium hoverEffect"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-4 leading-6">
              Get exclusive product launches, discounts, style guides, and
              VisionHub updates delivered directly to your inbox.
            </p>
            <div className="w-full">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="py-6 border-t text-center text-sm text-gray-600">
          <p>{contactConfig.legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
