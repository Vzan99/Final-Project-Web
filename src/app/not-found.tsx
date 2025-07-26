"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEE9DA] px-4">
      <h1 className="text-6xl font-bold text-[#6096B4] mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-2 inline-block bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#93BFCF] transition-colors"
      >
        Go back to Home
      </Link>
    </div>
  );
}
