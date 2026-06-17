// Contact configuration using environment variables

export const contactConfig = {
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "VisionHub",
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "shivam@gmail.com",
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+91 123456789",
    address:
      process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
      "VisionHub Eyewear",
    city: process.env.NEXT_PUBLIC_COMPANY_CITY || "123 Shopping Street, Jammu, India",
    description:
      process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION ||
      "Your destination for premium eyewear, stylish sunglasses, prescription glasses, contact lenses, and accessories. We combine quality, comfort, and modern design to help you see and look your best every day.",
  },
  businessHours: {
    weekday:
      process.env.NEXT_PUBLIC_COMPANY_BUSINESS_HOURS_WEEKDAY ||
      "Monday - Friday: 9AM - 6PM IST",
    weekend:
      process.env.NEXT_PUBLIC_COMPANY_BUSINESS_HOURS_WEEKEND ||
      "Saturday - Sunday: 10AM - 4PM IST",
  },
  emails: {
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "shivam@gmail.com",
    sales: process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@VisionHub.com",
  },
  responseTime: {
    standard:
      process.env.NEXT_PUBLIC_CONTACT_RESPONSE_TIME ||
      "We reply within 24 hours",
    quick:
      process.env.NEXT_PUBLIC_QUICK_RESPONSE_TIME ||
      "2-4 hours during business hours",
  },
  socialMedia: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "#",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
  },
  legal: {
    copyright:
      process.env.NEXT_PUBLIC_COPYRIGHT_TEXT ||
      "© 2024 VisionHub. All rights reserved.",
    privacyPolicy: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "/privacy",
    terms: process.env.NEXT_PUBLIC_TERMS_URL || "/terms",
  },
  support: {
    helpCenter: "/help",
    faq: "/faqs",
    trackOrder: "/track-order",
    returns: "/returns",
    shipping: "/shipping",
    sizeGuide: "/size-guide",
  },
};

// Contact information for different sections
export const contactInfo = [
  {
    icon: "MapPin",
    title: "Visit Our Store",
    details: contactConfig.company.address,
    subDetails: contactConfig.company.city,
    color: "text-shop_dark_green",
    bgColor: "bg-shop_dark_green/10",
    href: `https://maps.google.com/?q=${encodeURIComponent(`${contactConfig.company.address}, ${contactConfig.company.city}`)}`,
  },
  {
    icon: "Phone",
    title: "Call Us",
    details: contactConfig.company.phone,
    subDetails: contactConfig.businessHours.weekday,
    color: "text-shop_light_green",
    bgColor: "bg-shop_light_green/10",
    href: `tel:${contactConfig.company.phone.replace(/\D/g, "")}`,
  },
  {
    icon: "Mail",
    title: "Email Support",
    details: contactConfig.emails.support,
    subDetails: contactConfig.responseTime.standard,
    color: "text-shop_orange",
    bgColor: "bg-shop_orange/10",
    href: `mailto:${contactConfig.emails.support}`,
  },
  {
    icon: "Clock",
    title: "Business Hours",
    details: contactConfig.businessHours.weekday,
    subDetails: contactConfig.businessHours.weekend,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    href: null,
  },
];
