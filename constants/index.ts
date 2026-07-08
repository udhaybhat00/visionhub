type NavigationItem = {
  title: string;
  href: string;
};

type HeaderNavigationItem = NavigationItem & {
  children?: NavigationItem[];
};

export const collectionNavigationData: NavigationItem[] = [
  { title: "Sunglasses", href: "/shop?type=sunglasses" },
  { title: "Computer Glasses", href: "/shop?type=computer-glasses" },
  { title: "Prescription", href: "/shop?type=prescription" },
  { title: "Premium", href: "/shop?type=premium" },
  { title: "Sports", href: "/shop?type=sports" },
  { title: "Accessories", href: "/category/accessories" },
];

export const headerData: HeaderNavigationItem[] = [
  { title: "Home", href: "/" },
  {
    title: "Collections",
    href: "/category",
    children: collectionNavigationData,
  },
  { title: "Journal", href: "/blog" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export const productType = [
  { title: "Sunglasses", value: "sunglasses" },
  { title: "Computer Glasses", value: "computer-glasses" },
  { title: "Prescription", value: "prescription" },
  { title: "Premium", value: "premium" },
  { title: "Sports", value: "sports" },
];

export const quickLinksData = [
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms & Conditions", href: "/terms" },
  { title: "FAQs", href: "/faqs" },
  { title: "Help", href: "/help" },
];

export const categoriesData = [
  { title: "Sunglasses", href: "sunglasses" },
  { title: "Computer Glasses", href: "computer-glasses" },
  { title: "Blue Light Glasses", href: "blue-light-glasses" },
  { title: "Prescription Glasses", href: "prescription-glasses" },
  { title: "Sports Eyewear", href: "sports-eyewear" },
  { title: "Accessories", href: "accessories" },
];

export const visionHubCollectionsData = [
  { title: "VisionHub", href: "/brands/visionhub" },
  { title: "VisionHub Luxe", href: "/brands/visionhub-luxe" },
  { title: "VisionHub Air", href: "/brands/visionhub-air" },
  { title: "VisionHub Blue", href: "/brands/visionhub-blue" },
  { title: "VisionHub Active", href: "/brands/visionhub-active" },
];

// Enhanced user account menu items
export const userAccountData = [
  { title: "My Profile", href: "/account/profile" },
  { title: "My Orders", href: "/user/orders" },
  { title: "My Wishlist", href: "/wishlist" },
  { title: "Shopping Cart", href: "/cart" },
  { title: "Address Book", href: "/account/addresses" },
  { title: "Payment Methods", href: "/account/payments" },
  { title: "Order History", href: "/user/orders" },
];

// Support and help menu items
export const supportData = [
  { title: "Help Center", href: "/help" },
  { title: "Customer Service", href: "/support" },
  { title: "Track Your Order", href: "/track-order" },
  { title: "Shipping Info", href: "/shipping" },
  { title: "Care Guide", href: "/help" },
  { title: "Size Guide", href: "/size-guide" },
];
export const faqsData = [
{
question: "How can I place an order?",
answer:
"Browse our collection, select your preferred eyewear product, add it to your cart, and complete the checkout process using our secure payment system.",
},
{
question: "Do you sell authentic products?",
answer:
"Yes. VisionHub is committed to providing quality eyewear products sourced from trusted suppliers and brands.",
},
{
question: "Do you offer prescription eyewear?",
answer:
"Selected products support prescription lenses. Please check the product details page for availability and specifications.",
},
{
question: "How can I track my order?",
answer:
"Once your order is shipped, tracking details will be provided through email or other available communication channels.",
},
{
question: "What payment methods do you accept?",
answer:
"We accept secure online payments through supported payment gateways, including major cards, UPI, and other available payment options.",
},
{
question: "What if my product arrives damaged?",
answer:
"Contact our support team with order details and clear photos of the package and product so we can review the issue quickly.",
},
{
question: "How long does shipping take?",
answer:
"Delivery times vary depending on your location and product availability. Estimated delivery information is provided during checkout whenever possible.",
},
{
question: "Is my personal information secure?",
answer:
"Yes. We use industry-standard security practices to protect customer information and ensure secure transactions.",
},
{
question: "How can I contact customer support?",
answer:
"You can reach our support team through the Contact Us page, email, or available communication channels during business hours.",
},
];
