"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

import API from "@/lib/axios";
import { useAppSelector } from "@/lib/redux/hooks";
import JobCard from "@/components/dashboard/jobs/JobCard";
import AdminJobCardSkeleton from "@/components/dashboard/jobs/AdminJobSkeleton";

interface Job {
  id: string;
  title: string;
  status: string;
  location: string;
  salary: number | null;
  deadline: string;
  experienceLevel: string;
  jobType: string;
  jobCategory: string;
  employmentType: string;
  bannerUrl?: string;
  category: {
    name: string;
  };
}

export default function JobManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAppSelector((state) => state.auth);

  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialTitle = searchParams.get("title") || "";
  const initialStatus = searchParams.get("status") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: initialTitle,
    status: initialStatus,
    page: initialPage,
    limit: 5,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    lastPage: 1,
  });

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchJobs();
  }, [user, filters]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/jobs", { params: filters });
      const { jobs: data, total, lastPage } = res.data;

      setJobs(Array.isArray(data) ? data : []);
      setPagination({ total, lastPage });
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
      setPagination({ total: 0, lastPage: 1 });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await API.patch(`/jobs/${id}/publish`);
      toast.success("Job published successfully");
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish job");
    }
  };

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const debounceTitleSearch = debounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTitle = params.get("title") || "";

    if (currentTitle === value.trim()) return;
    setFilters((prev) => ({ ...prev, title: value, page: 1 }));

    params.set("page", "1");
    if (value.trim()) {
      params.set("title", value);
    } else {
      params.delete("title");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 500);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debounceTitleSearch(value);
  };

  useEffect(() => {
    return () => {
      debounceTitleSearch.cancel(); // cleanup
    };
  }, []);

  const changePage = (direction: "next" | "prev") => {
    const newPage =
      direction === "next" ? filters.page + 1 : Math.max(1, filters.page - 1);
    setFilters((prev) => ({ ...prev, page: newPage }));

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const changePageTo = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const isInitialLoading = loading || (isLoading && jobs.length === 0);

  if (isInitialLoading) {
    return (
      <div className="p-6 bg-[#EEE9DA] min-h-screen">
        <h1 className="text-3xl font-bold text-[#6096B4] mb-6">
          Job Management
        </h1>
        <section className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <AdminJobCardSkeleton key={i} />
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-[#6096B4]">Job Management</h1>
        <Link
          href="/dashboard/jobs/create"
          className="bg-[#6096B4] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#4d7a96] transition font-medium"
        >
          + Create Job
        </Link>
      </header>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="title"
          defaultValue={filters.title}
          onChange={handleTitleChange}
          placeholder="Search by title"
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-auto"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleStatusFilterChange}
          className="border border-gray-300 px-3 py-2 rounded-md text-sm w-full sm:w-auto"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="CLOSED">Closed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Pagination Info */}
      <p className="text-sm text-gray-600 mb-4">
        Showing page {filters.page} of {pagination.lastPage} — Total{" "}
        {pagination.total} jobs
      </p>

      {/* Job List */}
      <section className="grid gap-4">
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleDelete}
              onPublish={handlePublish}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </section>

      {/* Pagination Controls */}
      <nav className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          onClick={() => changePageTo(1)}
          disabled={filters.page === 1}
          className="px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          First
        </button>

        <button
          onClick={() => changePage("prev")}
          disabled={filters.page === 1}
          className="px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 border rounded bg-[#EEE0C9] text-sm text-[#1a1a1a] font-medium">
          Page {filters.page} of {pagination.lastPage}
        </span>

        <button
          onClick={() => changePage("next")}
          disabled={filters.page >= pagination.lastPage}
          className="px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={() => changePageTo(pagination.lastPage)}
          disabled={filters.page >= pagination.lastPage}
          className="px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Last
        </button>
      </nav>
    </div>
  );
}
