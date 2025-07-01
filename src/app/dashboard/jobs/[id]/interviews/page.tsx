"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { InterviewItem } from "@/app/dashboard/interviews/page";
import InterviewListTable from "@/components/dashboard/interview/InterviewListTable";
import { toast } from "react-toastify";

export default function JobInterviewPage() {
  const { id: jobId } = useParams();
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const res = await API.get(`/interviews?jobId=${jobId}`);
      setInterviews(res.data.data);
    } catch (err) {
      toast.error("Gagal mengambil jadwal interview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchInterviews();
  }, [jobId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Interview untuk Job Ini</h1>

      <InterviewListTable data={interviews} onUpdated={fetchInterviews} />
    </div>
  );
}
