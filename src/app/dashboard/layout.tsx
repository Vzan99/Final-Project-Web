import Sidebar from "@/components/dashboard/dashboardSidebar";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["ADMIN"]}
      requireVerified={true}
      fallback={<Spinner />}
    >
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-white">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
