"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/lib/axios";

type Job = {
  id: string;
  title: string;
  location: string;
  category: {
    name: string;
  };
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
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await API.delete(`/jobs/${job.id}`);
      toast.success("Job deleted successfully");
      onDelete?.(job.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-[#274472]">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.location}</p>
          <p className="text-sm text-gray-500 mt-1">
            {job.category.name} • {job.experienceLevel} • {job.jobType}
          </p>
          <p className="text-sm mt-1 text-gray-400">
            Status: <strong>{job.status}</strong> | Deadline:{" "}
            {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            View
          </button>
          <button
            onClick={handleDelete}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
          {job.status === "DRAFT" && (
            <button
              onClick={() => onPublish?.(job.id)}
              className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Publish
            </button>
          )}
          {job.status === "CLOSED" && (
            <button
              onClick={async () => {
                try {
                  await API.patch(`/jobs/${job.id}/publish`, {
                    status: "ARCHIVED",
                  });
                  alert("Job archived");
                } catch (err: any) {
                  alert(err.response?.data?.message || "Failed to archive job");
                }
              }}
              className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Archive
            </button>
          )}
          {job.status === "PUBLISHED" && (
            <button
              onClick={async () => {
                try {
                  await API.patch(`/jobs/${job.id}/publish`, {
                    status: "CLOSED",
                  });
                  onStatusChange?.(job.id, "CLOSED");
                  alert("Job closed successfully");
                } catch (err: any) {
                  alert(err.response?.data?.message || "Failed to close job");
                }
              }}
              className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
