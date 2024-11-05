"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/Sidebar";
import { MobileSidebar } from "@/components/navigation/MobileSidebar";
import Navbar from "@/components/navigation/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex">
      <SidebarProvider>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64">
          <AppSidebar />
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 w-full transition-all duration-300 ease-in-out lg:ml-64">
          {/* Navbar */}
          <header className="fixed top-0 right-0 left-0 z-20 transition-all duration-300 ease-in-out lg:ml-[17rem] lg:mr-4">
            <Navbar
              onMenuClick={handleMobileMenuToggle}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          </header>

          {/* Main Content */}
          <main className="pt-16 min-h-screen mt-4">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[2000px]">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
