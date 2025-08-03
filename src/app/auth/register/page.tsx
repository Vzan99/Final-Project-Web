"use client";

import { useState, useEffect } from "react";
import RegisterForm from "@/components/auth/registerForm";
import Image from "next/image";
import RegisterPageSkeleton from "@/components/loadingSkeleton/registerPageSkeleton";
import GuestRoute from "@/components/guestRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function RegisterPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <RegisterPageSkeleton />;

  return (
    <GuestRoute fallback={<Spinner />}>
      <main className="flex flex-col md:flex-row justify-center items-start bg-white pt-16 pb-12 px-4 md:px-8">
        {/* Left side */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 pr-8">
          <div className="text-center mb-6 max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-[#6096B4]">
              Welcome to Precise
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your gateway to top IT careers and hiring the right tech talent.
            </p>
            <Image
              src="/icon_register.png"
              alt="Register illustration"
              width={500}
              height={350}
              className="object-contain mx-auto"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex justify-center">
          <RegisterForm />
        </div>
      </main>
    </GuestRoute>
  );
}
