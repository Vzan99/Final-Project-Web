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
      .catch(() => toast.error("Failed to load demographic data"));
  }, []);

  if (!data) {
    return (
      <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen space-y-6 md:space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#6096B4]">
          User Demographics
        </h1>
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
    <div className="p-4 md:p-6 bg-[#EEE9DA] min-h-screen space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#6096B4]">
        User Demographics
      </h1>

      {/* Age Chart */}
      <div className="bg-white border rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-[#1a1a1a] mb-3 md:mb-4">
          Age Group
        </h2>
        <div className="w-full h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gender Chart */}
      <div className="bg-white border rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-[#1a1a1a] mb-3 md:mb-4">
          Gender
        </h2>
        <div className="w-full h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
      </div>

      {/* Location Chart */}
      <div className="bg-white border rounded-lg shadow p-4 md:p-6 overflow-x-auto">
        <h2 className="text-base md:text-lg font-semibold text-[#1a1a1a] mb-3 md:mb-4">
          User Location
        </h2>
        <div className="w-full h-[250px] md:h-[300px] min-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
}
