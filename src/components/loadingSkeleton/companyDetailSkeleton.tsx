"use client";

export default function CompanyDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#f3f2ef] pt-8 text-black pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-0 animate-pulse">
        {/* Banner */}
        <div className="relative bg-white rounded-t-xl h-48 overflow-hidden">
          <div className="w-full h-full bg-gray-300" />
        </div>

        {/* Company card */}
        <div className="relative bg-white rounded-b-xl shadow p-6 px-4 md:px-8 pt-10 flex flex-col items-start z-20">
          {/* Logo */}
          <div className="absolute -top-20 left-0 right-0 md:left-8 md:right-auto z-30">
            <div className="w-32 h-32 mx-auto md:mx-0 border-6 border-white rounded-md overflow-hidden bg-gray-300" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center mt-4 max-w-lg w-full space-y-3 mb-6">
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>

          {/* Tab content */}
          <div className="space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    </main>
  );
}
