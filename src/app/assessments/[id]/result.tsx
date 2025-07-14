"use client";

import API from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/assessments/${id}/result`);
        setResult(res.data);
      } catch (err) {
        console.error("Failed to fetch assessment result", err);
        setError("Failed to fetch assessment result");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);

  const handleDownloadCertificate = async () => {
    try {
      const res = await API.get(
        `/certificate/download/${result.certificateId}`,
        { responseType: "blob" }
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!result) return <p className="p-6">No result found.</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hasil Assessment</h1>

      <p>
        Skor: <strong>{result.score}</strong>
      </p>
      <p>
        Status:{" "}
        <strong className={result.passed ? "text-green-600" : "text-red-600"}>
          {result.passed ? "Lulus" : "Tidak Lulus"}
        </strong>
      </p>

      {result.passed && result.certificateId ? (
        <button
          onClick={handleDownloadCertificate}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          🎓 Download Sertifikat PDF
        </button>
      ) : (
        result.passed && (
          <p className="mt-4 text-sm text-gray-500">
            Sertifikat belum tersedia. Silakan cek kembali nanti.
          </p>
        )
      )}
    </main>
  );
}
