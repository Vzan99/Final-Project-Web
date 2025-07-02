"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.replace("/auth/login");
    }
  }, [token, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success("Password reset successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to reset password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f0e8] px-4">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#333]">
          Reset Your Password
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#89a8b2]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#89a8b2]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#89a8b2] text-white py-2 px-4 rounded-md hover:bg-[#73909a] transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
