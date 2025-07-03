"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      setLoading(true);
      await API.post("/auth/request-password-reset", { email });
      toast.success("Reset email sent. Please check your inbox.");
      router.push("/auth/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send reset email.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f0e8] px-4">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#333]">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#89a8b2]"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#89a8b2] text-white py-2 px-4 rounded-md hover:bg-[#73909a] transition duration-200"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
