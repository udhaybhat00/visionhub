"use client";

import { AlignLeft } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-bone/60 text-ink transition-brand hover:border-amber-brand/40 hover:bg-cream-deep lg:hidden"
      >
        <AlignLeft className="h-5 w-5" />
      </button>
      <div className="lg:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};





export default MobileMenu;
