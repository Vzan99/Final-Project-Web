"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/dashboardSidebar";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <ProtectedRoute
      allowedRoles={["ADMIN"]}
      requireVerified={true}
      fallback={<Spinner />}
    >
      <div className="flex min-h-screen relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-[#EEE0C9] border-r border-gray-300">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar (drawer style) */}
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden ${
            showSidebar
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowSidebar(false)}
        />
        <div
          className={`fixed top-0 left-0 h-full w-64 z-50 bg-[#EEE0C9] transform transition-transform duration-300 md:hidden ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden p-4 bg-[#EEE0C9] flex items-center justify-between border-b border-gray-300">
            <button onClick={() => setShowSidebar(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-[#6096B4]">Dashboard</h1>
          </div>

          <main className="flex-1 px-2 sm:px-4 md:px-8 py-4 bg-white overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
