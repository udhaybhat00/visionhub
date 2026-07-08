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
      <button onClick={toggleSidebar} className="xl:hidden">
        <AlignLeft className="w-6 h-6 hover:text-hoverColor hoverEffect" />
      </button>
      <div className="xl:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};





export default MobileMenu;
