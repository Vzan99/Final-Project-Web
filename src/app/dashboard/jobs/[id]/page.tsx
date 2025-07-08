"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import PreSelectionTestQuestionForm from "@/components/dashboard/pre-selection-test/PreSelectionTestQuestionForm";

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
  const rawId = useParams().id as string;
  const id = rawId.slice(0, 36);
  const router = useRouter();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);

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
    <div className="max-w-3xl space-y-6 bg-white p-6 rounded-xl shadow text-[#1a1a1a]">
      <h1 className="text-3xl font-bold text-[#274472]">{job.title}</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="bg-[#EEE9DA] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
          {job.category.name}
        </span>
        <span className="bg-[#EEE9DA] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
          {job.experienceLevel}
        </span>
        <span className="bg-[#EEE9DA] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
          {job.jobType}
        </span>
        <span className="bg-[#EEE9DA] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
          {job.isRemote ? "Remote" : "On-site"}
        </span>
        <span className="bg-[#EEE9DA] text-[#1a1a1a] px-3 py-1 rounded-xl font-medium">
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

      <p className="text-gray-800 whitespace-pre-line leading-relaxed">
        {job.description}
      </p>

      <div className="text-sm text-gray-700 space-y-1">
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

      <div className="flex flex-wrap gap-3 pt-4">
        <button
          onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          ✏️ Edit Job
        </button>

        <button
          onClick={() => router.push(`/dashboard/jobs/${job.id}/applicants`)}
          className="px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#4d7a96] transition"
        >
          👥 View Applicants
        </button>

        <button
          onClick={() => router.push(`/dashboard/jobs/${job.id}/interviews`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          📅 View Interviews
        </button>

        {job.hasTest && (
          <button
            onClick={() => setShowTestForm((prev) => !prev)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            {showTestForm ? "❌ Close Pre-Test Form" : "🧪 Add Pre-Test"}
          </button>
        )}
      </div>

      {job.hasTest && showTestForm && (
        <div className="mt-6">
          <PreSelectionTestQuestionForm />
        </div>
      )}
    </div>
  );
}
