export default function PreSelectionTestAnswerSkeleton() {
  return (
    <div className="flex flex-col px-4 lg:px-12 py-6 gap-6 max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-300 rounded" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 border border-gray-200 rounded shadow-sm space-y-3"
          >
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="h-8 w-20 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
