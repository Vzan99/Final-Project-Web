"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Unauthorized Access";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEE9DA] px-4 text-center">
      <h1 className="text-4xl font-bold text-[#6096B4] mb-4">
        Unauthorized Access
      </h1>
      <p className="text-gray-700 mb-6">
        You don’t have permission to view this page.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-[#6096B4] text-white rounded-xl hover:bg-[#4f717e] transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
