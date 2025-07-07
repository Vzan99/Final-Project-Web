"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/developer", label: "Overview" },
  { href: "/developer/subscription", label: "Subscription" },
  { href: "/developer/assessments", label: "Assessments" },
];

export default function DeveloperSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sky-700 text-white min-h-screen py-6 px-4 space-y-6">
      <h2 className="text-2xl font-bold pl-2">Developer</h2>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "pl-4 py-2 rounded transition-all",
              pathname === link.href
                ? "bg-white text-sky-700 font-semibold"
                : "hover:bg-sky-600"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
