"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import Link from "next/link";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";

type HistoryItem = {
  id: string;
  assessmentId: string;
  assessmentName: string;
  score: number;
  passed: boolean;
};

export default function MyAssessmentHistoryPage() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/assessments/me/assessments")
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Riwayat Assessment Saya</h1>

        {loading ? (
          <Spinner />
        ) : data.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat assessment.</p>
        ) : (
          <ul className="space-y-4">
            {data.map((item) => (
              <li
                key={item.id}
                className="p-4 border rounded bg-white shadow-sm hover:shadow transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.assessmentName}</p>
                    <p className="text-sm text-gray-600">
                      Skor: {item.score} —{" "}
                      <span
                        className={
                          item.passed ? "text-green-600" : "text-red-600"
                        }
                      >
                        {item.passed ? "Lulus" : "Tidak Lulus"}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/assessments/${item.assessmentId}/result`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lihat Hasil →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </ProtectedRoute>
  );
}
