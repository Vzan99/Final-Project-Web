export default function AdminJobDetailSkeleton() {
  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
          <div className="h-8 w-36 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="grid gap-4 bg-white p-6 rounded shadow">
        <div className="flex flex-wrap gap-2 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-24 bg-gray-300 rounded-xl"></div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-1/5 bg-gray-300 rounded"></div>
          <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
