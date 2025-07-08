"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CVForm from "@/components/cv/CVForm";
import CVPreview from "@/components/cv/CVPreview";
import { useCVForm } from "@/components/cv/useCVForm";

export default function CVGeneratorPage() {
  const subscription = useAppSelector((state) => state.auth.user?.subscription);
  const loading = useAppSelector((state) => state.auth.loading);
  const router = useRouter();

  const { form, setForm, pdfRef, handleDownload, handleDownloadFromServer } =
    useCVForm();

  useEffect(() => {
    if (!loading && subscription?.status !== "ACTIVE") {
      router.replace("/subscription/upgrade");
    }
  }, [loading, subscription]);

  if (loading || subscription?.status !== "ACTIVE") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking...
      </div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CV Generator</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <CVForm
          form={form}
          setForm={setForm}
          onClientDownload={handleDownload}
          onServerDownload={handleDownloadFromServer}
        />
        <CVPreview form={form} pdfRef={pdfRef} />
      </div>
    </main>
  );
}
