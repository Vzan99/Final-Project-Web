"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import { useAppSelector } from "@/lib/redux/hooks";
import JobCard from "@/components/dashboard/jobs/JobCard";
import Link from "next/link";
import { toast } from "react-toastify";

interface Job {
  id: string;
  title: string;
  status: string;
  location: string;
  salary: number | null;
  deadline: string;
  experienceLevel: string;
  jobType: string;
  category: {
    name: string;
  };
}

export default function JobManagementPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [query, setQuery] = useState({
    title: "",
    status: "",
    page: 1,
    limit: 5,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    lastPage: 1,
  });

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await API.get("/jobs/", { params: query });

      const jobList = res.data?.jobs;
      const total = res.data?.total;
      const lastPage = res.data?.lastPage;

      if (Array.isArray(jobList)) {
        setJobs(jobList);
        setPagination({ total, lastPage });
      } else {
        console.warn("Unexpected jobs response:", res.data);
        setJobs([]);
        setPagination({ total: 0, lastPage: 1 });
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setPagination({ total: 0, lastPage: 1 });
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchJobs();
    }
  }, [user, query]);

  const handlePublish = async (id: string) => {
    try {
      await API.patch(`/jobs/${id}/publish`, { status: "PUBLISHED" });
      toast.success("Job published successfully");
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish job");
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

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (direction: "next" | "prev") => {
    setQuery((prev) => ({
      ...prev,
      page: direction === "next" ? prev.page + 1 : Math.max(1, prev.page - 1),
    }));
  };

  if (loading || loadingJobs) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Job Management</h1>
        <Link
          href="/dashboard/jobs/create"
          className="bg-[#6096B4] text-white px-4 py-2 rounded text-sm"
        >
          + Create Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="title"
          value={query.title}
          onChange={handleFilterChange}
          placeholder="Search by title"
          className="border px-3 py-1 rounded text-sm"
        />

        <select
          name="status"
          value={query.status}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded text-sm"
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
        Showing page {query.page} of {pagination.lastPage} — Total{" "}
        {pagination.total} jobs
      </p>

      {/* Job List */}
      <div className="grid gap-4">
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
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={query.page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1 border rounded bg-gray-100 text-sm">
          Page {query.page} of {pagination.lastPage}
        </span>

        <button
          onClick={() => handlePageChange("next")}
          disabled={query.page >= pagination.lastPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
