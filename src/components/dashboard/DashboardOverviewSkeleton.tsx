export default function DashboardOverviewSkeleton() {
  return (
    <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen">
      {/* Card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-xl p-4 md:p-6 border border-gray-200 animate-pulse"
          >
            <div className="h-4 md:h-5 bg-gray-300 rounded w-1/2 mb-2" />
            <div className="h-6 md:h-8 bg-gray-400 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
