"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import Spinner from "@/components/loadingSkeleton/spinner";

type CertificateData = {
  id?: string;
  issuedAt: string;
  qrCodeUrl?: string;
  certificateUrl?: string;
  user?: {
    name: string;
    email: string;
  };
  assessment?: {
    name: string;
  };
};

export default function CertificateVerificationPage() {
  const { code } = useParams();
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;

    axios
      .get(`/assessments/certificates/verify/${code}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Verifikasi Sertifikat</h1>

      {loading ? (
        <Spinner />
      ) : notFound ? (
        <p className="text-red-600 text-center">
          Sertifikat tidak ditemukan atau tidak valid.
        </p>
      ) : data ? (
        <div className="space-y-4 border p-6 rounded bg-white shadow">
          <p>
            <strong>Nama:</strong> {data.user?.name || "-"}
          </p>
          <p>
            <strong>Email:</strong> {data.user?.email || "-"}
          </p>
          <p>
            <strong>Assessment:</strong> {data.assessment?.name || "-"}
          </p>
          <p>
            <strong>Diterbitkan:</strong>{" "}
            {data.issuedAt
              ? new Date(data.issuedAt).toLocaleDateString()
              : "Tidak tersedia"}
          </p>

          {data.qrCodeUrl ? (
            <div>
              <p className="text-sm text-gray-500">QR Code Sertifikat:</p>
              <img
                src={data.qrCodeUrl}
                alt="QR Code"
                className="h-32 w-32 mt-1"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400">QR Code belum tersedia</p>
          )}

          <div className="flex gap-4 flex-wrap mt-4">
            {data.certificateUrl && (
              <a
                href={data.certificateUrl}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat Sertifikat
              </a>
            )}
            {data.id && (
              <a
                href={`/api/certificates/download/${data.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Gagal memuat data.</p>
      )}
    </main>
  );
}
