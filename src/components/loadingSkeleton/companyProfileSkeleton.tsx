"use client";

export default function CompanyProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {/* Banner Skeleton */}
        <div className="animate-pulse bg-gray-300 rounded-t-xl h-48 mb-10" />

        {/* Company Card Skeleton */}
        <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start">
          {/* Logo Skeleton */}
          <div className="absolute -top-20 left-0 right-0 md:left-8 md:right-auto z-30">
            <div className="w-32 h-32 bg-gray-300 border-6 border-white mx-auto md:mx-0 rounded-md animate-pulse" />
          </div>

          {/* Edit Button Skeleton */}
          <div className="ml-auto mb-4 h-8 w-8 bg-gray-300 rounded-full animate-pulse" />

          {/* Company Info Skeleton */}
          <div className="flex flex-col justify-center mt-4 max-w-lg w-full space-y-3">
            <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
