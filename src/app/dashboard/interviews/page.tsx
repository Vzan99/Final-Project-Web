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
      toast.error("Gagal mengambil data interview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter, sort, page]);

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-[#6096B4]">
          Interview Schedule
        </h1>
      </header>

      <div className="bg-white border rounded-lg shadow p-6 mb-6">
        {loading ? (
          <InterviewFormSkeleton />
        ) : (
          <CreateInterviewForm onCreated={fetchInterviews} />
        )}
      </div>

      {/* Filter + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">Semua Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="RESCHEDULED">Rescheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="dateTime_asc">Tanggal ↑</option>
          <option value="dateTime_desc">Tanggal ↓</option>
        </select>
      </div>

      {/* Table + Pagination */}
      <div className="bg-white border rounded-lg shadow p-6">
        {loading ? (
          <InterviewListSkeleton />
        ) : (
          <>
            <InterviewListTable data={interviews} onUpdated={fetchInterviews} />

            {/* Pagination */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-2 text-sm">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <button
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
