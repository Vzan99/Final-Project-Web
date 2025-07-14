import React from "react";
import { Job } from "@/types/jobs";

export type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const companyName = job.company?.admin?.name ?? "Unknown Company";
  const logoUrl = job.company?.logo || "/precise_logo.jpeg";

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 cursor-pointer hover:border-2
                 hover:border-[#6096B4] hover:bg-[#f9fbfc] transition"
    >
      {/* Logo top-right */}
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className="absolute top-4 right-4 w-12 h-12 object-contain rounded"
        onError={(e) =>
          ((e.currentTarget as HTMLImageElement).src = "/precise_logo.jpeg")
        }
      />

      {/* Content with right padding */}
      <div className="pr-20">
        <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
        <p className="text-gray-600">{companyName}</p>
        <p className="text-sm text-gray-500">{job.location}</p>
        <p className="text-sm mt-2 text-gray-700 line-clamp-3">
          {job.description}
        </p>
      </div>
    </div>
  );
}
