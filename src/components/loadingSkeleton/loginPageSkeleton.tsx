import React from "react";

export default function LoginPageSkeleton() {
  return (
    <main className="flex flex-col md:flex-row justify-center items-start text-black bg-white pt-16 pb-12 px-4 md:px-8 animate-pulse">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 pr-8">
        <div className="max-w-md space-y-4">
          <div className="h-10 bg-gray-300 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-64 bg-gray-200 rounded w-full" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />

          {/* Email Field */}
          <div className="h-12 bg-gray-200 rounded" />

          {/* Password Field */}
          <div className="h-12 bg-gray-200 rounded" />

          {/* Forgot Password */}
          <div className="h-4 w-24 bg-gray-200 rounded ml-auto" />

          {/* Login Button */}
          <div className="h-10 bg-gray-300 rounded" />

          {/* Divider */}
          <div className="flex items-center my-4 space-x-2">
            <div className="flex-grow h-px bg-gray-300" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Google Button */}
          <div className="h-10 bg-gray-200 rounded" />

          {/* Footer Link */}
          <div className="h-4 w-40 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </main>
  );
}
