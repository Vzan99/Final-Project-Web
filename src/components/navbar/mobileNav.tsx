"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  user: any;
  isOpen: boolean;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileNav({
  user,
  isOpen,
  profileOpen,
  setProfileOpen,
  onLogout,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t shadow-sm px-4 pt-2 pb-4 space-y-2 text-black">
      <Link href="/" className="block hover:text-[#497187]" onClick={onClose}>
        Home
      </Link>
      <Link
        href="/jobs"
        className="block hover:text-[#497187]"
        onClick={onClose}
      >
        Jobs
      </Link>
      <Link
        href="/companies"
        className="block hover:text-[#497187]"
        onClick={onClose}
      >
        Companies
      </Link>

      {user ? (
        <>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition flex items-center gap-1"
          >
            Profile{" "}
            {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {profileOpen && (
            <div className="mt-2 space-y-1 pl-4 border-l">
              <Link
                href="/profile"
                className="block text-sm hover:text-[#497187]"
                onClick={onClose}
              >
                My Profile
              </Link>
              <Link
                href="/jobs/saved"
                className="block text-sm hover:text-[#497187]"
                onClick={onClose}
              >
                Saved Jobs
              </Link>
              <Link
                href="/jobs/applied"
                className="block text-sm hover:text-[#497187]"
                onClick={onClose}
              >
                Applied Jobs
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <Link
            href="/auth/login"
            className="block px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition"
            onClick={onClose}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="block px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#497187] transition"
            onClick={onClose}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
