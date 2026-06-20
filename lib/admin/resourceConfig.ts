import {
  Archive,
  Bell,
  BookOpen,
  Building2,
  Contact,
  ImageIcon,
  Mail,
  Package,
  Percent,
  Star,
  Tag,
  Users,
} from "lucide-react";

export type AdminFieldType =
  | "string"
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "select"
  | "reference"
  | "referenceArray"
  | "image"
  | "imageArray"
  | "stringArray"
  | "portableText";

export type AdminOption = {
  label: string;
  value: string;
};

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  description?: string;
  options?: AdminOption[];
  referenceTo?: string;
  placeholder?: string;
};

export type AdminColumn = {
  key: string;
  label: string;
  type?: "text" | "currency" | "number" | "date" | "badge" | "image";
  path?: string;
};

export type AdminFilter = {
  key: string;
  label: string;
  field: string;
  options?: AdminOption[];
  referenceTo?: string;
};

export type AdminQuickAction =
  | {
      key: string;
      label: string;
      type: "patch";
      patch: Record<string, unknown>;
      tone?: "default" | "destructive" | "outline";
    }
  | {
      key: string;
      label: string;
      type: "delete";
      tone?: "destructive";
    }
  | {
      key: string;
      label: string;
      type: "invoice" | "email" | "external";
      href?: string;
      tone?: "default" | "outline";
    };

export type AdminResourceConfig = {
  key: string;
  title: string;
  singularTitle: string;
  description: string;
  documentType: string;
  icon: typeof Package;
  listOrder: string;
  searchFields: string[];
  columns: AdminColumn[];
  fields: AdminField[];
  filters?: AdminFilter[];
  quickActions?: AdminQuickAction[];
  bulkActions?: AdminQuickAction[];
  createEnabled?: boolean;
  deleteEnabled?: boolean;
  imageField?: string;
  projection?: string;
};

