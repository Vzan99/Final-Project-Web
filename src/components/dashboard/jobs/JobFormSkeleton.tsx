export default function JobFormSkeleton() {
  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <div className="space-y-6 max-w-xl bg-white p-6 rounded-xl shadow-md mx-auto animate-pulse">
        <div className="h-6 w-1/3 bg-gray-300 rounded" />

        {/* Text inputs */}
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        ))}

        {/* Deadline */}
        <div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Salary */}
        <div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Category */}
        <div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Experience & Job Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Tags */}
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="flex flex-wrap gap-2 mt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-300 rounded-full" />
            ))}
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>

        {/* Checkboxes */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-300 rounded" />
            <div className="h-4 w-24 bg-gray-300 rounded" />
          </div>
        ))}

        {/* Button */}
        <div className="h-10 w-32 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
