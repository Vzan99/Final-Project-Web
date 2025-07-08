"use client";

import { useRouter } from "next/navigation";
import JobForm from "@/components/dashboard/jobs/JobForm";
import API from "@/lib/axios";

export default function CreateJobPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Job</h1>
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
    </div>
  );
}
