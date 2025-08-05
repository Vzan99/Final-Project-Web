"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import InterviewListTable from "@/components/dashboard/interview/InterviewListTable";
import CreateInterviewForm from "@/components/dashboard/interview/CreateInterviewForm";
import InterviewListSkeleton from "@/components/dashboard/interview/InterviewListSkeleton";
import InterviewFormSkeleton from "@/components/dashboard/interview/InterviewFormSkeleton";

export interface InterviewItem {
  id: string;
  user: { name: string; email: string };
  job: { title: string };
  dateTime: string;
  location: string | null;
  status: string;
  notes: string | null;
}

export default function InterviewSchedulePage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sort, setSort] = useState<"dateTime_asc" | "dateTime_desc">(
    "dateTime_asc"
  );
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit] = useState<number>(5);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/interviews/all", {
        params: {
          status: statusFilter || undefined,
          sort,
          page,
          limit,
        },
      });
      setInterviews(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error("Failed to fetch interview data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter, sort, page]);

  return (
    <div className="p-4 sm:px-6 sm:py-8 bg-[#EEE9DA] min-h-screen space-y-6 overflow-x-hidden">
      <h1 className="text-xl sm:text-3xl font-bold text-[#6096B4] text-center sm:text-left">
        Interview Schedule
      </h1>

      {/* Create Form */}
      <div className="w-full px-4">
        {loading ? (
          <InterviewFormSkeleton />
        ) : (
          <div className="bg-white border rounded-xl shadow-lg p-6 sm:p-8 w-full">
            <CreateInterviewForm onCreated={fetchInterviews} />
          </div>
        )}
      </div>

      {/* Filter + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="w-full sm:w-auto border rounded px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="RESCHEDULED">Rescheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="w-full sm:w-auto border rounded px-3 py-2 text-sm"
        >
          <option value="dateTime_asc">Date ↑</option>
          <option value="dateTime_desc">Date ↓</option>
        </select>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white border rounded-lg shadow p-4 sm:p-6 overflow-x-auto max-w-full">
        {loading ? (
          <InterviewListSkeleton />
        ) : (
          <>
            <InterviewListTable data={interviews} onUpdated={fetchInterviews} />

            {/* Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
              <div>
                Page {page} of {Math.ceil(total / limit)}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  First
                </button>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  disabled={page >= Math.ceil(total / limit)}
                  onClick={() => setPage(Math.ceil(total / limit))}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
