import {
  X,
  Home,
  BookOpen,
  User,
  ShoppingCart,
  Heart,
  Package,
  Phone,
  HelpCircle,
  Info,
  Grid3X3,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import { collectionNavigationData } from "@/constants";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Logo from "../common/Logo";
import SocialMedia from "../common/SocialMedia";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  // Enhanced menu sections with icons
  const userMenuItems = [
    { title: "My Account", href: "/user/profile", icon: User },
    { title: "My Orders", href: "/orders", icon: Package },
    { title: "Wishlist", href: "/wishlist", icon: Heart },
    { title: "Shopping Cart", href: "/cart", icon: ShoppingCart },
  ];

  const mainMenuItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "AI Try-On", href: "/ai-stylist", icon: Sparkles },
    { title: "Journal", href: "/blog", icon: BookOpen },
    { title: "About", href: "/about", icon: Info },
    { title: "Contact", href: "/contact", icon: Phone },
  ];

  const supportMenuItems = [
    { title: "Help Center", href: "/help", icon: HelpCircle },
    { title: "Customer Service", href: "/contact", icon: Phone },
  ];

  const isLinkActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");

    if (hrefQuery) {
      const hrefParams = new URLSearchParams(hrefQuery);

      return (
        pathname === hrefPath &&
        Array.from(hrefParams.entries()).every(
          ([key, value]) => searchParams.get(key) === value
        )
      );
    }

    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const isCollectionsActive =
    pathname === "/category" ||
    collectionNavigationData.some((item) => isLinkActive(item.href));

  return (
    <div
      className={`fixed inset-y-0 h-dvh left-0 z-50 w-full bg-primary/50 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out duration-300`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        ref={sidebarRef}
        className="w-[90%] max-w-[340px] md:max-w-[420px] bg-black z-50 h-dvh text-primary-foreground p-5 border-r border-r-shop_dark_green flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-shop_dark_green scrollbar-track-transparent"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-shop_dark_green">
          <Logo className="text-white" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition-brand hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>


    

        <ClerkLoaded>
  <SignedOut>
    <div className="space-y-3">
     <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
  <h3 className="text-white font-semibold text-base mb-1">
    👋 Welcome to VisionHub
  </h3>

  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
    Sign in to track orders, save your wishlist and unlock exclusive offers.
  </p>
</div>

      <div className="flex flex-col gap-3">
        <Link
          onClick={onClose}
          href="/sign-in"
          className="w-full text-center py-3 rounded-xl border border-shop_orange text-shop_orange font-semibold hover:bg-shop_orange hover:text-white transition-all"
        >
          Sign In
        </Link>

        <Link
          onClick={onClose}
          href="/sign-up"
          className="w-full text-center py-3 rounded-xl bg-shop_orange text-white font-semibold hover:opacity-90 transition-all"
        >
          Create Account
        </Link>
      </div>
    </div>
  </SignedOut>
</ClerkLoaded>

        <ClerkLoaded>
  <SignedIn>
    <div className="space-y-3">
          <h3 className="text-sm font-semibold text-shop_light_green uppercase tracking-wider">
            My Account
          </h3>
          <div className="flex flex-col gap-2">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-shop_light_green hover:bg-shop_dark_green/30 ${
                    pathname === item.href
                      ? "text-shop_light_green bg-shop_dark_green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
  </SignedIn>
</ClerkLoaded>

        {/* Main Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-shop_light_green uppercase tracking-wider">
            Navigation
          </h3>
          <div className="flex flex-col gap-2">
            {mainMenuItems.slice(0, 1).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-shop_light_green hover:bg-shop_dark_green/30 ${
                    isLinkActive(item.href)
                      ? "text-shop_light_green bg-shop_dark_green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}

            <div>
              <button
                type="button"
                onClick={() => setCollectionsOpen((open) => !open)}
                aria-expanded={collectionsOpen}
                className={`flex w-full items-center gap-3 rounded-md p-2 text-left text-sm font-medium tracking-wide transition-all duration-200 hover:bg-shop_dark_green/30 hover:text-shop_light_green ${
                  isCollectionsActive
                    ? "text-shop_light_green bg-shop_dark_green/50"
                    : "text-zinc-300"
                }`}
              >
                <Grid3X3 size={18} />
                <span className="flex-1">Collections</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    collectionsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  collectionsOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-2 flex flex-col gap-1 border-l border-zinc-700/70 pl-5">
                    {collectionNavigationData.map((item) => (
                      <Link
                        onClick={onClose}
                        key={item.title}
                        href={item.href}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-shop_dark_green/30 hover:text-shop_light_green ${
                          isLinkActive(item.href)
                            ? "text-shop_light_green"
                            : "text-zinc-400"
                        }`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {mainMenuItems.slice(1).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-shop_light_green hover:bg-shop_dark_green/30 ${
                    isLinkActive(item.href)
                      ? "text-shop_light_green bg-shop_dark_green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>


        {/* Support Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-shop_light_green uppercase tracking-wider">
            Support
          </h3>
          <div className="flex flex-col gap-2">
            {supportMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-shop_light_green hover:bg-shop_dark_green/30 ${
                    pathname === item.href
                      ? "text-shop_light_green bg-shop_dark_green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-shop_dark_green my-2"></div>

        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-shop_dark_green to-shop_btn_dark_green rounded-lg p-3 text-center">
          <h4 className="text-sm font-bold text-shop_light_green mb-1">
            Special Offer!
          </h4>
          <p className="text-xs text-zinc-300 mb-2">
            Get 20% off on your first order
          </p>
          <Link
            onClick={onClose}
            href="/deal"
            className="inline-block text-xs font-semibold text-white bg-shop_orange hover:bg-shop_light_orange px-3 py-1 rounded-full transition-colors duration-200"
          >
            Shop Now
          </Link>
        </div>

        {/* Social Media */}
        <div className="mt-2 pb-16">
          <h3 className="text-sm font-semibold text-shop_light_green uppercase tracking-wider mb-3">
            Follow Us
          </h3>
 <div className="overflow-hidden">
<SocialMedia
  iconClassName="border-zinc-600"
/>
</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
