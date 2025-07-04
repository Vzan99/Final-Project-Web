"use client";

import Link from "next/link";
import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

export default function ApplicantCard({
  applicant,
  onStatusUpdate,
}: {
  applicant: Applicant;
  onStatusUpdate?: (newStatus: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await API.patch(`/applications/${applicant.id}/status`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      onStatusUpdate?.(newStatus);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const renderActions = () => {
    switch (applicant.status) {
      case "PENDING":
        return (
          <button
            onClick={() => handleStatusChange("REVIEWED")}
            disabled={loading}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Mark as Reviewed
          </button>
        );
      case "REVIEWED":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange("INTERVIEW")}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Invite to Interview
            </button>
            <button
              onClick={() => handleStatusChange("REJECTED")}
              disabled={loading}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Reject
            </button>
          </div>
        );
      case "INTERVIEW":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange("ACCEPTED")}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange("REJECTED")}
              disabled={loading}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Reject
            </button>
          </div>
        );
      default:
        return null; // accepted / rejected
    }
  };

  return (
    <div className="border p-4 rounded shadow bg-white space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{applicant.user.name}</h2>
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            applicant.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : applicant.status === "REVIEWED"
              ? "bg-blue-100 text-blue-800"
              : applicant.status === "INTERVIEW"
              ? "bg-purple-100 text-purple-800"
              : applicant.status === "ACCEPTED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {applicant.status}
        </span>
      </div>

      <p className="text-sm text-gray-600">{applicant.user.email}</p>

      <div className="text-sm space-y-1">
        <p>
          <strong>Expected Salary:</strong> Rp
          {applicant.expectedSalary.toLocaleString()}
        </p>
        {applicant.testScore !== undefined && (
          <p>
            <strong>Test Score:</strong> {applicant.testScore} / 100
          </p>
        )}
        {applicant.coverLetter && (
          <p>
            <strong>Cover Letter:</strong> {applicant.coverLetter}
          </p>
        )}
      </div>

      <Link
        href={applicant.cvFile}
        target="_blank"
        className="text-blue-600 text-sm hover:underline"
      >
        View CV
      </Link>

      <div className="pt-3 flex flex-wrap gap-3 items-center">
        {renderActions()}
        <button
          onClick={() => router.push(`/dashboard/applications/${applicant.id}`)}
          className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          View Detail
        </button>
      </div>
    </div>
  );
}
