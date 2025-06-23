import Sidebar from "@/components/dashboard/dashboardSidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
