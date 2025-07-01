"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";
import API from "@/lib/axios";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncGoogleUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        try {
          await API.post(
            "/auth/sync-google",
            {},
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
              withCredentials: true,
            }
          );

          toast.success("Login successful!");
          await dispatch(fetchUser());
          router.push("/home");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Google sync failed");
          router.push("/auth/login");
        }
      } else {
        toast.error("No active session found.");
        router.push("/auth/login");
      }
    };

    syncGoogleUser();
  }, [dispatch, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="bg-white shadow-md rounded-xl p-8 flex flex-col items-center gap-4 max-w-sm w-full">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <h1 className="text-xl font-semibold text-gray-800">
          Signing in with Google...
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Please wait while we securely sign you in and sync your account.
        </p>
      </div>
    </main>
  );
}
