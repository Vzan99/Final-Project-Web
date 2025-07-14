"use client";

export function JobDetailsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Banner */}
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4" />

      {/* Buttons placeholder */}
      <div className="absolute top-0 right-0 flex gap-2 p-2 z-10">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="w-9 h-9 rounded-full bg-gray-200" />
      </div>

      {/* Logo and title */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded" />
        <div className="flex flex-col space-y-2">
          <div className="w-48 h-6 bg-gray-300 rounded" />
          <div className="w-32 h-4 bg-gray-300 rounded" />
          <div className="w-40 h-4 bg-gray-300 rounded" />
          <div className="w-24 h-3 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Job details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-32 h-4 bg-gray-300 rounded" />
        ))}
      </div>

      {/* Apply button */}
      <div className="w-36 h-10 bg-gray-300 rounded-lg" />

      {/* Description */}
      <div className="space-y-2 pt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-3 bg-gray-300 rounded" />
        ))}
      </div>
    </div>
  );
}
