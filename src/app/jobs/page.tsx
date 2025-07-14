"use client";

import { useEffect, useState, useCallback } from "react";
import API from "@/lib/axios";
import { JobCard } from "@/components/jobs/jobCard";
import { JobCardSkeleton } from "@/components/loadingSkeleton/jobCardSkeleton";
import { Pagination } from "@/components/pagination";
import JobSearchBar from "@/components/jobs/jobSearchBar";
import { JobDetailsCard } from "@/components/jobs/jobDetailsCard";
import { JobDetailsSkeleton } from "@/components/loadingSkeleton/jobDetailsSkeleton";
import { Job } from "@/types/jobs";

const PAGE_SIZE = 10;

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);

  const [filters, setFilters] = useState<{
    title: string;
    location: string;
    jobType: string;
    isRemote: boolean | null;
    classifications: string[];
    listingTime: string;
    customStartDate?: string;
    customEndDate?: string;
    sortBy: "createdAt" | "salary" | "relevance";
    sortOrder: "asc" | "desc";
  }>({
    title: "",
    location: "",
    jobType: "",
    isRemote: null,
    classifications: [],
    listingTime: "any",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchJobs = useCallback(
    async (filtersParams = filters, pageNumber = page) => {
      setLoading(true);
      try {
        const params: any = {
          ...filtersParams,
          page: pageNumber,
          pageSize: PAGE_SIZE,
        };

        if (filtersParams.classifications.length > 0) {
          params.classifications = filtersParams.classifications.join(",");
        }

        if (filtersParams.listingTime && filtersParams.listingTime !== "any") {
          const days = {
            today: 1,
            "3days": 3,
            "7days": 7,
            "14days": 14,
            "30days": 30,
            older: -1,
          }[filtersParams.listingTime];

          if (days !== undefined) {
            if (days > 0) {
              const sinceDate = new Date();
              sinceDate.setDate(sinceDate.getDate() - days);
              params.postedAfter = sinceDate.toISOString();
            } else if (days === -1) {
              const untilDate = new Date();
              untilDate.setDate(untilDate.getDate() - 30);
              params.postedBefore = untilDate.toISOString();
            }
          }
        }

        if (
          filtersParams.customStartDate &&
          filtersParams.customEndDate &&
          filtersParams.listingTime === "custom"
        ) {
          params.postedAfter = new Date(
            filtersParams.customStartDate
          ).toISOString();
          params.postedBefore = new Date(
            filtersParams.customEndDate
          ).toISOString();
        }

        // Sorting params
        params.sortBy = filtersParams.sortBy;
        params.sortOrder = filtersParams.sortOrder;

        const res = await API.get("/jobs/public", {
          params,
          withCredentials: false,
        });

        setJobs(res.data.jobs);
        setTotalJobs(res.data.total);
        setPage(pageNumber);

        setSelectedJob((prev) => {
          if (!prev) return null;
          return res.data.jobs.find((j: Job) => j.id === prev.id) ?? null;
        });
      } catch (err) {
        console.error("Error fetching public jobs:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, page]
  );

  useEffect(() => {
    fetchJobs(filters, 1);
  }, [fetchJobs, filters]);

  const handleSearch = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      fetchJobs(newFilters, 1);
    },
    [fetchJobs]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchJobs(filters, newPage);
    },
    [fetchJobs, filters]
  );

  const totalPages = Math.ceil(totalJobs / PAGE_SIZE);

  const handleJobClick = (job: Job) => {
    setLoadingJobDetails(true);
    setSelectedJob(null);

    setTimeout(() => {
      setSelectedJob(job);
      setLoadingJobDetails(false);
    }, 300);
  };

  return (
    <div className="flex flex-col px-4 lg:px-12 py-6 gap-6 max-w-7xl mx-auto">
      <JobSearchBar onSearch={handleSearch} />

      <div className="flex gap-6">
        {/* Left: Job List */}
        <div className="w-full md:w-2/5 h-[75vh] overflow-y-auto pr-2 border-r border-gray-200">
          {loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className={`cursor-pointer mb-4 ${
                  selectedJob?.id === job.id && !loadingJobDetails
                    ? "bg-[#f0f4f8]"
                    : ""
                }`}
              >
                <JobCard job={job} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No jobs found.</p>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Right: Job Details */}
        <div className="hidden md:block w-3/5 h-[75vh] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          {loadingJobDetails ? (
            <JobDetailsSkeleton />
          ) : selectedJob ? (
            <JobDetailsCard job={selectedJob} />
          ) : (
            <div className="text-gray-500 text-center pt-20">
              Select a job to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
