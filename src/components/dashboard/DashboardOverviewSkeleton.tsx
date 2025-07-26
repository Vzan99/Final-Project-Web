export default function DashboardOverviewSkeleton() {
  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <div className="h-8 w-64 bg-gray-300 rounded mb-8 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 animate-pulse"
          >
            <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-400 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
