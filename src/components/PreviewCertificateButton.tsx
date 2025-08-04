"use client";

import { Button } from "@/components/ui/button";

type Props = {
  certificateId: string;
};

export const CertificateButtons = ({ certificateId }: Props) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/assessments/certificates/${certificateId}/preview`;

  const handlePreview = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil file");
      }

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch {
      alert("Gagal mengunduh sertifikat");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
      <Button onClick={handlePreview} variant="secondary">
        Preview Sertifikat
      </Button>
      <Button onClick={handleDownload}>Download Sertifikat</Button>
    </div>
  );
};
