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
        onSubmit={async (values) => {
          await API.post("/jobs", values);
          router.push("/dashboard/jobs");
        }}
      />
    </div>
  );
}
