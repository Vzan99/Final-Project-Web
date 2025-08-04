"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import JobForm from "@/components/dashboard/jobs/JobForm";
import { toast } from "react-toastify";
import JobFormSkeleton from "@/components/dashboard/jobs/JobFormSkeleton";

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then((res) => setInitialValues(res.data.data))
      .catch(() => toast.error("Failed to fetch job data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      await API.patch(`/jobs/${id}`, values);
      router.push("/dashboard/jobs");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update job");
    }
  };

  if (loading) return <JobFormSkeleton />;

  return (
    <div>
      <JobForm initialValues={initialValues} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
