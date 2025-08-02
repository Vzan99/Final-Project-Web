"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { formatEmploymentType, formatJobCategory } from "./jobsFormatEnum";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

type Job = {
  id: string;
  title: string;
  location: string;
  bannerUrl?: string;
  jobCategory: string;
  employmentType: string;
  experienceLevel: string;
  jobType: string;
  status: string;
  deadline: string;
};

interface JobCardProps {
  job: Job;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export default function JobCard({
  job,
  onDelete,
  onPublish,
  onStatusChange,
}: JobCardProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden flex flex-col hover:shadow-md transition">
      <img
        src={getCloudinaryImageUrl(job.bannerUrl) || "/placeholder_banner.png"}
        alt="Job Banner"
        className="w-full h-40 object-cover"
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4">
        {/* Job Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">{job.title}</h2>
          <p className="text-sm text-[#4B5563]">{job.location}</p>
          <p className="text-sm text-[#6B7280] mt-1">
            {formatJobCategory(job.jobCategory)} • {job.experienceLevel} •{" "}
            {formatEmploymentType(job.employmentType)}
          </p>
          <p className="text-sm mt-2 text-[#9CA3AF]">
            <span className="font-medium">Status:</span>{" "}
            <span className="font-semibold">{job.status}</span> |{" "}
            <span className="font-medium">Deadline:</span>{" "}
            {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-col gap-2 sm:items-end">
          <button
            onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
            className="text-sm px-4 py-2 min-w-[100px] rounded-md bg-[#6096B4] text-white hover:bg-[#4d7a96] transition"
          >
            View
          </button>

          <button
            disabled={loadingAction === "delete"}
            onClick={async () => {
              if (!confirm("Are you sure you want to delete this job?")) return;

              try {
                setLoadingAction("delete");
                await API.delete(`/jobs/${job.id}`);
                toast.success("Job deleted successfully");
                onDelete?.(job.id);
              } catch (err: any) {
                toast.error(
                  err.response?.data?.message || "Failed to delete job"
                );
              } finally {
                setLoadingAction(null);
              }
            }}
            className="text-sm px-4 py-2 min-w-[100px] rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60"
          >
            {loadingAction === "delete" ? "Deleting..." : "Delete"}
          </button>

          {job.status === "DRAFT" && (
            <button
              disabled={loadingAction === "publish"}
              onClick={async () => {
                if (!confirm("Are you sure you want to publish this job?"))
                  return;

                try {
                  setLoadingAction("publish");
                  await API.patch(`/jobs/${job.id}/publish`, {
                    status: "PUBLISHED",
                  });
                  onStatusChange?.(job.id, "PUBLISHED");
                  toast.success("Job published");
                } catch (err: any) {
                  alert(err.response?.data?.message || "Failed to publish job");
                } finally {
                  setLoadingAction(null);
                }
              }}
              className="text-sm px-4 py-2 min-w-[100px] rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:opacity-60"
            >
              {loadingAction === "publish" ? "Publishing..." : "Publish"}
            </button>
          )}

          {job.status === "CLOSED" && (
            <button
              disabled={loadingAction === "archive"}
              onClick={async () => {
                if (!confirm("Are you sure you want to archive this job?"))
                  return;

                try {
                  setLoadingAction("archive");
                  await API.patch(`/jobs/${job.id}/publish`, {
                    status: "ARCHIVED",
                  });
                  onStatusChange?.(job.id, "ARCHIVED");
                  toast.success("Job archived");
                } catch (err: any) {
                  alert(err.response?.data?.message || "Failed to archive job");
                } finally {
                  setLoadingAction(null);
                }
              }}
              className="text-sm px-4 py-2 min-w-[100px] rounded-md bg-gray-600 text-white hover:bg-gray-700 transition disabled:opacity-60"
            >
              {loadingAction === "archive" ? "Archiving..." : "Archive"}
            </button>
          )}

          {job.status === "PUBLISHED" && (
            <button
              disabled={loadingAction === "close"}
              onClick={async () => {
                if (!confirm("Are you sure you want to close this job?"))
                  return;

                try {
                  setLoadingAction("close");
                  await API.patch(`/jobs/${job.id}/publish`, {
                    status: "CLOSED",
                  });
                  onStatusChange?.(job.id, "CLOSED");
                  toast.success("Job closed successfully");
                } catch (err: any) {
                  alert(err.response?.data?.message || "Failed to close job");
                } finally {
                  setLoadingAction(null);
                }
              }}
              className="text-sm px-4 py-2 min-w-[100px] rounded-md bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loadingAction === "close" ? "Closing..." : "Close"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