export const statusOptions = {
  product: [
    { label: "New", value: "new" },
    { label: "Hot", value: "hot" },
    { label: "Sale", value: "sale" },
    { label: "Archived", value: "archived" },
  ],
  variant: [
    { label: "Sunglasses", value: "sunglasses" },
    { label: "Eyeglasses", value: "eyeglasses" },
    { label: "Contact Lenses", value: "contact-lenses" },
    { label: "Accessories", value: "accessories" },
  ],
  order: [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Preparing Eyewear", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ],
  payment: [
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Failed", value: "failed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Refunded", value: "refunded" },
  ],
  discountType: [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed Amount", value: "fixed" },
  ],
  review: [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ],
  subscription: [
    { label: "Active", value: "active" },
    { label: "Unsubscribed", value: "unsubscribed" },
    { label: "Pending", value: "pending" },
  ],
  source: [
    { label: "Footer Form", value: "footer" },
    { label: "Popup", value: "popup" },
    { label: "Checkout", value: "checkout" },
    { label: "Other", value: "other" },
  ],
  contact: [
    { label: "New", value: "new" },
    { label: "Read", value: "read" },
    { label: "Replied", value: "replied" },
    { label: "Closed", value: "closed" },
  ],
  priority: [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ],
  membership: [
    { label: "Standard", value: "standard" },
    { label: "Premium", value: "premium" },
    { label: "Business", value: "business" },
    { label: "VIP", value: "vip" },
  ],
  access: [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ],
  notification: [
    { label: "Promo", value: "promo" },
    { label: "Order Update", value: "order" },
    { label: "System", value: "system" },
    { label: "Marketing", value: "marketing" },
    { label: "General", value: "general" },
  ],
};

const imageProjection = `{
  ...,
  asset->{
    _id,
    url
  }
}`;

export const adminResourceConfigs: Record<string, AdminResourceConfig> = {
  products: {
    key: "products",
    title: "Products",
    singularTitle: "Product",
    description:
      "Create, edit, archive, delete, price, discount, stock, categories, brands, and product images from the product schema.",
    documentType: "product",
    icon: Package,
    listOrder: "_updatedAt desc",
    searchFields: ["name", "description", "variant", "status"],
    createEnabled: true,
    deleteEnabled: true,
    imageField: "images",
    projection: `{
      ...,
      images[]${imageProjection},
      categories[]->{_id, title, slug},
      brand->{_id, title, slug},
      "categoryTitles": categories[]->title,
      "brandTitle": brand->title,
      "reviewCount": count(*[_type == "review" && product._ref == ^._id])
    }`,
    columns: [
      { key: "image", label: "", type: "image", path: "images.0" },
      { key: "name", label: "Product", type: "text" },
      { key: "brandTitle", label: "Brand", type: "text" },
      { key: "price", label: "Price", type: "currency" },
      { key: "discount", label: "Discount", type: "number" },
      { key: "stock", label: "Stock", type: "number" },
      { key: "status", label: "Status", type: "badge" },
    ],
    filters: [
      { key: "status", label: "Status", field: "status", options: statusOptions.product },
      { key: "variant", label: "Type", field: "variant", options: statusOptions.variant },
      { key: "category", label: "Category", field: "categories", referenceTo: "category" },
      { key: "brand", label: "Brand", field: "brand", referenceTo: "brand" },
      {
        key: "stockStatus",
        label: "Stock",
        field: "stock",
        options: [
          { label: "In stock", value: "inStock" },
          { label: "Low stock", value: "lowStock" },
          { label: "Out of stock", value: "outOfStock" },
        ],
      },
      {
        key: "priceRange",
        label: "Price",
        field: "price",
        options: [
          { label: "Under ₹1,000", value: "0-1000" },
          { label: "₹1,000 - ₹2,500", value: "1000-2500" },
          { label: "₹2,500 - ₹5,000", value: "2500-5000" },
          { label: "₹5,000+", value: "5000-" },
        ],
      },
      {
        key: "discount",
        label: "Discount",
        field: "discount",
        options: [
          { label: "No discount", value: "none" },
          { label: "Any discount", value: "active" },
          { label: "30% or more", value: "high" },
        ],
      },
    ],
    quickActions: [
      { key: "archive", label: "Archive", type: "patch", patch: { status: "archived" }, tone: "outline" },
      { key: "feature", label: "Feature", type: "patch", patch: { isFeatured: true }, tone: "outline" },
    ],
    bulkActions: [
      { key: "archive", label: "Archive selected", type: "patch", patch: { status: "archived" }, tone: "outline" },
      { key: "delete", label: "Delete selected", type: "delete", tone: "destructive" },
    ],
    fields: [
      { name: "name", label: "Product Name", type: "string", required: true },
      { name: "slug", label: "Slug", type: "string", required: true },
      { name: "images", label: "Product Images", type: "imageArray" },
      { name: "description", label: "Description", type: "text" },
      { name: "highlights", label: "Product Highlights", type: "stringArray" },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "discount", label: "Discount", type: "number", required: true },
      { name: "stock", label: "Stock", type: "number" },
      { name: "categories", label: "Categories", type: "referenceArray", referenceTo: "category" },
      { name: "brand", label: "Brand", type: "reference", referenceTo: "brand" },
      { name: "status", label: "Product Status", type: "select", options: statusOptions.product },
      { name: "variant", label: "Product Type", type: "select", options: statusOptions.variant },
      { name: "isFeatured", label: "Featured Product", type: "boolean" },
      { name: "frameMaterial", label: "Frame Material", type: "string" },
      { name: "lensType", label: "Lens Type", type: "string" },
      { name: "gender", label: "Gender", type: "string" },
      { name: "frameShape", label: "Frame Shape", type: "string" },
      { name: "uvProtection", label: "UV Protection", type: "string" },
      { name: "warranty", label: "Warranty", type: "string" },
      { name: "frameSize", label: "Frame Size", type: "string" },
      { name: "lensWidth", label: "Lens Width", type: "string" },
      { name: "bridgeWidth", label: "Bridge Width", type: "string" },
      { name: "templeLength", label: "Temple Length", type: "string" },
      { name: "lensColor", label: "Lens Color", type: "string" },
      { name: "prescriptionAvailable", label: "Prescription Available", type: "boolean" },
    ],
  },
  categories: {
    key: "categories",
    title: "Categories",
    singularTitle: "Category",
    description: "Manage category documents and inspect product counts.",
    documentType: "category",
    icon: Tag,
    listOrder: "title asc",
    searchFields: ["title", "description"],
    createEnabled: true,
    deleteEnabled: true,
    imageField: "image",
    projection: `{
      ...,
      image${imageProjection},
      "productCount": count(*[_type == "product" && references(^._id)])
    }`,
    columns: [
      { key: "image", label: "", type: "image" },
      { key: "title", label: "Category", type: "text" },
      { key: "productCount", label: "Products", type: "number" },
      { key: "range", label: "Starting From", type: "currency" },
      { key: "featured", label: "Featured", type: "badge" },
    ],
    filters: [
      { key: "featured", label: "Featured", field: "featured", options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
    ],
    fields: [
      { name: "title", label: "Title", type: "string", required: true },
      { name: "slug", label: "Slug", type: "string" },
      { name: "description", label: "Description", type: "text" },
      { name: "range", label: "Starting From", type: "number" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "image", label: "Category Image", type: "image" },
    ],
  },
  brands: {
    key: "brands",
    title: "Brands",
    singularTitle: "Brand",
    description: "Manage brand documents and associated products.",
    documentType: "brand",
    icon: Building2,
    listOrder: "title asc",
    searchFields: ["title", "description"],
    createEnabled: true,
    deleteEnabled: true,
    imageField: "image",
    projection: `{
      ...,
      image${imageProjection},
      "productCount": count(*[_type == "product" && brand._ref == ^._id]),
      "products": *[_type == "product" && brand._ref == ^._id][0...8]{_id, name, stock, price}
    }`,
    columns: [
      { key: "image", label: "", type: "image" },
      { key: "title", label: "Brand", type: "text" },
      { key: "productCount", label: "Products", type: "number" },
      { key: "description", label: "Description", type: "text" },
    ],
    fields: [
      { name: "title", label: "Title", type: "string", required: true },
      { name: "slug", label: "Slug", type: "string" },
      { name: "description", label: "Description", type: "text" },
      { name: "image", label: "Brand Image", type: "image" },
    ],
  },
  orders: {
    key: "orders",
    title: "Orders",
    singularTitle: "Order",
    description: "View orders, update status, assign employees, cancel, refund, print invoices, and resend order email.",
    documentType: "order",
    icon: Archive,
    listOrder: "orderDate desc",
    searchFields: ["orderNumber", "customerName", "email", "couponCode"],
    createEnabled: false,
    deleteEnabled: true,
    projection: `{
      ...,
      products[]{..., product->{_id, name, price, images}},
      "itemCount": count(products)
    }`,
    columns: [
      { key: "orderNumber", label: "Order", type: "text" },
      { key: "customerName", label: "Customer", type: "text" },
      { key: "totalPrice", label: "Total", type: "currency" },
      { key: "status", label: "Status", type: "badge" },
      { key: "paymentStatus", label: "Payment", type: "badge" },
      { key: "orderDate", label: "Date", type: "date" },
    ],
    filters: [
      { key: "status", label: "Status", field: "status", options: statusOptions.order },
      { key: "paymentStatus", label: "Payment", field: "paymentStatus", options: statusOptions.payment },
    ],
    quickActions: [
      { key: "cancel", label: "Cancel order", type: "patch", patch: { status: "cancelled" }, tone: "destructive" },
      { key: "refund", label: "Mark refunded", type: "patch", patch: { paymentStatus: "refunded", refundedToWallet: true }, tone: "outline" },
      { key: "email", label: "Resend email", type: "email", tone: "outline" },
      { key: "invoice", label: "Print invoice", type: "invoice", tone: "outline" },
    ],
    fields: [
      { name: "orderNumber", label: "Order Number", type: "string", readOnly: true },
      { name: "customerName", label: "Customer Name", type: "string" },
      { name: "email", label: "Customer Email", type: "string" },
      { name: "status", label: "Order Status", type: "select", options: statusOptions.order },
      { name: "paymentStatus", label: "Payment Status", type: "select", options: statusOptions.payment },
      { name: "assignedDeliverymanName", label: "Assigned Employee", type: "string" },
      { name: "assignedDeliverymanId", label: "Assigned Employee ID", type: "string" },
      { name: "totalPrice", label: "Total Price", type: "number" },
      { name: "refundAmount", label: "Refund Amount", type: "number" },
      { name: "refundedToWallet", label: "Refunded To Wallet", type: "boolean" },
      { name: "cancelledBy", label: "Cancelled By", type: "string" },
      { name: "cancellationReason", label: "Cancellation Reason", type: "text" },
    ],
  },
  coupons: {
    key: "coupons",
    title: "Coupons",
    singularTitle: "Coupon",
    description: "Create, edit, disable, and analyze coupon usage.",
    documentType: "coupon",
    icon: Percent,
    listOrder: "_updatedAt desc",
    searchFields: ["code"],
    createEnabled: true,
    deleteEnabled: true,
    projection: `{
      ...,
      "orders": count(*[_type == "order" && couponCode == ^.code]),
      "revenueGenerated": math::sum(*[_type == "order" && couponCode == ^.code && status != "cancelled"].totalPrice)
    }`,
    columns: [
      { key: "code", label: "Code", type: "text" },
      { key: "discountType", label: "Type", type: "badge" },
      { key: "discountValue", label: "Value", type: "number" },
      { key: "timesUsed", label: "Used", type: "number" },
      { key: "revenueGenerated", label: "Revenue", type: "currency" },
      { key: "isActive", label: "Active", type: "badge" },
    ],
    filters: [
      { key: "isActive", label: "Active", field: "isActive", options: [{ label: "Active", value: "true" }, { label: "Disabled", value: "false" }] },
    ],
    quickActions: [
      { key: "disable", label: "Disable", type: "patch", patch: { isActive: false }, tone: "outline" },
    ],
    fields: [
      { name: "code", label: "Coupon Code", type: "string", required: true },
      { name: "discountType", label: "Discount Type", type: "select", required: true, options: statusOptions.discountType },
      { name: "discountValue", label: "Discount Value", type: "number", required: true },
      { name: "minimumOrderValue", label: "Minimum Order Value", type: "number" },
      { name: "expiryDate", label: "Expiry Date", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "usageLimit", label: "Usage Limit", type: "number" },
      { name: "timesUsed", label: "Times Used", type: "number", readOnly: true },
    ],
  },
  reviews: {
    key: "reviews",
    title: "Reviews",
    singularTitle: "Review",
    description: "Moderate reviews, approve/reject, delete, add admin reply notes, and inspect rating analytics.",
    documentType: "review",
    icon: Star,
    listOrder: "createdAt desc",
    searchFields: ["title", "content", "adminNotes"],
    createEnabled: false,
    deleteEnabled: true,
    projection: `{
      ...,
      product->{_id, name, slug},
      user->{_id, firstName, lastName, email},
      "productName": product->name,
      "userEmail": user->email
    }`,
    columns: [
      { key: "title", label: "Review", type: "text" },
      { key: "productName", label: "Product", type: "text" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "status", label: "Status", type: "badge" },
      { key: "createdAt", label: "Date", type: "date" },
    ],
    filters: [
      { key: "status", label: "Status", field: "status", options: statusOptions.review },
      { key: "rating", label: "Rating", field: "rating", options: [1, 2, 3, 4, 5].map((rating) => ({ label: `${rating} Stars`, value: String(rating) })) },
    ],
    quickActions: [
      { key: "approve", label: "Approve", type: "patch", patch: { status: "approved" }, tone: "outline" },
      { key: "reject", label: "Reject", type: "patch", patch: { status: "rejected" }, tone: "destructive" },
    ],
    fields: [
      { name: "rating", label: "Rating", type: "number", readOnly: true },
      { name: "title", label: "Review Title", type: "string" },
      { name: "content", label: "Review Content", type: "text" },
      { name: "status", label: "Review Status", type: "select", options: statusOptions.review },
      { name: "adminNotes", label: "Admin Reply / Notes", type: "text" },
      { name: "helpful", label: "Helpful Count", type: "number" },
    ],
  },
  blog: {
    key: "blog",
    title: "Blog",
    singularTitle: "Post",
    description: "Create, edit, delete, publish, and unpublish blog posts.",
    documentType: "blog",
    icon: BookOpen,
    listOrder: "publishedAt desc",
    searchFields: ["title"],
    createEnabled: true,
    deleteEnabled: true,
    imageField: "mainImage",
    projection: `{
      ...,
      mainImage${imageProjection},
      blogcategories[]->{_id, title, slug},
      "categoryTitles": blogcategories[]->title
    }`,
    columns: [
      { key: "mainImage", label: "", type: "image" },
      { key: "title", label: "Post", type: "text" },
      { key: "publishedAt", label: "Published", type: "date" },
      { key: "isLatest", label: "Latest", type: "badge" },
    ],
    quickActions: [
      { key: "publish", label: "Publish", type: "patch", patch: { publishedAt: "__now" }, tone: "outline" },
      { key: "unpublish", label: "Unpublish", type: "patch", patch: { publishedAt: null }, tone: "outline" },
    ],
    fields: [
      { name: "title", label: "Title", type: "string", required: true },
      { name: "slug", label: "Slug", type: "string" },
      { name: "mainImage", label: "Main Image", type: "image" },
      { name: "blogcategories", label: "Blog Categories", type: "referenceArray", referenceTo: "blogcategory" },
      { name: "publishedAt", label: "Published At", type: "datetime" },
      { name: "isLatest", label: "Latest Blog", type: "boolean" },
      { name: "body", label: "Body", type: "portableText" },
    ],
  },
  banners: {
    key: "banners",
    title: "Banners",
    singularTitle: "Banner",
    description: "Upload, edit, reorder, activate, deactivate, and remove homepage banners.",
    documentType: "banner",
    icon: ImageIcon,
    listOrder: "_updatedAt desc",
    searchFields: ["title", "description", "badge"],
    createEnabled: true,
    deleteEnabled: true,
    imageField: "image",
    projection: `{
      ...,
      image${imageProjection}
    }`,
    columns: [
      { key: "image", label: "", type: "image" },
      { key: "title", label: "Banner", type: "text" },
      { key: "badge", label: "Badge", type: "badge" },
      { key: "discountAmount", label: "Discount", type: "number" },
    ],
    quickActions: [
      { key: "deactivate", label: "Deactivate", type: "patch", patch: { badge: "inactive" }, tone: "outline" },
      { key: "activate", label: "Activate", type: "patch", patch: { badge: "active" }, tone: "outline" },
    ],
    fields: [
      { name: "title", label: "Sale Title", type: "string", required: true },
      { name: "description", label: "Sale Description", type: "text" },
      { name: "badge", label: "Discount Badge / State", type: "string" },
      { name: "discountAmount", label: "Discount Amount", type: "number" },
      { name: "image", label: "Banner Image", type: "image" },
    ],
  },
  newsletter: {
    key: "newsletter",
    title: "Newsletter",
    singularTitle: "Subscriber",
    description: "View subscribers, export CSV, and unsubscribe users.",
    documentType: "subscription",
    icon: Mail,
    listOrder: "subscribedAt desc",
    searchFields: ["email", "source"],
    createEnabled: false,
    deleteEnabled: true,
    projection: `{...}`,
    columns: [
      { key: "email", label: "Email", type: "text" },
      { key: "status", label: "Status", type: "badge" },
      { key: "source", label: "Source", type: "badge" },
      { key: "subscribedAt", label: "Subscribed", type: "date" },
    ],
    filters: [
      { key: "status", label: "Status", field: "status", options: statusOptions.subscription },
      { key: "source", label: "Source", field: "source", options: statusOptions.source },
    ],
    quickActions: [
      { key: "unsubscribe", label: "Unsubscribe", type: "patch", patch: { status: "unsubscribed", unsubscribedAt: "__now" }, tone: "outline" },
    ],
    fields: [
      { name: "email", label: "Email Address", type: "string", readOnly: true },
      { name: "status", label: "Subscription Status", type: "select", options: statusOptions.subscription },
      { name: "subscribedAt", label: "Subscribed At", type: "datetime", readOnly: true },
      { name: "unsubscribedAt", label: "Unsubscribed At", type: "datetime" },
      { name: "source", label: "Subscription Source", type: "select", options: statusOptions.source },
    ],
  },
  contacts: {
    key: "contacts",
    title: "Contact Requests",
    singularTitle: "Contact Request",
    description: "View messages, reply with admin notes, mark resolved, or archive.",
    documentType: "contact",
    icon: Contact,
    listOrder: "submittedAt desc",
    searchFields: ["name", "email", "subject", "message"],
    createEnabled: false,
    deleteEnabled: true,
    projection: `{...}`,
    columns: [
      { key: "subject", label: "Subject", type: "text" },
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "priority", label: "Priority", type: "badge" },
      { key: "status", label: "Status", type: "badge" },
      { key: "submittedAt", label: "Submitted", type: "date" },
    ],
    filters: [
      { key: "status", label: "Status", field: "status", options: statusOptions.contact },
      { key: "priority", label: "Priority", field: "priority", options: statusOptions.priority },
    ],
    quickActions: [
      { key: "read", label: "Mark read", type: "patch", patch: { status: "read" }, tone: "outline" },
      { key: "resolved", label: "Mark resolved", type: "patch", patch: { status: "closed" }, tone: "outline" },
      { key: "archived", label: "Archive", type: "patch", patch: { status: "closed" }, tone: "outline" },
    ],
    fields: [
      { name: "name", label: "Name", type: "string", readOnly: true },
      { name: "email", label: "Email", type: "string", readOnly: true },
      { name: "subject", label: "Subject", type: "string" },
      { name: "message", label: "Message", type: "text", readOnly: true },
      { name: "status", label: "Status", type: "select", options: statusOptions.contact },
      { name: "priority", label: "Priority", type: "select", options: statusOptions.priority },
      { name: "submittedAt", label: "Submitted At", type: "datetime", readOnly: true },
    ],
  },
  users: {
    key: "users",
    title: "Sanity Users",
    singularTitle: "User",
    description: "Edit business status, account status, reward points, and membership data from the user schema.",
    documentType: "user",
    icon: Users,
    listOrder: "_createdAt desc",
    searchFields: ["email", "firstName", "lastName", "phone"],
    createEnabled: false,
    deleteEnabled: false,
    projection: `{
      ...,
      "orderCount": count(*[_type == "order" && clerkUserId == ^.clerkUserId])
    }`,
    columns: [
      { key: "email", label: "Email", type: "text" },
      { key: "membershipType", label: "Membership", type: "badge" },
      { key: "businessStatus", label: "Business", type: "badge" },
      { key: "premiumStatus", label: "Premium", type: "badge" },
      { key: "rewardPoints", label: "Rewards", type: "number" },
      { key: "totalSpent", label: "Spent", type: "currency" },
    ],
    filters: [
      { key: "membershipType", label: "Membership", field: "membershipType", options: statusOptions.membership },
      { key: "businessStatus", label: "Business", field: "businessStatus", options: statusOptions.access },
      { key: "premiumStatus", label: "Premium", field: "premiumStatus", options: statusOptions.access },
    ],
    fields: [
      { name: "email", label: "Email", type: "string", readOnly: true },
      { name: "firstName", label: "First Name", type: "string" },
      { name: "lastName", label: "Last Name", type: "string" },
      { name: "phone", label: "Phone", type: "string" },
      { name: "isActive", label: "Premium Account", type: "boolean" },
      { name: "premiumStatus", label: "Premium Status", type: "select", options: statusOptions.access },
      { name: "isBusiness", label: "Business Account", type: "boolean" },
      { name: "businessStatus", label: "Business Status", type: "select", options: statusOptions.access },
      { name: "membershipType", label: "Membership Type", type: "select", options: statusOptions.membership },
      { name: "rewardPoints", label: "Reward Points", type: "number" },
      { name: "loyaltyPoints", label: "Loyalty Points", type: "number" },
      { name: "walletBalance", label: "Wallet Balance", type: "number" },
      { name: "isAdmin", label: "Is Admin", type: "boolean" },
    ],
  },
  accessRequests: {
    key: "accessRequests",
    title: "Access Requests",
    singularTitle: "Access Request",
    description: "Manage user access request documents.",
    documentType: "userAccessRequest",
    icon: Users,
    listOrder: "requestedAt desc",
    searchFields: ["email", "firstName", "lastName", "notes"],
    createEnabled: false,
    deleteEnabled: true,
    projection: `{...}`,
    columns: [
      { key: "email", label: "Email", type: "text" },
      { key: "status", label: "Status", type: "badge" },
      { key: "requestedAt", label: "Requested", type: "date" },
      { key: "notes", label: "Notes", type: "text" },
    ],
    filters: [
      { key: "status", label: "Status", field: "status", options: statusOptions.access },
    ],
    quickActions: [
      { key: "approve", label: "Approve", type: "patch", patch: { status: "approved", approvedAt: "__now" }, tone: "outline" },
      { key: "reject", label: "Reject", type: "patch", patch: { status: "rejected", rejectedAt: "__now" }, tone: "destructive" },
    ],
    fields: [
      { name: "email", label: "Email", type: "string", readOnly: true },
      { name: "firstName", label: "First Name", type: "string" },
      { name: "lastName", label: "Last Name", type: "string" },
      { name: "status", label: "Status", type: "select", options: statusOptions.access },
      { name: "requestedAt", label: "Requested At", type: "datetime", readOnly: true },
      { name: "notes", label: "Admin Notes", type: "text" },
    ],
  },
  notifications: {
    key: "notifications",
    title: "Sent Notifications",
    singularTitle: "Notification",
    description: "Inspect sent notifications and resend from the notification center.",
    documentType: "sentNotification",
    icon: Bell,
    listOrder: "sentAt desc",
    searchFields: ["title", "message", "sentBy"],
    createEnabled: false,
    deleteEnabled: true,
    projection: `{...}`,
    columns: [
      { key: "title", label: "Title", type: "text" },
      { key: "type", label: "Type", type: "badge" },
      { key: "priority", label: "Priority", type: "badge" },
      { key: "recipientCount", label: "Recipients", type: "number" },
      { key: "sentAt", label: "Sent", type: "date" },
    ],
    filters: [
      { key: "type", label: "Type", field: "type", options: statusOptions.notification },
      { key: "priority", label: "Priority", field: "priority", options: statusOptions.priority },
    ],
    fields: [
      { name: "title", label: "Title", type: "string", readOnly: true },
      { name: "message", label: "Message", type: "text", readOnly: true },
      { name: "type", label: "Type", type: "select", options: statusOptions.notification, readOnly: true },
      { name: "priority", label: "Priority", type: "select", options: statusOptions.priority, readOnly: true },
      { name: "sentAt", label: "Sent At", type: "datetime", readOnly: true },
      { name: "sentBy", label: "Sent By", type: "string", readOnly: true },
      { name: "recipientCount", label: "Recipient Count", type: "number", readOnly: true },
    ],
  },
};

export const adminResourceList = Object.values(adminResourceConfigs);

export function getAdminResourceConfig(resource: string) {
  return adminResourceConfigs[resource] || null;
}

export function resolveSpecialPatchValues(value: unknown): unknown {
  if (value === "__now") return new Date().toISOString();
  if (Array.isArray(value)) return value.map(resolveSpecialPatchValues);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        resolveSpecialPatchValues(nested),
      ])
    );
  }
  return value;
}
