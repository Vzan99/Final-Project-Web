"use client";

import { useState } from "react";
import { MailWarning } from "lucide-react";
import API from "@/lib/axios";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";

export default function UnVerifiedEmailPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const { data } = await API.post("/auth/resend-verification");
      setSuccess(data.message || "Verification email sent!");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to resend email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireUnverified={true} fallback={<Spinner />}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-[#EEE9DA]">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
          <MailWarning size={48} className="text-[#6096B4] mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-[#6096B4] mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-700 mb-4">
            You need to verify your email address to access this feature. Please
            check your inbox for a verification email.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Didn’t receive the email? Click below to resend.
          </p>

          <button
            onClick={handleResend}
            disabled={loading}
            className="inline-block px-6 py-2 bg-[#6096B4] text-white rounded hover:bg-[#497187] transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>

          {success && <p className="mt-4 text-green-600 text-sm">{success}</p>}
          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </div>
      </div>
    </ProtectedRoute>
  );
}
