"use client";

import { useEffect, useState } from "react";

export interface ApplicantFilter {
  name: string;
  minAge: string;
  maxAge: string;
  minSalary: string;
  maxSalary: string;
  education: string;
}

interface Props {
  filters: ApplicantFilter;
  onChange: (filters: ApplicantFilter) => void;
  educationOptions: string[];
}

export default function ApplicantFilterForm({
  filters,
  onChange,
  educationOptions,
}: Props) {
  return (
    <div className="space-y-4 bg-[#F8F8F8] p-4 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => onChange({ ...filters, name: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />

        <input
          type="number"
          placeholder="Min Age"
          value={filters.minAge}
          onChange={(e) => onChange({ ...filters, minAge: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Max Age"
          value={filters.maxAge}
          onChange={(e) => onChange({ ...filters, maxAge: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />

        <input
          type="number"
          placeholder="Min Salary"
          value={filters.minSalary}
          onChange={(e) => onChange({ ...filters, minSalary: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={filters.maxSalary}
          onChange={(e) => onChange({ ...filters, maxSalary: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />

        <select
          value={filters.education}
          onChange={(e) => onChange({ ...filters, education: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        >
          <option value="">All Education</option>
          {educationOptions.map((edu) => (
            <option key={edu} value={edu}>
              {edu}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
