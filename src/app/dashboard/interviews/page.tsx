"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import InterviewListTable from "@/components/dashboard/interview/InterviewListTable";
import CreateInterviewForm from "@/components/dashboard/interview/CreateInterviewForm";

export interface InterviewItem {
  id: string;
  user: {
    name: string;
    email: string;
  };
  job: {
    title: string;
  };
  dateTime: string;
  location: string | null;
  status: string;
  notes: string | null;
}

export default function InterviewSchedulePage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await API.get("/interviews/all");
      setInterviews(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data interview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-[#6096B4]">
          Interview Schedule
        </h1>
      </header>

      {/* ✅ Form untuk menambah interview baru */}
      <div className="bg-white border rounded-lg shadow p-6 mb-6">
        <CreateInterviewForm onCreated={fetchInterviews} />
      </div>

      {/* ✅ Tabel daftar interview */}
      <div className="bg-white border rounded-lg shadow p-6">
        <InterviewListTable data={interviews} onUpdated={fetchInterviews} />
      </div>
    </div>
  );
}
