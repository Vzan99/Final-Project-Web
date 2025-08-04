"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  BarChart3,
  HeartPulse,
} from "lucide-react";

const links = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Job Management",
    href: "/dashboard/jobs",
    icon: <Briefcase size={18} />,
  },
  {
    label: "Interview Schedule",
    href: "/dashboard/interviews",
    icon: <CalendarDays size={18} />,
  },
  {
    label: "User Demographics",
    href: "/dashboard/analytics/demographics",
    icon: <Users size={18} />,
  },
  {
    label: "Salary Trends",
    href: "/dashboard/analytics/salary-trends",
    icon: <BarChart3 size={18} />,
  },
  {
    label: "Applicant Interests",
    href: "/dashboard/analytics/interests",
    icon: <HeartPulse size={18} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full w-full p-4 text-[#1a1a1a]">
      <h1 className="text-2xl font-bold mb-6 text-[#6096B4]">Dashboard</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#ddd3bb] transition ${
              pathname === link.href
                ? "bg-[#6096B4] text-white font-semibold"
                : ""
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
