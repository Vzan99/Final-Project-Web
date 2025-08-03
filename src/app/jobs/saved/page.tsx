"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Job } from "@/types/jobs";
import { Bookmark, BookmarkCheck, Send } from "lucide-react";
import SavedJobsSkeleton from "@/components/loadingSkeleton/savedjobsSkeleton";
import ProtectedRoute from "@/components/protectedRoute";
import SocialShare from "@/components/socialShare";
import { toast } from "react-toastify";
import { Pagination } from "@/components/pagination";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await API.get("/jobs/saved/paginated", {
          params: { page, pageSize },
        });
        setSavedJobs(res.data.jobs || []);
        setTotal(res.data.total || 0);
      } catch (error) {
        console.error("Failed to load saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page]);

  const toggleSave = async (job: Job) => {
    const isSaved = savedJobs.some((j) => j.id === job.id);

    try {
      if (isSaved) {
        await API.delete(`/jobs/${job.id}/save`);
        setSavedJobs((prev) => prev.filter((j) => j.id !== job.id));
        toast.info("Job removed from saved list");
      } else {
        await API.post(`/jobs/${job.id}/save`);
        setSavedJobs((prev) => [...prev, job]);
        toast.success("Job saved successfully");
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      fallback={<SavedJobsSkeleton />}
    >
      <div className="max-w-screen-lg mx-auto px-4 py-8 h-full min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-6 text-[#6096B4]">Saved Jobs</h1>

        {loading ? (
          <SavedJobsSkeleton />
        ) : savedJobs.length > 0 ? (
          <>
            <div className="grid gap-4">
              {savedJobs.map((job) => {
                const companyName =
                  job.company?.admin?.name ?? "Unknown Company";

                return (
                  <div
                    key={job.id}
                    className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        router.push(`/jobs/${job.id}`);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-[#6096B4]">
                          {job.title}
                        </h2>
                        <p className="text-gray-600">{companyName}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(job);
                          }}
                          title="Toggle save"
                          className={`p-2 rounded-full transition ${
                            savedJobs.some((j) => j.id === job.id)
                              ? "bg-[#6096B4]/20 text-[#6096B4]"
                              : "hover:bg-gray-100"
                          }`}
                          aria-label="Toggle save job"
                        >
                          {savedJobs.some((j) => j.id === job.id) ? (
                            <BookmarkCheck size={20} />
                          ) : (
                            <Bookmark size={20} />
                          )}
                        </button>

                        <SocialShare
                          url={`${
                            typeof window !== "undefined"
                              ? window.location.origin
                              : ""
                          }/jobs/${job.id}`}
                          title={`Check out this job: ${job.title} at ${companyName}`}
                        />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/jobs/${job.id}`);
                          }}
                          title="Apply now"
                          className="text-gray-600 hover:text-green-600 transition"
                          aria-label="Apply now"
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!loading && total > pageSize && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={page}
                  totalPages={Math.ceil(total / pageSize)}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">You haven’t saved any jobs yet.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
