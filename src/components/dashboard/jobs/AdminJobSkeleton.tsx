export default function AdminJobCardSkeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-md bg-white shadow">
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 w-1/4 bg-gray-300 rounded mb-4"></div>
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
