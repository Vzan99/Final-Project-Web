export function JobCardSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 animate-pulse space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
    </div>
  );
}
