"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import AppliedJobsSkeleton from "@/components/loadingSkeleton/appliedJobsSkeleton";
import ProtectedRoute from "@/components/protectedRoute";
import { Pagination } from "@/components/pagination";

type Application = {
  id: string;
  status: "PENDING" | "REVIEWED" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  feedback?: string;
  job: {
    id: string;
    title: string;
    location: string;
    company: {
      admin?: {
        name: string;
      };
    };
  };
};

const statusSteps = ["PENDING", "REVIEWED", "INTERVIEW", "ACCEPTED"] as const;
const rejectedStep = "REJECTED";
type Status = (typeof statusSteps)[number] | typeof rejectedStep;

export default function AppliedJobsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [page, selectedStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (selectedStatus) {
        params.append("status", selectedStatus);
      }

      const res = await API.get<{ total: number; applications: Application[] }>(
        `/applications/user?${params.toString()}`,
        { withCredentials: true }
      );

      setApplications(res.data.applications);
      setTotal(res.data.total);
      setError(null);
    } catch {
      setError("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const tabStyles = (active: boolean) =>
    `whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
      active
        ? "bg-[#6096B4] text-white"
        : "bg-white border-gray-300 text-[#497187] hover:bg-gray-100"
    }`;

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      fallback={<AppliedJobsSkeleton />}
    >
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 h-full min-h-[70vh]">
        <h1 className="text-2xl font-bold text-[#497187] mb-4">Applied Jobs</h1>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedStatus(null);
                setPage(1);
              }}
              className={tabStyles(selectedStatus === null)}
            >
              All
            </button>

            {statusSteps.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setPage(1);
                }}
                className={tabStyles(selectedStatus === status)}
              >
                {status.toLowerCase()}
              </button>
            ))}

            <button
              onClick={() => {
                setSelectedStatus(rejectedStep);
                setPage(1);
              }}
              className={tabStyles(selectedStatus === rejectedStep)}
            >
              rejected
            </button>
          </div>
        </div>

        {/* Job List Card */}
        <section className="rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100">
          {loading ? (
            <AppliedJobsSkeleton />
          ) : error ? (
            <div className="px-6 py-8 text-center text-red-600">{error}</div>
          ) : applications.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-600">
              No applications found for{" "}
              <span className="font-semibold">
                {selectedStatus ? selectedStatus.toLowerCase() : "any status"}
              </span>
              .
            </div>
          ) : (
            applications.map((app) => {
              const job = app.job;
              const company = job.company?.admin?.name || "Unknown Company";

              return (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h2 className="text-lg font-bold text-[#497187]">
                        {job.title}
                      </h2>
                      <p className="text-gray-600">{company}</p>
                      <p className="text-gray-500 text-sm">{job.location}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 text-sm text-right space-y-1 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center">
                      <p className="capitalize">
                        <span className="font-medium text-gray-700">
                          Status:
                        </span>{" "}
                        <span className="text-gray-900">
                          {app.status.toLowerCase()}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Applied on{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {app.status === "REJECTED" && app.feedback && (
                    <p className="text-sm text-black mt-2">
                      <span className="font-medium">Feedback:</span>{" "}
                      {app.feedback}
                    </p>
                  )}

                  {app.status === "INTERVIEW" && (
                    <p className="text-sm text-black mt-2">
                      <span className="font-medium">Next step:</span> Please
                      check your email for your interview details.
                    </p>
                  )}

                  {app.status === "ACCEPTED" && (
                    <p className="text-sm text-green-700 mt-2">
                      <span className="font-medium"></span> Congratulations! You
                      have been accepted in this job!
                    </p>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* Pagination */}
        {!loading && total > pageSize && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={page}
              totalPages={Math.ceil(total / pageSize)}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
