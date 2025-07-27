import React from "react";
import DeveloperSidebar from "@/components/dashboard/developerSidebar";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";
export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["DEVELOPER"]}
      requireVerified={true}
      fallback={<Spinner />}
    >
      <div className="flex min-h-screen">
        <DeveloperSidebar />
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
