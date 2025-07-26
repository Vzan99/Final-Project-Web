import { JobCardSkeleton } from "./jobCardSkeleton";
import { JobDetailsSkeleton } from "./jobDetailsSkeleton";

const PAGE_SIZE = 10;

export default function JobListingsSkeleton() {
  return (
    <div className="flex flex-col px-4 lg:px-12 py-6 gap-6 max-w-7xl mx-auto">
      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-200 rounded-md animate-pulse w-full max-w-4xl mx-auto" />

      <div className="flex gap-6">
        {/* Left panel - job list */}
        <div className="w-full md:w-2/5 h-[75vh] overflow-y-auto pr-2 border-r border-gray-200">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>

        {/* Right panel - job details */}
        <div className="hidden md:block w-3/5 h-[75vh] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <JobDetailsSkeleton />
        </div>
      </div>
    </div>
  );
}
