"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#EEE9DA] text-[#4B5563]">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 sm:grid-cols-2 gap-8 text-sm">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-[#6096B4] mb-3">Precise</h3>
          <p>Connecting top talent with leading tech companies.</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-md font-semibold mb-3">Job Seekers</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/jobs" className="hover:underline">
                Browse Jobs
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/assessments" className="hover:underline">
                Skill Assessments
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3">Companies</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard/jobs" className="hover:underline">
                Post a Job
              </Link>
            </li>
            <li>
              <Link href="/subscription" className="hover:underline">
                Subscription Plans
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:underline">
                Employer Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3">About</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#BDCDD6] py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Precise. All rights reserved.
      </div>
    </footer>
  );
}
