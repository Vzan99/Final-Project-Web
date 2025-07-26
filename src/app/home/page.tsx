"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobSearchBar from "@/components/jobs/jobSearchBar";
import SignInCardSection from "@/components/signInCardSection";
import Link from "next/link";
import type { Filters } from "@/components/jobs/jobSearchBar";
import API from "@/lib/axios";
import type { Job } from "@/types/jobs";

export default function HomePage() {
  const router = useRouter();

  const emptyFilters: Partial<Filters> = {
    title: "",
    location: "",
    jobType: "",
    isRemote: null,
    classifications: [],
    listingTime: "any",
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const [filters, setFilters] = useState<Partial<Filters>>(emptyFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const fetchLatestJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await API.get("/jobs/public", {
        params: { page: 1, pageSize: 8 },
        withCredentials: false,
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Failed to fetch latest jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchNearbyJobs = async (lat: number, lng: number) => {
    try {
      setLoadingJobs(true);
      const res = await API.get("/jobs/public", {
        params: { lat, lng, page: 1, pageSize: 8 },
        withCredentials: false,
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Failed to fetch nearby jobs:", err);
      fetchLatestJobs();
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    setFilters(emptyFilters);
    fetchLatestJobs();

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchNearbyJobs(latitude, longitude);
      },
      () => {
        console.warn("Geolocation denied or unavailable, showing latest jobs.");
      }
    );
  }, []);

  const handleSearch = (newFilters: Filters) => {
    setFilters(newFilters);

    const query = new URLSearchParams();

    if (newFilters.title) query.set("title", newFilters.title);
    if (newFilters.location) query.set("location", newFilters.location);
    if (newFilters.jobType) query.set("jobType", newFilters.jobType);
    if (newFilters.isRemote !== null)
      query.set("isRemote", String(newFilters.isRemote));
    if (newFilters.classifications.length > 0)
      query.set("classifications", newFilters.classifications.join(","));
    if (newFilters.listingTime)
      query.set("listingTime", newFilters.listingTime);
    if (newFilters.customStartDate)
      query.set("customStartDate", newFilters.customStartDate);
    if (newFilters.customEndDate)
      query.set("customEndDate", newFilters.customEndDate);
    if (newFilters.sortBy) query.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder) query.set("sortOrder", newFilters.sortOrder);

    router.push(`/jobs?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#EEE9DA] text-[#1a1a1a]">
      {/* Hero Section */}
      <section className="bg-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#6096B4]">
          Find Your Next <span className="text-[#1a1a1a]">Tech Job</span> Here
        </h1>
        <p className="text-lg md:text-xl mb-10 text-[#4B5563]">
          Explore opportunities from top tech companies. For developers,
          designers, and IT professionals.
        </p>

        <JobSearchBar onSearch={handleSearch} initialFilters={filters} />
      </section>
      <SignInCardSection />

      {/* Nearby or Latest Jobs Section */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>

          {loadingJobs ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs found.</p>
          ) : (
            <div className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-2">
              {jobs.map((job) => {
                const companyName =
                  job.company?.admin?.name ?? "Unknown Company";
                const logoUrl = job.company?.logo || "/precise_logo.jpeg";

                return (
                  <div
                    key={job.id}
                    className="flex-shrink-0 w-64 h-64 bg-white rounded-lg shadow-md border border-gray-200 p-4 relative hover:border-[#6096B4] hover:bg-[#f9fbfc] transition cursor-pointer"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    {/* Logo top-right */}
                    <img
                      src={logoUrl}
                      alt={`${companyName} logo`}
                      className="absolute top-4 right-4 w-12 h-12 object-contain rounded"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).src =
                          "/precise_logo.jpeg")
                      }
                    />

                    {/* Text content with right padding */}
                    <div className="pr-20">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{companyName}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                      <p className="text-sm mt-2 text-gray-700 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
