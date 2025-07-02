"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import ProtectedRoute from "@/components/protectedRoute";
import API from "@/lib/axios";
import Link from "next/link";

type JobApplication = {
  id: string;
  job: {
    id: string;
    title: string;
    company: {
      name: string;
    };
    location: string;
  };
  status: string;
  appliedAt: string;
};

export default function AppliedJobsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppliedJobs() {
      try {
        const res = await API.get("/jobs/applied", { withCredentials: true });
        setApplications(res.data.data);
      } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchAppliedJobs();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute
        allowedRoles={["USER"]}
        requireVerified
        fallback={<div>Loading...</div>}
      >
        <div className="p-4">Loading applied jobs...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["USER"]} requireVerified>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6 text-[#6096B4]">
          Applied Jobs
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-600">You haven't applied for any jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li
                key={app.id}
                className="p-4 bg-white rounded-xl shadow border border-[#eee]"
              >
                <h2 className="text-lg font-semibold text-[#497187]">
                  {app.job.title}
                </h2>
                <p className="text-gray-600">
                  {app.job.company.name} — {app.job.location}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-medium">{app.status}</span> |
                  Applied at: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/jobs/${app.job.id}`}
                  className="mt-2 inline-block text-sm text-[#6096B4] hover:underline"
                >
                  View Job
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
