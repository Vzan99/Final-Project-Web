"use client";

export default function SavedJobsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 animate-pulse"
        >
          <div className="flex justify-between items-start space-x-4">
            <div className="flex-1 space-y-2">
              {/* Title */}
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              {/* Company */}
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              {/* Location */}
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>

            <div className="flex space-x-3 min-w-[100px]">
              {/* Buttons placeholders */}
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
