"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import API from "@/lib/axios";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";
import { CertificateButtons } from "@/components/PreviewCertificateButton";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, RotateCw } from "lucide-react";

type AssessmentResult = {
  score: number | null;
  passed: boolean | null;
  certificateId?: string | null;
  totalAttempts: number;
  maxAllowedAttempts: number;
  assessmentTitle?: string;
};

export default function AssessmentResultPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    API.get(`/assessments/${id}/result`)
      .then((res) => setResult(res.data))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isRetakeAllowed =
    result &&
    result.passed === false &&
    (result.maxAllowedAttempts === Infinity ||
      result.totalAttempts < result.maxAllowedAttempts);

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {result?.assessmentTitle || "Hasil Assessment"}
            </h1>
            <p className="text-indigo-100 mt-1">
              {result?.passed !== null
                ? "Berikut hasil pengerjaan Anda"
                : "Memuat hasil assessment"}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner />
                <p className="mt-4 text-gray-600">Memuat hasil...</p>
              </div>
            ) : !result ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  Hasil Tidak Ditemukan
                </h2>
                <p className="mt-2 text-gray-600">
                  Hasil assessment tidak ditemukan atau gagal dimuat.
                </p>
                <Link
                  href="/assessments"
                  className="inline-flex mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Kembali ke Daftar Assessment
                </Link>
              </div>
            ) : (
              <>
                {/* Status kelulusan */}
                <div
                  className={`flex items-center justify-center gap-3 p-4 rounded-lg ${
                    result.passed === true
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {result.passed === true ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <span className="text-lg font-semibold">
                    {result.passed ? "Lulus" : "Tidak Lulus"}
                  </span>
                </div>

                {/* Nilai */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                  <span className="text-gray-700 font-medium">Skor:</span>
                  <span className="text-indigo-600 text-xl font-bold">
                    {result.score ?? "-"}
                  </span>
                </div>

                {/* Sertifikat */}
                {result.passed && result.certificateId && (
                  <CertificateButtons certificateId={result.certificateId} />
                )}

                {/* Info jika tidak lulus */}
                {!result.passed && (
                  <p className="text-sm text-gray-500 text-center">
                    Percobaan ke-{result.totalAttempts} dari{" "}
                    {result.maxAllowedAttempts === Infinity
                      ? "∞"
                      : result.maxAllowedAttempts}
                  </p>
                )}

                {/* Tes Ulang */}
                {isRetakeAllowed && (
                  <Link
                    href={`/assessments/${id}`}
                    className="flex justify-center items-center gap-2 w-full px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                  >
                    <RotateCw className="h-5 w-5" />
                    <span>Tes Ulang</span>
                  </Link>
                )}

                {/* Kembali */}
                <Link
                  href="/assessments"
                  className="block text-center text-indigo-600 hover:text-indigo-800 font-medium text-sm mt-2"
                >
                  ← Kembali ke Daftar Assessment
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </ProtectedRoute>
  );
}
