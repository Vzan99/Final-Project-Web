"use client";

export default function AppliedJobsSkeleton() {
  const placeholders = Array.from({ length: 4 });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-[#497187] mb-4 animate-pulse bg-gray-300 rounded w-48 h-8" />

      {/* Filter Tabs Skeleton */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-full bg-gray-300 w-20 h-8 animate-pulse"
          />
        ))}
      </div>

      {/* Cards Skeleton */}
      <section className="rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100">
        {placeholders.map((_, idx) => (
          <div
            key={idx}
            className="p-6 animate-pulse flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0"
          >
            <div className="space-y-2 flex-1">
              <div className="bg-gray-300 rounded w-3/4 h-6"></div>{" "}
              {/* Job Title */}
              <div className="bg-gray-300 rounded w-1/2 h-4"></div>{" "}
              {/* Company */}
              <div className="bg-gray-300 rounded w-1/3 h-3"></div>{" "}
              {/* Location */}
            </div>

            <div className="space-y-2 text-right sm:text-left sm:ml-6 min-w-[160px]">
              <div className="bg-gray-300 rounded w-full h-4"></div>{" "}
              {/* Status */}
              <div className="bg-gray-300 rounded w-3/4 h-3"></div>{" "}
              {/* Applied Date */}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
