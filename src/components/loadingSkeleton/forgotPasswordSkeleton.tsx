import React from "react";

export default function ForgotPasswordSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1f0e8] px-4 animate-pulse">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6" />

        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>

          <div className="h-10 bg-gray-300 rounded w-full mt-4" />
        </div>
      </div>
    </main>
  );
}
