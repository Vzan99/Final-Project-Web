"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";

interface OverviewData {
  userByRole: { role: string; total: number }[];
  totalActiveJobs: number;
  totalApplications: number;
  preSelectionAvgScore: number;
  skillAssessmentAvgScore: number;
}

export default function DashboardOverviewPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [data, setData] = useState<OverviewData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      API.get("/analytics/overview")
        .then((res) => setData(res.data.data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingData(false));
    }
  }, [user]);

  if (loading || loadingData) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <h1 className="text-3xl font-bold text-[#6096B4] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h3 className="text-[#4B5563] font-semibold mb-1">
            Total Active Jobs
          </h3>
          <p className="text-2xl font-bold text-[#1a1a1a]">
            {data?.totalActiveJobs}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h3 className="text-[#4B5563] font-semibold mb-1">
            Total Applications
          </h3>
          <p className="text-2xl font-bold text-[#1a1a1a]">
            {data?.totalApplications}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h3 className="text-[#4B5563] font-semibold mb-1">
            Avg Pre-Test Score
          </h3>
          <p className="text-2xl font-bold text-[#1a1a1a]">
            {data?.preSelectionAvgScore}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
          <h3 className="text-[#4B5563] font-semibold mb-1">
            Avg Assessment Score
          </h3>
          <p className="text-2xl font-bold text-[#1a1a1a]">
            {data?.skillAssessmentAvgScore}
          </p>
        </div>
      </div>
    </div>
  );
}
