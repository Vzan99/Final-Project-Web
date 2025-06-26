"use client";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/assessments/${id}/result`).then((res) => {
      setResult(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleDownloadCertificate = async () => {
    try {
      const res = await axios.get(
        `/certificate/download/${result.certificateId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificate-${result.badge || "Assessment"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal download sertifikat.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!result) return <p>No result found.</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hasil Assessment</h1>

      <p>
        Skor: <strong>{result.score}</strong>
      </p>
      <p>Status: {result.passed ? "✅ Lulus" : "❌ Tidak Lulus"}</p>

      {result.passed && result.certificateId && (
        <button
          onClick={handleDownloadCertificate}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          🎓 Download Sertifikat PDF
        </button>
      )}
    </main>
  );
}
