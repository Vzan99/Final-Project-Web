"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import ApplicantCard from "@/components/dashboard/applicants/ApplicantCard";

interface Applicant {
  id: string;
  expectedSalary: number;
  status: string;
  cvFile: string;
  coverLetter?: string;
  testScore?: number;
  user: {
    name: string;
    email: string;
  };
}

export default function ApplicantListPage() {
  const { id: jobId } = useParams();
  const router = useRouter();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      API.get(`/applications/jobs/${jobId}/applicants`)
        .then((res) => setApplicants(res.data.data))
        .catch(() => {
          toast.error("Failed to fetch applicants");
          router.push("/dashboard/jobs");
        })
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Applicants</h1>

      {applicants.length === 0 ? (
        <p>No applicants found for this job.</p>
      ) : (
        applicants.map((app) => (
          <ApplicantCard
            key={app.id}
            applicant={app}
            onStatusUpdate={(newStatus) =>
              handleStatusUpdate(app.id, newStatus)
            }
          />
        ))
      )}
    </div>
  );
}
