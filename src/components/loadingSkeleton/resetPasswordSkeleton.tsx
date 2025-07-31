import React from "react";

export default function ResetPasswordSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f0e8] px-4 animate-pulse">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-lg">
        <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mb-6" />

        {/* New Password */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>

        {/* Submit Button */}
        <div className="h-10 bg-gray-300 rounded w-full" />
      </div>
    </div>
  );
}
