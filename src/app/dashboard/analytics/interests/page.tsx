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
      .catch(() => toast.error("Gagal memuat data minat pelamar"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <h1 className="text-2xl font-bold">Applicant Interests</h1>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Total Applications</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.totalApplications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Visualisasi Minat Pelamar
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
