export default function CompanyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gray-300 rounded w-2/3"></div>
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}
