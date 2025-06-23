"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number | null;
  deadline: string;
  experienceLevel: string;
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
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      API.get(`/jobs/${id}`)
        .then((res) => setJob(res.data.data))
        .catch(() => {
          toast.error("Failed to fetch job");
          router.push("/dashboard/jobs");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{job.title}</h1>

      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        <span className="bg-gray-100 px-2 py-1 rounded">
          Category: {job.category.name}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Level: {job.experienceLevel}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Type: {job.jobType}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          {job.isRemote ? "Remote" : "On-site"}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">
          Applicants: {job._count.applications}
        </span>
        <span
          className={`px-2 py-1 rounded text-white ${
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

      <p className="text-gray-800 whitespace-pre-line">{job.description}</p>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Salary:</strong>{" "}
          {job.salary ? `Rp${job.salary.toLocaleString()}` : "Not set"}
        </p>
        <p>
          <strong>Deadline:</strong> {job.deadline.slice(0, 10)}
        </p>
        <p>
          <strong>Pre-Selection Test:</strong>{" "}
          {job.hasTest ? "✅ Yes" : "❌ No"}
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit Job
        </button>

        <button
          onClick={() => router.push(`/dashboard/jobs/${job.id}/applicants`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Applicants
        </button>

        {job.hasTest && (
          <button
            onClick={() =>
              router.push(`/dashboard/jobs/${job.id}/pretest-editor`)
            }
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Edit Pre-Test
          </button>
        )}
      </div>
    </div>
  );
}
