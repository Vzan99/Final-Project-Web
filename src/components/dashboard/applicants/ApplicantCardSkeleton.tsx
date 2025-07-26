export default function ApplicantCardSkeleton() {
  return (
    <div className="p-4 border rounded shadow animate-pulse bg-white space-y-3">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded"></div>
      <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-300 rounded"></div>
    </div>
  );
}
