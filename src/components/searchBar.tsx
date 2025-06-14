"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (category) params.append("category", category);
    if (location) params.append("location", location);

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:gap-4 mb-8">
        <input
          type="text"
          placeholder="Search jobs, skills, or companies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:flex-1 px-4 py-3 rounded-lg border border-gray-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 rounded-lg border border-gray-300"
        >
          <option value="">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Fullstack">Fullstack</option>
          <option value="DevOps">DevOps</option>
          <option value="UI/UX">UI/UX</option>
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-1/4 px-4 py-3 rounded-lg border border-gray-300"
        >
          <option value="">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Surabaya">Surabaya</option>
          <option value="Yogyakarta">Yogyakarta</option>
        </select>
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-3 rounded-lg font-semibold shadow bg-[#6096B4] text-white hover:bg-[#4d7a96] transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
