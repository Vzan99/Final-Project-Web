export default function PreSelectionTestSkeleton() {
  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen animate-pulse space-y-4">
      <div className="h-8 w-1/2 bg-gray-300 rounded" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="space-y-2 border border-gray-300 p-4 bg-white rounded"
        >
          <div className="h-4 w-3/4 bg-gray-300 rounded" />
          {[...Array(4)].map((_, j) => (
            <div key={j} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-300 rounded-full" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ))}
      <div className="h-10 w-32 bg-gray-300 rounded" />
    </div>
  );
}
