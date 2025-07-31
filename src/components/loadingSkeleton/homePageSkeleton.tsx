import React from "react";
import FeaturedJobsCardSkeleton from "./featuredJobsCardSkeleton";

export default function HomePageSkeleton() {
  return (
    <main className="min-h-screen bg-[#EEE9DA] text-[#1a1a1a] animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-white text-center py-20 px-6">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="h-10 bg-gray-300 rounded w-2/3 mx-auto" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
          {/* Search Bar Skeleton */}
          <div className="h-14 bg-gray-200 rounded-lg w-full max-w-3xl mx-auto mt-8" />
        </div>
      </section>

      {/* SignIn Card Section Skeleton */}
      <section className="bg-[#EEE9DA] py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-lg shadow border border-gray-300"
            />
          ))}
        </div>
      </section>

      {/* Featured Jobs Section Skeleton */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 bg-gray-300 w-1/4 rounded mb-6" />
          <div className="flex space-x-6 overflow-x-auto py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <FeaturedJobsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
