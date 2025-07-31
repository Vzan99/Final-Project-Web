import React from "react";

export default function RegisterPageSkeleton() {
  return (
    <main className="flex flex-col md:flex-row justify-center items-start bg-white pt-16 pb-12 px-4 md:px-8 animate-pulse">
      {/* Left side */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 pr-8">
        <div className="text-center mb-6 max-w-md">
          <div className="h-10 bg-[#BDCDD6] rounded w-3/4 mb-4 mx-auto" />
          <div className="h-5 bg-gray-300 rounded w-full mb-6" />
          <div className="w-[500px] h-[350px] bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Right side: Skeleton Form */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full max-w-md space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-[#93BFCF] rounded mt-6" />
        </div>
      </div>
    </main>
  );
}
