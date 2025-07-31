"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobForm from "@/components/dashboard/jobs/JobForm";
import API from "@/lib/axios";
import JobFormSkeleton from "@/components/dashboard/jobs/JobFormSkeleton";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <JobFormSkeleton />
      ) : (
        <JobForm
          onSubmit={async (formData) => {
            try {
              await API.post("/jobs", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              router.push("/dashboard/jobs");
            } catch (err) {
              console.error("Create job error", err);
            }
          }}
        />
      )}
    </div>
  );
}
