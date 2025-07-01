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
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Total Active Jobs</h3>
          <p className="text-xl">{data?.totalActiveJobs}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Total Applications</h3>
          <p className="text-xl">{data?.totalApplications}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Avg Pre-Test Score</h3>
          <p className="text-xl">{data?.preSelectionAvgScore}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Avg Assessment Score</h3>
          <p className="text-xl">{data?.skillAssessmentAvgScore}</p>
        </div>
      </div>
    </div>
  );
}
