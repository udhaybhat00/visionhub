import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { UserDataProvider } from "@/contexts/UserDataContext";
import "./globals.css";
import Script from "next/script";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const poppins = localFont({
  src: "./fonts/Poppins.woff2",
  variable: "--font-poppins",
  weight: "400",
  preload: false,
});
const raleway = localFont({
  src: "./fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
});

const opensans = localFont({
  src: "./fonts/Open Sans.woff2",
  variable: "--font-open-sans",
  weight: "100 800",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://visionhub.vercel.app"),
  title: {
    template: "%s | VisionHub - Premium Eyewear",
default: "VisionHub - Premium Eyewear & Sunglasses Store",
  },
  description:
    "Discover premium sunglasses, eyeglasses, contact lenses and eyewear accessories at VisionHub. Stylish frames, UV protection, prescription glasses and fast delivery across India.",
  keywords: [
  "eyewear",
  "sunglasses",
  "eyeglasses",
  "power glasses",
  "prescription glasses",
  "computer glasses",
  "contact lenses",
  "UV protection",
  "VisionHub",
  "eyewear india",
  "premium eyewear",
],
  authors: [{ name: "VisionHub" }],
  creator: "VisionHub",
  publisher: "VisionHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://visionhub.vercel.app",
    siteName: "VisionHub",
    title: "VisionHub - Premium Eyewear & Sunglasses Store",
    description:
      "Discover premium sunglasses, eyeglasses, prescription eyewear, contact lenses, and accessories at VisionHub. Stylish designs, UV protection, and quality vision solutions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VisionHub Eyewear Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisionHub - Premium Eyewear & Sunglasses Store",
    description:
      "Discover premium sunglasses, eyeglasses, prescription eyewear, contact lenses, and accessories at VisionHub. Stylish designs, UV protection, and quality vision solutions.",
    images: ["/og-image.jpg"],
    creator: "@VisionHub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
  alternates: {
canonical: "https://visionhub.vercel.app"  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${poppins.variable} ${raleway.variable} ${opensans.variable} antialiased`}
        >
          <UserDataProvider>
  <main className="pb-20 md:pb-0">
    {children}
  </main>

  <MobileBottomNav />
</UserDataProvider>
    <Toaster
  position="bottom-right"
  richColors
  closeButton
  mobileOffset={90}
  toastOptions={{
    style: {
      background: "#ffffff",
      color: "#1f2937",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      fontSize: "14px",
    },
    className: "sonner-toast",
  }}
/>

          <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
