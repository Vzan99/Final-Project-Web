export default function SalaryTrendsSkeleton() {
  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen space-y-8 animate-pulse">
      {/* Tabel Skeleton */}
      <div className="bg-white border rounded-lg shadow p-6 space-y-4">
        <div className="h-6 w-48 bg-gray-300 rounded" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white border rounded-lg shadow p-6 space-y-4">
        <div className="h-6 w-64 bg-gray-300 rounded" />
        <div className="h-96 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
