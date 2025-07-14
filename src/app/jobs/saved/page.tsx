"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { JobCard } from "@/components/jobs/jobCard";
import { JobCardSkeleton } from "@/components/loadingSkeleton/jobCardSkeleton";
import { Job } from "@/types/jobs";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await API.get<Job[]>("/jobs/saved");
        setSavedJobs(res.data || []);
      } catch (error) {
        console.error("Failed to load saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#6096B4]">Saved Jobs</h1>

      {loading ? (
        Array.from({ length: 5 }).map((_, idx) => <JobCardSkeleton key={idx} />)
      ) : savedJobs.length > 0 ? (
        <div className="grid gap-4">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven’t saved any jobs yet.</p>
      )}
    </div>
  );
}
