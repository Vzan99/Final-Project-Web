"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    async function verify() {
      try {
        const res = await API.get(`/auth/verify-email?token=${token}`);

        if (res.status === 200) {
          setMessage("Email verified successfully! You can now log in.");
          setVerified(true);
        } else {
          setMessage("Verification failed or token expired.");
          setVerified(false);
        }
      } catch (error) {
        setMessage("Something went wrong.");
        setVerified(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEE9DA] to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#6096B4] mb-4">
          Email Verification
        </h1>
        <p className="text-gray-700 text-base mb-6">{message}</p>
        {verified && (
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-2 px-6 py-2 bg-[#6096B4] text-white rounded-lg hover:bg-[#497187] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Go to Login Page
          </button>
        )}
      </div>
    </div>
  );
}
