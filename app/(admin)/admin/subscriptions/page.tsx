import { Metadata } from "next";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export const metadata: Metadata = {
  title: "Newsletter Subscriptions - Admin Panel",
  description: "Manage newsletter subscriptions",
};

export default function SubscriptionsPage() {
  return <AdminResourceManager resourceKey="newsletter" />;
}
