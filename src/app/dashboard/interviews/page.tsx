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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Interview Schedule</h1>

      {/* ✅ Tambahkan form pembuatan interview di sini */}
      <CreateInterviewForm onCreated={fetchInterviews} />

      {/* ✅ Tampilkan daftar interview di bawah form */}
      <InterviewListTable data={interviews} onUpdated={fetchInterviews} />
    </div>
  );
}
