"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/axios";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";

type AssessmentResult = {
  score: number;
  passed: boolean;
  certificateId?: string;
};

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!id) return;
    API.get(`/assessments/${id}/result`)
      .then((res) => setResult(res.data))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="min-h-screen bg-gray-50 flex justify-center pt-20 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Hasil Assessment
          </h1>

          {loading ? (
            <Spinner />
          ) : !result ? (
            <p className="text-red-600 font-medium">
              Hasil assessment tidak ditemukan atau gagal dimuat.
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Skor:</strong> {result.score}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={result.passed ? "text-green-600" : "text-red-600"}
                >
                  {result.passed ? "Lulus" : "Tidak Lulus"}
                </span>
              </p>

              {result.passed && result.certificateId && (
                <a
                  href={`${baseUrl}/certificates/download/${result.certificateId}`}
                  download
                  className="inline-block mt-6 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🎓 Download Sertifikat
                </a>
              )}
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
