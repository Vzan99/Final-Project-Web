"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";

export default function AssessmentEntryPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const checkResult = async () => {
      try {
        const res = await API.get(`/assessments/${id}/result`);
        const hasScore = res.data?.score !== undefined;

        router.replace(
          hasScore ? `/assessments/${id}/result` : `/assessments/${id}/detail`
        );
      } catch {
        router.replace(`/assessments/${id}/detail`);
      }
    };

    checkResult();
  }, [id, router]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-gray-600">Memuat halaman assessment...</p>
    </main>
  );
}
