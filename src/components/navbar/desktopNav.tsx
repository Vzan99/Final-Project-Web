"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  user: any;
  loading?: boolean;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  onLogout: () => void;
}

export default function DesktopNav({
  user,
  loading,
  profileOpen,
  setProfileOpen,
  onLogout,
}: Props) {
  return (
    <div className="hidden md:flex space-x-8 items-center">
      <Link href="/" className="hover:text-[#497187]">
        Home
      </Link>
      <Link href="/jobs" className="hover:text-[#497187]">
        Jobs
      </Link>
      <Link href="/companies" className="hover:text-[#497187]">
        Companies
      </Link>

      {loading ? (
        <div className="ml-4 w-24 h-9 bg-gray-200 rounded animate-pulse" />
      ) : user ? (
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition flex items-center gap-1"
          >
            Profile{" "}
            {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50 p-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
                onClick={() => setProfileOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/jobs/saved"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
                onClick={() => setProfileOpen(false)}
              >
                Saved Jobs
              </Link>
              <Link
                href="/jobs/applied"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
                onClick={() => setProfileOpen(false)}
              >
                Applied Jobs
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="ml-4 space-x-2">
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#497187] transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
