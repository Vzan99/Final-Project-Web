"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { JobCard } from "@/components/jobs/jobCard";
import { JobCardSkeleton } from "@/components/loadingSkeleton/jobCardSkeleton";
import { Pagination } from "@/components/pagination";
import JobSearchBar, { Filters } from "@/components/jobs/jobSearchBar";
import { JobDetailsCard } from "@/components/jobs/jobDetailsCard";
import { JobDetailsSkeleton } from "@/components/loadingSkeleton/jobDetailsSkeleton";
import { Job } from "@/types/jobs";
import { ArrowLeft } from "lucide-react";

const PAGE_SIZE = 10;

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    title: "",
    location: "",
    employmentType: [],
    isRemote: null,
    jobCategory: [],
    listingTime: "any",
    sortBy: "nearby",
    sortOrder: "desc",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchParams = (
    updatedFilters: Filters,
    pageNumber: number = 1
  ) => {
    const query = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else {
        query.append(key, value.toString());
      }
    });
    query.set("page", pageNumber.toString());
    router.push("/jobs?" + query.toString());
  };

  const fetchJobs = useCallback(
    async (filtersParams = filters, pageNumber = page) => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          ...filtersParams,
          page: pageNumber,
          pageSize: PAGE_SIZE,
        };

        if (filtersParams.employmentType?.length) {
          params.employmentType = filtersParams.employmentType.join(",");
        }
        if (filtersParams.jobCategory?.length) {
          params.jobCategory = filtersParams.jobCategory.join(",");
        }

        const daysMap: Record<string, number> = {
          today: 1,
          "3days": 3,
          "7days": 7,
          "14days": 14,
          "30days": 30,
          older: -1,
        };

        if (
          filtersParams.listingTime &&
          filtersParams.listingTime !== "any" &&
          filtersParams.listingTime !== "custom"
        ) {
          const days = daysMap[filtersParams.listingTime];
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
    const queryFilters: Filters & { lat?: number; lng?: number } = {
      title: searchParams.get("title") || "",
      location: searchParams.get("location") || "",
      employmentType: searchParams.getAll("employmentType") || [],
      isRemote: searchParams.get("isRemote")
        ? searchParams.get("isRemote") === "true"
        : null,
      jobCategory: searchParams.getAll("jobCategory") || [],
      listingTime: searchParams.get("listingTime") || "any",
      customStartDate: searchParams.get("customStartDate") || undefined,
      customEndDate: searchParams.get("customEndDate") || undefined,
      sortBy: (searchParams.get("sortBy") || "nearby") as Filters["sortBy"],
      sortOrder: (searchParams.get("sortOrder") ||
        "desc") as Filters["sortOrder"],
      lat: searchParams.get("lat")
        ? Number(searchParams.get("lat"))
        : undefined,
      lng: searchParams.get("lng")
        ? Number(searchParams.get("lng"))
        : undefined,
    };

    const pageQuery = parseInt(searchParams.get("page") || "1", 10);

    if (
      queryFilters.sortBy === "nearby" &&
      (!queryFilters.lat || !queryFilters.lng)
    ) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;

            const newFilters = {
              ...queryFilters,
              lat: userLat,
              lng: userLng,
            };

            const query = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                  value.forEach((v) => query.append(key, v));
                } else {
                  query.set(key, value.toString());
                }
              }
            });
            query.set("page", pageQuery.toString());

            router.replace("/jobs?" + query.toString());
          },
          (error) => {
            const fallbackFilters = {
              ...queryFilters,
              sortBy: "createdAt",
              lat: undefined,
              lng: undefined,
            };

            const query = new URLSearchParams();
            Object.entries(fallbackFilters).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                  value.forEach((v) => query.append(key, v));
                } else {
                  query.set(key, value.toString());
                }
              }
            });
            query.set("page", pageQuery.toString());

            router.replace("/jobs?" + query.toString());
          }
        );
        return;
      } else {
        const fallbackFilters = {
          ...queryFilters,
          sortBy: "createdAt",
          lat: undefined,
          lng: undefined,
        };

        const query = new URLSearchParams();
        Object.entries(fallbackFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => query.append(key, v));
            } else {
              query.set(key, value.toString());
            }
          }
        });
        query.set("page", pageQuery.toString());

        router.replace("/jobs?" + query.toString());
        return;
      }
    }

    setFilters(queryFilters);
    fetchJobs(queryFilters, pageQuery);
  }, [searchParams]);

  const handleSearch = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    updateSearchParams(newFilters, 1);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateSearchParams(filters, newPage);
    },
    [filters]
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

  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return isMobile;
  }

  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col px-4 lg:px-12 py-6 gap-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#6096B4]">Search Jobs</h1>

      <JobSearchBar onSearch={handleSearch} initialFilters={filters} />

      {isMobile ? (
        <>
          {selectedJob && !loadingJobDetails ? (
            <div className="h-[75vh] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm scrollbar-hide">
              <JobDetailsCard job={selectedJob} />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex items-center gap-1 text-sm text-[#6096B4] hover:text-[#517d98] font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to job list
                </button>
              </div>
            </div>
          ) : loadingJobDetails ? (
            <div className="h-[75vh] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <JobDetailsSkeleton />
            </div>
          ) : (
            <div className="h-[75vh] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job)}
                    className="cursor-pointer mb-4"
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
          )}
        </>
      ) : (
        <div className="flex gap-6">
          <div className="w-full md:w-2/5 h-[75vh] overflow-y-auto pr-2 border-r border-gray-200 scrollbar-hide">
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

          <div className="hidden md:block w-3/5 h-[75vh] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm scrollbar-hide">
            {loadingJobDetails ? (
              <JobDetailsSkeleton />
            ) : selectedJob ? (
              <JobDetailsCard job={selectedJob} />
            ) : (
              <div className="text-gray-500 text-center pt-20">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  No Job Selected
                </h2>
                <p className="text-sm text-gray-500">
                  Please select a job from the list to view detailed
                  information.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
