"use client";

import { InterviewItem } from "@/app/dashboard/interviews/page";
import EditInterviewModal from "./EditInterviewModal";
import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";

interface Props {
  data: InterviewItem[];
  onUpdated: () => void;
}

export default function InterviewListCard({ data, onUpdated }: Props) {
  const [loadingId, setLoadingId] = useState<{
    id: string;
    type: string;
  } | null>(null);
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewItem | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview ?")) return;
    try {
      setLoadingId({ id, type: "delete" });
      await API.delete(`/interviews/${id}`);
      toast.success("Interview berhasil dihapus.");
      onUpdated();
    } catch {
      toast.error("Failed to delete interview.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "COMPLETED" | "CANCELLED"
  ) => {
    if (!confirm(`Change status to ${status}?`)) return;
    try {
      setLoadingId({ id, type: status.toLowerCase() });
      await API.patch(`/interviews/${id}/status`, { status });
      toast.success(`Status changed to ${status}`);
      onUpdated();
    } catch {
      toast.error("Failed to change status.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid gap-4">
      {data.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-6">
          No interview schedules available.
        </div>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3"
          >
            {/* User Info & Status */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.user.name}
                </p>
                <p className="text-xs text-gray-500">{item.user.email}</p>
              </div>
              <span className="mt-2 sm:mt-0 text-xs font-semibold uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded self-start sm:self-auto">
                {item.status}
              </span>
            </div>

            {/* Job, Date & Time, Location */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium text-gray-600">Job:</span>{" "}
                {item.job.title}
              </p>
              <p>
                <span className="font-medium text-gray-600">Date & Time:</span>{" "}
                {new Date(item.dateTime).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <span className="font-medium text-gray-600">Location:</span>{" "}
                {item.location || "-"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {!["COMPLETED", "CANCELLED"].includes(item.status) && (
                <button
                  onClick={() => setSelectedInterview(item)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-4 py-1 rounded-md transition"
                >
                  Edit
                </button>
              )}

              {["COMPLETED", "CANCELLED"].includes(item.status) && (
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={loadingId?.id === item.id}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1 rounded-md transition disabled:opacity-50"
                >
                  {loadingId?.id === item.id && loadingId?.type === "delete"
                    ? "Deleting..."
                    : "Delete"}
                </button>
              )}

              {!["COMPLETED", "CANCELLED"].includes(item.status) && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(item.id, "COMPLETED")}
                    disabled={loadingId?.id === item.id}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1 rounded-md transition disabled:opacity-50"
                  >
                    {loadingId?.id === item.id &&
                    loadingId?.type === "completed"
                      ? "Completing..."
                      : "Complete"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item.id, "CANCELLED")}
                    disabled={loadingId?.id === item.id}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-4 py-1 rounded-md transition disabled:opacity-50"
                  >
                    {loadingId?.id === item.id &&
                    loadingId?.type === "cancelled"
                      ? "Cancelling..."
                      : "Cancel"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {selectedInterview && (
        <EditInterviewModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdated={() => {
            setSelectedInterview(null);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
