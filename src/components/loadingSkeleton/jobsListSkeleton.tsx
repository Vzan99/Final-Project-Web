"use client";

export default function JobsListSkeleton() {
  return (
    <ul className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="border rounded p-4 border-gray-200 bg-white">
          <div className="h-5 w-1/2 bg-gray-300 rounded mb-2" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-1/4 bg-gray-100 rounded" />
        </li>
      ))}
    </ul>
  );
}
