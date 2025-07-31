import { JobCardSkeleton } from "./jobCardSkeleton";

export default function JobsPageSkeleton() {
  return (
    <div className="flex flex-col px-4 lg:px-12 py-6 gap-6 max-w-7xl mx-auto">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />{" "}
      {/* Title skeleton */}
      <div className="h-16 bg-gray-100 rounded-md animate-pulse" />{" "}
      {/* Search bar skeleton */}
      <div className="flex gap-6">
        <div className="w-full md:w-2/5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
        <div className="hidden md:block w-3/5 h-[75vh] bg-gray-100 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
