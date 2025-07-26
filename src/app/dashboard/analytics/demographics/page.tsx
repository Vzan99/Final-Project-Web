"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { DemographicsSkeleton } from "@/components/dashboard/analytics/DemographicsSkeleton";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a28cf5"];

export default function UserDemographicsPage() {
  const [data, setData] = useState<{
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    API.get("/analytics/user-demographics")
      .then((res) => setData(res.data.data))
      .catch(() => toast.error("Gagal memuat data demografi"));
  }, []);

  if (!data) {
    return (
      <div className="p-6 bg-[#EEE9DA] min-h-screen space-y-8">
        <h1 className="text-3xl font-bold text-[#6096B4]">User Demographics</h1>
        <DemographicsSkeleton />
        <DemographicsSkeleton />
        <DemographicsSkeleton />
      </div>
    );
  }

  const ageData = Object.entries(data.ageGroups).map(([age, value]) => ({
    name: age,
    value,
  }));

  const genderData = Object.entries(data.gender).map(([gender, value]) => ({
    name: gender,
    value,
  }));

  const locationData = Object.entries(data.location).map(([loc, value]) => ({
    name: loc,
    value,
  }));

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-[#6096B4]">User Demographics</h1>

      {/* Age Chart */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
          Kelompok Usia
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gender Chart */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Gender</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {genderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Location Chart */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
          Lokasi Pengguna
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
