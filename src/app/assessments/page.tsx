"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/axios";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";

type Assessment = {
  id: string;
  name: string;
  description?: string;
  timeLimit: number;
};

export default function UserAssessmentListPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/assessments")
      .then((res) => setAssessments(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError(
            "Fitur ini hanya tersedia untuk user dengan subscription aktif."
          );
        } else {
          setError("Gagal memuat data assessment.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Daftar Assessment</h1>

        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : assessments.length === 0 ? (
          <p className="text-gray-600">Belum ada assessment tersedia.</p>
        ) : (
          <ul className="space-y-4">
            {assessments.map((a) => (
              <li
                key={a.id}
                className="border border-gray-200 rounded p-4 shadow bg-white"
              >
                <h2 className="text-lg font-semibold">{a.name}</h2>
                <p className="text-sm text-gray-600">
                  {a.description || "Tanpa deskripsi"}
                </p>
                <p className="text-sm text-gray-500">
                  Batas Waktu: {a.timeLimit} menit
                </p>
                <Link
                  href={`/assessments/${a.id}`}
                  className="inline-block mt-2 text-blue-600 font-medium hover:underline"
                >
                  Mulai Assessment →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </ProtectedRoute>
  );
}
