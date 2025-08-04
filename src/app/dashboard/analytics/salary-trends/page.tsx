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
import SalaryTrendsSkeleton from "@/components/dashboard/analytics/SalaryTrendsSkeleton";

interface SalaryTrend {
  title: string;
  location: string;
  averageSalary: number;
  count: number;
}

export default function SalaryTrendsPage() {
  const [trends, setTrends] = useState<SalaryTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/salary-trends")
      .then((res) => setTrends(res.data.data))
      .catch(() => toast.error("Failed to load salary trends"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen space-y-6 md:space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#6096B4]">
          Salary Trends
        </h1>
        <SalaryTrendsSkeleton />
      </div>
    );

  const chartData = trends.map((t) => ({
    name: `${t.title} (${t.location})`,
    averageSalary: t.averageSalary,
  }));

  return (
    <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen space-y-6 md:space-y-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#6096B4]">
        Salary Trends
      </h1>

      {/* Tabel Salary */}
      <div className="bg-white border rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-4">
          Average Salary Table
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full sm:table-auto text-xs sm:text-sm min-w-0">
            <thead className="bg-[#6096B4] text-white text-left">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Job Title</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Location</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Average Salary</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{item.title}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{item.location}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">
                    Rp{item.averageSalary.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Salary */}
      <div className="bg-white border rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-4">
          Average Salary Visualisation
        </h2>
        <div className="overflow-x-auto">
          <div className="w-full sm:w-[600px] mx-auto">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `Rp${value.toLocaleString()}`}
                />
                <Bar dataKey="averageSalary" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
