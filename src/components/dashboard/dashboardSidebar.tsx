"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Overview", href: "/dashboard" },
  { label: "Job Management", href: "/dashboard/jobs" },
  { label: "Interview Schedule", href: "/dashboard/interviews" },
  { label: "User Demographics", href: "/dashboard/analytics/demographics" },
  { label: "Salary Trends", href: "/dashboard/analytics/salary-trends" },
  { label: "Applicant Interests", href: "/dashboard/analytics/interests" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#6096B4] text-white p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:underline ${
              pathname === link.href ? "font-bold underline" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
