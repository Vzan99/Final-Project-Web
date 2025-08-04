"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import DashboardOverviewSkeleton from "@/components/dashboard/DashboardOverviewSkeleton";
import { toast } from "react-toastify";

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
        .catch((err) => {
          toast.error("Failed to fetch overview data");
          console.error(err);
        })
        .finally(() => setLoadingData(false));
    }
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#6096B4] mb-6 md:mb-8">
          Admin Dashboard
        </h1>
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Active Jobs",
      value: data?.totalActiveJobs,
    },
    {
      title: "Total Applications",
      value: data?.totalApplications,
    },
    {
      title: "Average Pre-Test Score",
      value: data?.preSelectionAvgScore,
    },
    {
      title: "Average Assessment Score",
      value: data?.skillAssessmentAvgScore,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-[#6096B4] mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-[#4B5563] font-semibold mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-[#1a1a1a]">
              {card.value ?? "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
