"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, XCircle } from "lucide-react";

type CompanySearchBarProps = {
  onSearch: (filters: {
    name: string;
    location: string;
    sortBy: "name";
    sortOrder: "asc" | "desc";
  }) => void;
};

export default function CompanySearchBar({ onSearch }: CompanySearchBarProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const triggerSearch = (newSortOrder = sortOrder) => {
    onSearch({
      name: name.trim(),
      location: location.trim(),
      sortBy: "name",
      sortOrder: newSortOrder,
    });
  };

  const handleReset = () => {
    setName("");
    setLocation("");
    setSortOrder("asc");
    onSearch({
      name: "",
      location: "",
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  useEffect(() => {
    triggerSearch(sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md w-full mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Company Name Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 pr-10 border border-[#BDCDD6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6096B4] h-12 w-full"
          />
          {name && (
            <button
              type="button"
              onClick={() => setName("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6096B4]"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>

        {/* Location Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-3 pr-10 border border-[#BDCDD6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6096B4] h-12 w-full"
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6096B4]"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-3 border border-[#BDCDD6] rounded-lg h-12 bg-white text-gray-700 min-w-[150px]"
          >
            Sort: {sortOrder === "asc" ? "A to Z" : "Z to A"}
            <ChevronDown size={18} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#4c758a] hover:text-white ${
                  sortOrder === "asc"
                    ? "bg-[#6096B4] text-white font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setSortOrder("asc");
                  setDropdownOpen(false);
                }}
              >
                A to Z
              </button>
              <button
                className={`block w-full text-left px-4 py-2 hover:bg-[#4c758a] hover:text-white ${
                  sortOrder === "desc"
                    ? "bg-[#6096B4] text-white font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setSortOrder("desc");
                  setDropdownOpen(false);
                }}
              >
                Z to A
              </button>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="text-[#6096B4] font-semibold border border-[#6096B4] px-4 py-3 rounded-lg hover:bg-[#e8f1f5] h-12 min-w-[100px]"
        >
          Reset
        </button>

        {/* Search Button */}
        <button
          onClick={() => triggerSearch()}
          className="bg-[#6096B4] text-white px-6 py-3 rounded-lg hover:bg-[#517d98] font-semibold h-12 min-w-[120px]"
        >
          Search
        </button>
      </div>
    </div>
  );
}
