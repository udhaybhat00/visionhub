"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useIsAdmin } from "@/lib/adminUtils";
import AdminTopNavigation from "@/components/admin/AdminTopNavigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useIsAdmin(user?.primaryEmailAddress?.emailAddress);

  // Redirect non-admin users
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      router.push("/admin/access-denied");
    }
  }, [isLoaded, isAdmin, router]);

  useEffect(() => {
    document.body.classList.add("admin-page-active");
    return () => document.body.classList.remove("admin-page-active");
  }, []);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop_dark_green"></div>
        </div>
      </div>
    );
  }

  // If not admin, don't render anything (redirect will happen)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <AdminTopNavigation currentPath={pathname} user={user} />
      <main className="mx-auto max-w-[1600px] px-0 sm:px-6 sm:py-6">
        <div className="overflow-hidden bg-white sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
