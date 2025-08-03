"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/axios";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logoutUser } from "@/lib/redux/features/authSlice";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
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
          setMessage("Email verified successfully! Redirecting to login...");

          await dispatch(logoutUser()).unwrap();
          setVerified(true);

          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
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
  }, [token, dispatch, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEE9DA] to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#6096B4] mb-4">
          Email Verification
        </h1>
        <p className="text-gray-700 text-base mb-6">{message}</p>
        {!token && (
          <Link
            href="/"
            className="mt-2 inline-block bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#93BFCF] transition-colors"
          >
            Go back to Home
          </Link>
        )}
        {!verified && token && (
          <p className="text-sm text-gray-500">
            If you are not redirected automatically, please refresh or try
            again.
          </p>
        )}
      </div>
    </div>
  );
}
