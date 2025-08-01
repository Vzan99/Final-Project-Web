"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logoutUser } from "@/lib/redux/features/authSlice";

export default function VerifyNewEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying new email...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    async function verifyNewEmail() {
      try {
        const res = await API.get(`/auth/verify-new-email?token=${token}`);
        if (res.status === 200) {
          setMessage("New email verified successfully! Please log in again.");

          await dispatch(logoutUser()).unwrap();

          setVerified(true);

          setTimeout(() => {
            router.push("/auth/login?refresh=true");
          }, 2000);
        } else {
          setMessage("Verification failed or token expired.");
          setVerified(false);
        }
      } catch (error) {
        setMessage("Something went wrong during verification.");
        setVerified(false);
      }
    }

    verifyNewEmail();
  }, [token, dispatch, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEE9DA] to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#6096B4] mb-4">
          New Email Verification
        </h1>
        <p className="text-gray-700 text-base mb-6">{message}</p>
        {!verified && (
          <p className="text-sm text-gray-500">
            If you are not redirected automatically, please refresh or try
            again.
          </p>
        )}
      </div>
    </div>
  );
}
