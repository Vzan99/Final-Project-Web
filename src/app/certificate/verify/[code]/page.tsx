"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function CertificateVerificationPage() {
  const { code } = useParams();
  const [data, setData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;
    axios
      .get(`/certificate/verify/${code}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true));
  }, [code]);

  if (notFound)
    return (
      <div className="p-6 text-center text-red-600">
        Sertifikat tidak ditemukan atau tidak valid.
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center text-gray-500">
        Memuat informasi sertifikat...
      </div>
    );

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="p-6 max-w-xl mx-auto border rounded-lg bg-white shadow">
        <h1 className="text-2xl font-bold mb-4">Verifikasi Sertifikat</h1>

        <p className="mb-2">
          <strong>Nama:</strong> {data.user.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {data.user.email}
        </p>
        <p className="mb-2">
          <strong>Assessment:</strong> {data.assessment.name}
        </p>
        <p className="mb-2">
          <strong>Diterbitkan:</strong>{" "}
          {new Date(data.issuedAt).toLocaleDateString()}
        </p>

        {data.qrCodeUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">QR Code Sertifikat:</p>
            <img src={data.qrCodeUrl} alt="QR Code" className="h-32 w-32" />
          </div>
        )}

        {data.certificateUrl && (
          <a
            href={data.certificateUrl}
            className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat Sertifikat
          </a>
        )}
      </main>
    </ProtectedRoute>
  );
}
