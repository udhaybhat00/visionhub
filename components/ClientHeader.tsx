"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ClerkLoaded, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Container from "./Container";
import HeaderMenu from "./layout/HeaderMenu";
import Logo from "./common/Logo";
import CartIcon from "./cart/CartIcon";
import MobileMenu from "./layout/MobileMenu";
import SearchBar from "./common/SearchBar";
import FavoriteButton from "./FavoriteButton";
import NotificationBell from "./NotificationBell";
import UserDropdown from "./UserDropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "lucide-react";

const ClientHeader = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  // Track when component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle redirect after successful login
  useEffect(() => {
    if (isSignedIn && user && isMounted && typeof window !== "undefined") {
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo) {
        // Clean up the URL and redirect
        const cleanUrl = decodeURIComponent(redirectTo);
        router.push(cleanUrl);
        // Remove the redirectTo param from current URL
        const currentPath = window.location.pathname;
        router.replace(currentPath);
      }
    }
  }, [isSignedIn, user, searchParams, router, isMounted]);

  const getSignInUrl = () => {
    if (!isMounted || typeof window === "undefined") return "/sign-in";
    const currentPath = window.location.pathname + window.location.search;
    return `/sign-in?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  const getSignUpUrl = () => {
    if (!isMounted || typeof window === "undefined") return "/sign-up";
    const currentPath = window.location.pathname + window.location.search;
    return `/sign-up?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 shadow-[0_8px_30px_rgba(15,15,15,0.04)] backdrop-blur-xl">
      <Container className="h-full xl:max-w-[1480px] xl:px-6">
        <div className="flex h-16 items-center sm:h-[4.5rem] xl:h-20">
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <MobileMenu />
            <Logo />
          </div>

          <div className="hidden flex-1 items-center justify-center px-6 xl:flex 2xl:px-10">
            <HeaderMenu />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 2xl:gap-4">
            <div className="flex items-center md:hidden">
              <ClerkLoaded>
                <SignedIn>
                  <UserDropdown />
                </SignedIn>

                <SignedOut>
                  <Link
                    href={getSignInUrl()}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-shop_dark_green transition-all hover:border-shop_orange hover:bg-shop_light_bg min-[430px]:h-10 min-[430px]:w-10"
                  >
                    <User className="h-4 w-4 min-[430px]:h-5 min-[430px]:w-5" />
                  </Link>
                </SignedOut>
              </ClerkLoaded>
            </div>

            <div className="flex-shrink-0 md:flex">
              <SearchBar />
            </div>

            <div className="hidden items-center gap-2 xl:flex 2xl:gap-3">
              <CartIcon />
              <FavoriteButton variant="header" />

              <ClerkLoaded>
                <SignedIn>
                  <UserDropdown />
                </SignedIn>

                <SignedOut>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Link
                      href={getSignInUrl()}
                      className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-shop_orange hover:bg-shop_light_bg hover:text-shop_dark_green"
                    >
                      Sign In
                    </Link>
                    <Link
                      href={getSignUpUrl()}
                      className="rounded-full bg-shop_dark_green px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-shop_orange hover:shadow-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                </SignedOut>
              </ClerkLoaded>
            </div>

            <div className="hidden items-center gap-2 md:flex xl:hidden">
              <CartIcon />
              <FavoriteButton variant="header" />

              <ClerkLoaded>
                <SignedIn>
                  <UserDropdown />
                </SignedIn>
                <SignedOut>
                  <div className="hidden min-[820px]:flex items-center gap-2">
                    <Link
                      href={getSignInUrl()}
                      className="px-2 py-1 text-sm font-semibold transition-colors duration-200 hover:text-shop_light_green"
                    >
                      Sign In
                    </Link>
                    <Link
                      href={getSignUpUrl()}
                      className="rounded-full bg-shop_dark_green px-3 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-shop_orange"
                    >
                      Sign Up
                    </Link>
                  </div>
                </SignedOut>
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default ClientHeader;
