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
      .catch(() => toast.error("Gagal memuat salary trends"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  // Label gabungan untuk chart
  const chartData = trends.map((t) => ({
    name: `${t.title} (${t.location})`,
    averageSalary: t.averageSalary,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <h1 className="text-2xl font-bold">Salary Trends</h1>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Average Salary</th>
              <th className="px-4 py-2">Applicants</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2">{item.location}</td>
                <td className="px-4 py-2">
                  Rp{item.averageSalary.toLocaleString()}
                </td>
                <td className="px-4 py-2">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Visualisasi Rata-rata Salary
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={100}
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
  );
}
