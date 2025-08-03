"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobSearchBar from "@/components/jobs/jobSearchBar";
import SignInCardSection from "@/components/signInCardSection";
import type { Filters } from "@/components/jobs/jobSearchBar";
import API from "@/lib/axios";
import type { Job } from "@/types/jobs";
import FeaturedJobsCardSkeleton from "@/components/loadingSkeleton/featuredJobsCardSkeleton";
import HomePageSkeleton from "@/components/loadingSkeleton/homePageSkeleton";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const emptyFilters: Partial<Filters> = {
    title: "",
    location: "",
    employmentType: [],
    isRemote: null,
    jobCategory: [],
    listingTime: "any",
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const [filters, setFilters] = useState<Partial<Filters>>(emptyFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isNearby, setIsNearby] = useState(false);

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

      if (res.data.jobs.length > 0) {
        setJobs(res.data.jobs);
        setIsNearby(true);
      }
    } catch (err) {
      console.error("Failed to fetch nearby jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    setFilters(emptyFilters);
    fetchLatestJobs();

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        localStorage.setItem("userLat", latitude.toString());
        localStorage.setItem("userLng", longitude.toString());

        fetchNearbyJobs(latitude, longitude);
      },
      () => {
        console.warn("Geolocation denied or unavailable.");
      }
    );
  }, []);

  const handleSearch = (filters: Filters) => {
    const queryParams = new URLSearchParams();

    if (filters.title) queryParams.append("title", filters.title);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.employmentType.length)
      filters.employmentType.forEach((type) =>
        queryParams.append("employmentType", type)
      );
    if (filters.jobCategory.length)
      filters.jobCategory.forEach((cat) =>
        queryParams.append("jobCategory", cat)
      );
    if (filters.isRemote !== null)
      queryParams.append("isRemote", String(filters.isRemote));
    if (filters.listingTime)
      queryParams.append("listingTime", filters.listingTime);
    if (filters.customStartDate)
      queryParams.append("customStartDate", filters.customStartDate);
    if (filters.customEndDate)
      queryParams.append("customEndDate", filters.customEndDate);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

    router.push(`/jobs?${queryParams.toString()}`);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return loadingJobs ? (
    <HomePageSkeleton />
  ) : (
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

      {/* Nearby or Featured Jobs Section */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            {isNearby ? "Nearby Jobs" : "Featured Jobs"}
          </h2>

          {loadingJobs ? (
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <FeaturedJobsCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500">No jobs found.</p>
          ) : (
            <div className="relative flex items-center">
              {/* Left scroll button */}
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Scroll container */}
              <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide py-2 px-10"
                style={{ scrollBehavior: "smooth" }}
              >
                {jobs.map((job) => {
                  const companyName =
                    job.company?.admin?.name ?? "Unknown Company";
                  const logoUrl =
                    getCloudinaryImageUrl(job.company?.logo, {
                      width: 80,
                      height: 80,
                      crop: "fill",
                    }) ?? "/precise_logo.jpeg";

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

              {/* Right scroll button */}
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
