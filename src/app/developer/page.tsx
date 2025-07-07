"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";

interface DevOverviewData {
  totalSubscribers: number;
  totalAssessments: number;
  avgCompanyReviewRating: number;
  totalPendingSubscriptions: number;
}

export default function DeveloperDashboardPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [data, setData] = useState<DevOverviewData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user?.role !== "DEVELOPER") {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "DEVELOPER") {
      API.get("/analytics/developer-overview")
        .then((res) => setData(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingData(false));
    }
  }, [user]);

  if (loading || loadingData) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Developer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Total Subscribers</h3>
          <p className="text-xl">{data?.totalSubscribers}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Total Assessments</h3>
          <p className="text-xl">{data?.totalAssessments}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Pending Subscriptions</h3>
          <p className="text-xl">{data?.totalPendingSubscriptions}</p>
        </div>
        <div className="bg-white shadow rounded p-4 border">
          <h3 className="font-semibold">Avg Review Rating</h3>
          <p className="text-xl">
            {data?.avgCompanyReviewRating?.toFixed(1) ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
