"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import AdminJobDetailSkeleton from "@/components/dashboard/jobs/AdminJobDetailSkeleton";
import {
  formatEmploymentType,
  formatJobCategory,
} from "@/components/dashboard/jobs/jobsFormatEnum";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number | null;
  deadline: string;
  experienceLevel: string;
  jobCategory: string;
  employmentType: string;
  jobType: string;
  isRemote: boolean;
  hasTest: boolean;
  status: string;
  category: {
    name: string;
  };
  _count: {
    applications: number;
  };
}

export default function JobDetailPage() {
  const rawId = useParams().id as string;
  const id = rawId.slice(0, 36);
  const router = useRouter();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExistingTest, setHasExistingTest] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobRes = await API.get(`/jobs/${id}`);
        const jobData = jobRes.data.data;
        setJob(jobData);

        if (jobData.hasTest) {
          try {
            const testRes = await API.get(
              `/pre-selection-tests/admin/jobs/${id}/pre-selection-test`
            );
            const questions = testRes.data.data?.questions || [];
            setHasExistingTest(questions.length > 0);
          } catch (err) {
            setHasExistingTest(false);
          }
        }
      } catch (err) {
        toast.error("Failed to fetch job");
        router.push("/dashboard/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  if (loading) return <AdminJobDetailSkeleton />;
  if (!job)
    return <p className="text-center text-gray-600 mt-10">Job not found.</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#EEE9DA] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-[#6096B4]">{job.title}</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm font-medium transition"
          >
            ✏️ Edit Job
          </button>
          <button
            onClick={() => router.push(`/dashboard/jobs/${job.id}/applicants`)}
            className="bg-[#6096B4] text-white px-4 py-2 rounded hover:bg-[#4d7a96] text-sm font-medium transition"
          >
            👥 View Applicants
          </button>
          {job.hasTest && (
            <button
              onClick={() =>
                router.push(
                  `/dashboard/jobs/${job.id}/pre-selection-test${
                    hasExistingTest ? "/edit" : ""
                  }`
                )
              }
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-medium transition"
            >
              🧪 {hasExistingTest ? "Edit Pre-Test" : "Add Pre-Test"}
            </button>
          )}
        </div>
      </header>

      <div className="grid gap-6 bg-white p-6 rounded-xl shadow-md">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-[#EEE0C9] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
            {formatJobCategory(job.jobCategory)}
          </span>
          <span className="bg-[#EEE0C9] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
            {job.experienceLevel}
          </span>
          <span className="bg-[#EEE0C9] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
            {formatEmploymentType(job.employmentType)}
          </span>
          <span className="bg-[#EEE0C9] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
            {job.isRemote ? "Remote" : "On-site"}
          </span>
          <span className="bg-[#EEE0C9] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
            Applicants: {job._count.applications}
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-white font-medium ${
              job.status === "PUBLISHED"
                ? "bg-green-600"
                : job.status === "DRAFT"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
          <p>
            <strong>📍 Location:</strong> {job.location}
          </p>
          <p>
            <strong>💰 Salary:</strong>{" "}
            {job.salary ? `Rp${job.salary.toLocaleString()}` : "Not set"}
          </p>
          <p>
            <strong>📅 Deadline:</strong> {job.deadline.slice(0, 10)}
          </p>
          <p>
            <strong>🧪 Pre-Selection Test:</strong> {job.hasTest ? "Yes" : "No"}
          </p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Job Description
          </h3>
          <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm sm:text-base">
            {job.description}
          </p>
        </div>
      </div>
    </div>
  );
}
