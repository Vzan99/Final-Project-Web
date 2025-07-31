import React from "react";

export default function featuredJobsCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 h-64 bg-gray-100 rounded-lg shadow-md border border-gray-200 p-4 relative animate-pulse">
      {/* Logo placeholder */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-gray-300 rounded" />

      {/* Text content */}
      <div className="pr-20 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-full mt-4" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}
