"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import Link from "next/link";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";
import { Pagination } from "@/components/pagination";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setLoading(true);
    API.get("/assessments/me/assessments", { params: { page, pageSize } })
      .then((res) => {
        const items = res.data.assessments || res.data || [];
        setData(items);
        const total = res.data.total ?? items.length;
        setTotalPages(Math.ceil(total / pageSize));
      })

      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Riwayat Assessment</h1>
          <Link
            href="/assessments"
            className="text-sm text-blue-600 hover:underline"
          >
            Kembali ke Daftar →
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : data.length === 0 ? (
          <p className="text-gray-500">Belum ada riwayat assessment.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {data.map((item) => (
                <li
                  key={item.id}
                  className="p-4 border rounded-lg bg-white shadow-sm hover:shadow transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.assessmentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Skor:{" "}
                        <span className="text-indigo-600 font-medium">
                          {item.score}
                        </span>{" "}
                        —{" "}
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
