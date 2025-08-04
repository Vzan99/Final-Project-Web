"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import ApplicantInterestsSkeleton from "@/components/dashboard/analytics/ApplicantInterestsSkeleton";

interface Interest {
  category: string;
  totalApplications: number;
}

export default function ApplicantInterestsPage() {
  const [data, setData] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/applicant-interests")
      .then((res) => setData(res.data.data))
      .catch(() => toast.error("Failed to load applicant interests"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-4 sm:p-6 bg-[#EEE9DA] min-h-screen space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#6096B4]">
          Applicant Interests
        </h1>
        <ApplicantInterestsSkeleton />
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen space-y-6 md:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#6096B4]">
        Applicant Interests
      </h1>

      {/* Tabel */}
      <div className="bg-white border rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-4">
          Applicant Interests Table
        </h2>
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-[#6096B4] text-white text-left">
            <tr>
              <th className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                Category
              </th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                Applications
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                  {item.category}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                  {item.totalApplications}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="bg-white border rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-4">
          Applicant Interests Visualisation
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={100}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="totalApplications" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
