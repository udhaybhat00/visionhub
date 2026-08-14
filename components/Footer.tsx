import Link from "next/link";
import Logo from "./common/Logo";
import { contactConfig } from "@/config/contact";
import FooterTop from "./layout/FooterTop";
import FooterColumns from "./layout/FooterColumns";
import SocialMedia from "./common/SocialMedia";
import NewsletterForm from "./NewsletterForm";

const Footer = () => {
  return (
    <footer className="border-t border-ink/8 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FooterTop />

        <div className="grid grid-cols-1 pt-16 pb-12 gap-8 text-center md:grid-cols-2 md:text-left lg:grid-cols-5">
          <div className="space-y-4">
            <div className="mb-2 flex justify-center md:justify-start">
              <Logo variant="sm" />
            </div>
            <p className="text-ink-soft text-sm leading-6">
              {contactConfig.company.description}
            </p>
            <SocialMedia
              className="justify-center text-ink-soft md:justify-start"
              iconClassName="border-ink/20 hover:border-amber-brand hover:text-amber-brand"
              tooltipClassName="bg-ink text-bone"
            />
          </div>

          <FooterColumns />

          <div>
            <h3 className="font-display text-[15px] font-bold text-ink mb-4">
              Newsletter
            </h3>
            <p className="text-ink-soft text-sm mb-4 leading-6">
              Get exclusive product launches, discounts, style guides, and
              VisionHub updates delivered directly to your inbox.
            </p>
            <div className="w-full">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-ink/8 text-center text-sm text-ink-mute">
          <p>{contactConfig.legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
