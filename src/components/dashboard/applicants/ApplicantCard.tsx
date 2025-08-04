"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { Applicant } from "@/types/applicant";
import RejectDialog from "./rejectDialog";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

interface ApplicantCardProps {
  applicant: Applicant;
  onStatusUpdate?: (newStatus: string) => void;
  hasTest: boolean;
}

export default function ApplicantCard({
  applicant,
  onStatusUpdate,
  hasTest,
}: ApplicantCardProps) {
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const calculateAge = (birthDate: string) => {
    const dob = new Date(birthDate);
    const diff = Date.now() - dob.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const handleStatusChange = async (status: string) => {
    try {
      setLoading(true);
      setActionLoading(status);
      await API.patch(`/applications/${applicant.id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      onStatusUpdate?.(status);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
      setActionLoading(null);
      setRejectLoading(false);
      setShowRejectDialog(false);
    }
  };

  const handleReject = async (feedback: string) => {
    setRejectLoading(true);
    try {
      await API.post(`/applications/${applicant.id}/feedback`, { feedback });
      await handleStatusChange("REJECTED");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject applicant");
      setRejectLoading(false);
    }
  };

  const renderStatusBadge = () => {
    const base = "px-2 py-1 text-xs font-medium rounded-full";
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      REVIEWED: "bg-blue-100 text-blue-800",
      INTERVIEW: "bg-purple-100 text-purple-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return (
      <span className={`${base} ${colors[applicant.status]}`}>
        {applicant.status}
      </span>
    );
  };

  const renderActions = () => {
    switch (applicant.status) {
      case "PENDING":
        return (
          <button
            onClick={() => handleStatusChange("REVIEWED")}
            disabled={!!actionLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            {actionLoading === "REVIEWED" ? "Marking..." : "Mark as Reviewed"}
          </button>
        );
      case "REVIEWED":
        return (
          <>
            <button
              onClick={() => handleStatusChange("INTERVIEW")}
              disabled={!!actionLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              {actionLoading === "INTERVIEW"
                ? "Inviting..."
                : "Invite to Interview"}
            </button>
            <button
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              {actionLoading === "REJECTED" ? "Rejecting..." : "Reject"}
            </button>
          </>
        );
      case "INTERVIEW":
        if (
          applicant.interviewStatus !== "COMPLETED" &&
          applicant.interviewStatus !== "CANCELLED"
        ) {
          return (
            <p className="text-sm italic text-gray-500">
              Waiting for interview to complete...
            </p>
          );
        }
        return (
          <>
            <button
              onClick={() => handleStatusChange("ACCEPTED")}
              disabled={!!actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              {actionLoading === "ACCEPTED" ? "Accepting..." : "Accept"}
            </button>
            <button
              onClick={() => setShowRejectDialog(true)}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              {actionLoading === "REJECTED" ? "Rejecting..." : "Reject"}
            </button>
          </>
        );
      default:
        return null;
    }
  };
  const handleDownloadCV = async (url: string, userName: string) => {
    try {
      const downloadUrl = url.includes("?")
        ? `${url}&fl_attachment`
        : `${url}?fl_attachment`;

      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const mimeToExt: Record<string, string> = {
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
      };

      const ext = mimeToExt[blob.type] || "pdf";
      const fileName = `cv-${userName.replace(/\s+/g, "_")}.${ext}`;

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Failed to Download CV.");
    }
  };

  return (
    <>
      <RejectDialog
        isOpen={showRejectDialog}
        initialFeedback={applicant.feedback ?? ""}
        loading={rejectLoading}
        onClose={() => setShowRejectDialog(false)}
        onSubmit={handleReject}
      />

      <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <img
            src={
              getCloudinaryImageUrl(applicant.user.profile?.photoUrl, {
                width: 64,
                height: 64,
                crop: "fill",
              }) ?? "/default-avatar.png"
            }
            alt={applicant.user.name}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {applicant.user.name}
                  {applicant.subscriptionType === "PROFESSIONAL" && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{applicant.user.email}</p>
              </div>
              {renderStatusBadge()}
            </div>
            {applicant.coverLetter && (
              <p className="text-sm text-gray-700 mt-2">
                <strong>Cover Letter:</strong> {applicant.coverLetter}
              </p>
            )}
          </div>
        </div>

        {/* CV Link */}
        <div>
          <button
            onClick={() =>
              handleDownloadCV(applicant.cvFile, applicant.user.name)
            }
            className="text-sm text-[#6096B4] hover:underline hover:text-[#4a7b96] transition-colors"
          >
            Download CV
          </button>
        </div>

        {/* Toggle details */}
        <div>
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showDetail ? "Hide Details" : "View More Details"}
          </button>
        </div>

        {/* Details section */}
        {showDetail && (
          <div className="bg-gray-50 p-3 rounded-md border space-y-2 text-sm text-gray-700">
            <p>
              <strong>Age:</strong>{" "}
              {applicant.user.profile?.birthDate
                ? `${calculateAge(applicant.user.profile.birthDate)} years old`
                : "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {applicant.user.profile?.gender ?? "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {applicant.user.profile?.address ?? "N/A"}
            </p>
            <p>
              <strong>Education:</strong>{" "}
              {applicant.user.profile?.education ?? "N/A"}
            </p>
            <p>
              <strong>Expected Salary:</strong> Rp
              {applicant.expectedSalary.toLocaleString("id-ID")}
            </p>
            {hasTest && applicant.test && (
              <p>
                <strong>Test Score:</strong>{" "}
                {applicant.test.score != null
                  ? `${Math.round(applicant.test.score)}%`
                  : "Not submitted"}
                {applicant.test.passed != null &&
                  ` (${applicant.test.passed ? "Passed" : "Failed"})`}
              </p>
            )}
            <p>
              <strong>Applied At:</strong>{" "}
              {new Date(applicant.appliedAt).toLocaleDateString("id-ID")}
            </p>
            <p>
              <strong>Job:</strong> {applicant.job.title}
            </p>
            {applicant.interviewStatus && (
              <p>
                <strong>Interview Status:</strong> {applicant.interviewStatus}
              </p>
            )}
            {applicant.user.profile?.skills?.length! > 0 && (
              <p>
                <strong>Skills:</strong>{" "}
                <span className="flex flex-wrap gap-1">
                  {applicant.user.profile!.skills!.map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full break-words"
                    >
                      {s}
                    </span>
                  ))}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-wrap gap-3 items-center">
          {renderActions()}
        </div>
      </div>
    </>
  );
}
