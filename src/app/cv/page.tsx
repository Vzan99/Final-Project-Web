"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import CVForm from "@/components/cv/CVForm";
import { useCVForm } from "@/components/cv/useCVForm";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function CVGeneratorPage() {
  const subscription = useAppSelector((state) => state.auth.user?.subscription);
  const loading = useAppSelector((state) => state.auth.loading);
  const router = useRouter();

  const { form, setForm, handleDownloadFromServer } = useCVForm();

  useEffect(() => {
    if (!loading && subscription?.status !== "ACTIVE") {
      router.replace("/subscription/upgrade");
    }
  }, [loading, subscription, router]);

  if (loading || subscription?.status !== "ACTIVE") {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        Checking subscription...
      </main>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#497187] mb-6">CV Generator</h1>
        <CVForm
          form={form}
          setForm={setForm}
          onServerDownload={handleDownloadFromServer}
        />
      </main>
    </ProtectedRoute>
  );
}
