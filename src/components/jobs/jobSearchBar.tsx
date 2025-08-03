"use client";

import React, { useState, useEffect, useRef } from "react";
import API from "@/lib/axios";
import { XCircle } from "lucide-react";

const listingTimeOptions = [
  { label: "Any Time", value: "any" },
  { label: "Today", value: "today" },
  { label: "Last 3 Days", value: "3days" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 14 Days", value: "14days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Range", value: "custom" },
];

type SortOption = "date" | "salaryAsc" | "salaryDesc" | "nearby";

type FilterMeta = {
  employmentTypes: { label: string; value: string }[];
  isRemoteOptions: { label: string; value: boolean }[];
  jobCategories: { label: string; value: string }[];
  experienceLevels?: string[];
};

export type Filters = {
  title: string;
  location: string;
  employmentType: string[];
  isRemote: boolean | null;
  jobCategory: string[];
  listingTime: string;
  customStartDate?: string;
  customEndDate?: string;
  sortBy: "createdAt" | "salary" | "nearby";
  sortOrder: "asc" | "desc";
  lat?: number;
  lng?: number;
};

type JobSearchBarProps = {
  onSearch: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
};

const remoteFilterLabels: Record<string, string> = {
  true: "Remote",
  false: "On-site",
  all: "All Locations",
};

export default function JobSearchBar({
  onSearch,
  initialFilters = {},
}: JobSearchBarProps) {
  const [title, setTitle] = useState(initialFilters.title || "");
  const [location, setLocation] = useState(initialFilters.location || "");
  const [employmentTypes, setemploymentTypes] = useState<string[]>(
    initialFilters.employmentType || []
  );

  const [remoteFilter, setRemoteFilter] = useState<string>(() => {
    if (initialFilters.isRemote === true) return "true";
    if (initialFilters.isRemote === false) return "false";
    return "all";
  });
  const [jobCategory, setJobCategory] = useState<string[]>(
    initialFilters.jobCategory || []
  );

  const [filtersMeta, setFiltersMeta] = useState<FilterMeta | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [listingTime, setListingTime] = useState(
    initialFilters.listingTime || "any"
  );
  const [customStartDate, setCustomStartDate] = useState(
    initialFilters.customStartDate || ""
  );
  const [customEndDate, setCustomEndDate] = useState(
    initialFilters.customEndDate || ""
  );
  const [sort, setSort] = useState<SortOption>(() => {
    switch (initialFilters.sortBy) {
      case "salary":
        return initialFilters.sortOrder === "asc" ? "salaryAsc" : "salaryDesc";
      case "nearby":
        return "nearby";
      case "createdAt":
      default:
        return "date";
    }
  });

  const [showemploymentTypeDropdown, setShowemploymentTypeDropdown] =
    useState(false);
  const employmentTypeRef = useRef<HTMLDivElement>(null);

  const [showRemoteDropdown, setShowRemoteDropdown] = useState(false);
  const remoteRef = useRef<HTMLDivElement>(null);

  const [showJobCategoryDropdown, setShowJobCategoryDropdown] = useState(false);
  const jobCategoryRef = useRef<HTMLDivElement>(null);

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [showListingTimeDropdown, setShowListingTimeDropdown] = useState(false);
  const listingTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(initialFilters.title || "");
    setLocation(initialFilters.location || "");
    setemploymentTypes(initialFilters.employmentType || []);
    setRemoteFilter(() => {
      if (initialFilters.isRemote === true) return "true";
      if (initialFilters.isRemote === false) return "false";
      return "all";
    });
    setJobCategory(initialFilters.jobCategory || []);
    setListingTime(initialFilters.listingTime || "any");
    setCustomStartDate(initialFilters.customStartDate || "");
    setCustomEndDate(initialFilters.customEndDate || "");
    setSort(() => {
      switch (initialFilters.sortBy) {
        case "salary":
          return initialFilters.sortOrder === "asc"
            ? "salaryAsc"
            : "salaryDesc";
        case "nearby":
          return "nearby";
        case "createdAt":
        default:
          return "date";
      }
    });
  }, [initialFilters]);

  useEffect(() => {
    const fetchFiltersMeta = async () => {
      try {
        const res = await API.get("/jobs/filters/meta");
        if (res.data.success) {
          setFiltersMeta(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch filter meta", error);
      } finally {
        setLoadingMeta(false);
      }
    };

    fetchFiltersMeta();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        employmentTypeRef.current &&
        !employmentTypeRef.current.contains(event.target as Node)
      ) {
        setShowemploymentTypeDropdown(false);
      }
      if (
        jobCategoryRef.current &&
        !jobCategoryRef.current.contains(event.target as Node)
      ) {
        setShowJobCategoryDropdown(false);
      }
      if (
        listingTimeRef.current &&
        !listingTimeRef.current.contains(event.target as Node)
      ) {
        setShowListingTimeDropdown(false);
      }
      if (
        remoteRef.current &&
        !remoteRef.current.contains(event.target as Node)
      ) {
        setShowRemoteDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleJobCategory = (value: string) => {
    setJobCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleemploymentType = (value: string) => {
    setemploymentTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const triggerSearch = () => {
    if (listingTime === "custom") {
      if (!customStartDate || !customEndDate) {
        alert("Please select both start and end dates for custom range.");
        return;
      }
      if (customEndDate < customStartDate) {
        alert("End date cannot be earlier than start date.");
        return;
      }
    }

    let sortBy: "createdAt" | "salary" | "nearby" = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort === "salaryAsc") {
      sortBy = "salary";
      sortOrder = "asc";
    } else if (sort === "salaryDesc") {
      sortBy = "salary";
      sortOrder = "desc";
    } else if (sort === "nearby") {
      sortBy = "nearby";
      sortOrder = "desc";
    }

    onSearch({
      title: title.trim(),
      location: location.trim(),
      employmentType: employmentTypes,
      isRemote:
        remoteFilter === "all"
          ? null
          : remoteFilter === "true"
          ? true
          : remoteFilter === "false"
          ? false
          : null,
      jobCategory,
      listingTime,
      customStartDate: listingTime === "custom" ? customStartDate : undefined,
      customEndDate: listingTime === "custom" ? customEndDate : undefined,
      sortBy,
      sortOrder,
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md w-full mb-6">
      {/* Top Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Job title or keywords"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-[#BDCDD6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6096B4] h-12"
          />
          {title && (
            <button
              type="button"
              onClick={() => setTitle("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999] hover:text-[#6096B4]"
            >
              <XCircle className="w-5 h-5 bg-[#eee] rounded-full" />
            </button>
          )}
        </div>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-[#BDCDD6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6096B4] h-12"
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999] hover:text-[#6096B4]"
            >
              <XCircle className="w-5 h-5 bg-[#eee] rounded-full" />
            </button>
          )}
        </div>

        <button
          onClick={triggerSearch}
          className="bg-[#6096B4] text-white px-6 py-3 rounded-lg hover:bg-[#517d98] font-semibold h-12 min-w-[120px]"
        >
          Search
        </button>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 items-center">
        {/* Employment Types */}
        <div className="relative w-full" ref={employmentTypeRef}>
          <button
            onClick={() =>
              setShowemploymentTypeDropdown(!showemploymentTypeDropdown)
            }
            className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg bg-white flex items-center justify-between h-12"
            disabled={loadingMeta}
          >
            Work Types
            <svg
              className={`w-4 h-4 transition-transform ${
                showemploymentTypeDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showemploymentTypeDropdown && (
            <div className="absolute z-10 mt-2 min-w-full w-max max-w-screen-sm border border-[#BDCDD6] bg-white shadow-lg rounded-md">
              <div className="p-4 rounded-md">
                {filtersMeta?.employmentTypes.map(({ label, value }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={employmentTypes.includes(value)}
                      onChange={() => toggleemploymentType(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
                <button
                  onClick={() => {
                    setShowemploymentTypeDropdown(false);
                    triggerSearch();
                  }}
                  className="mt-2 w-full bg-[#6096B4] text-white py-2 rounded-lg hover:bg-[#517d98] font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Remote Filter Dropdown */}
        <div className="relative w-full" ref={remoteRef}>
          <button
            onClick={() => setShowRemoteDropdown((prev) => !prev)}
            className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg bg-white flex items-center justify-between h-12"
            disabled={loadingMeta}
          >
            {remoteFilter === "all"
              ? "All Locations"
              : remoteFilter === "true"
              ? "Remote"
              : "On‑site"}
            <svg
              className={`w-4 h-4 transition-transform ${
                showRemoteDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showRemoteDropdown && (
            <div className="absolute z-10 mt-2 w-full border border-[#BDCDD6] bg-white shadow-lg rounded-md p-4">
              {[
                { label: "All Locations", value: "all" },
                { label: "Remote", value: "true" },
                { label: "On‑site", value: "false" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="remoteFilter"
                    value={value}
                    checked={remoteFilter === value}
                    onChange={() => {
                      setRemoteFilter(value);
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}

              <button
                onClick={() => {
                  setShowRemoteDropdown(false);
                  triggerSearch();
                }}
                className="mt-2 w-full bg-[#6096B4] text-white py-2 rounded-lg hover:bg-[#517d98] font-semibold"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Job Category Dropdown */}
        <div className="relative w-full" ref={jobCategoryRef}>
          <button
            onClick={() => setShowJobCategoryDropdown(!showJobCategoryDropdown)}
            className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg bg-white flex items-center justify-between h-12"
            disabled={loadingMeta}
          >
            Category
            <svg
              className={`w-4 h-4 transition-transform ${
                showJobCategoryDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showJobCategoryDropdown && (
            <div className="absolute z-10 mt-2 min-w-full w-max max-w-screen-sm border border-[#BDCDD6] bg-white shadow-lg rounded-md">
              <div className="p-4 rounded-md">
                {filtersMeta?.jobCategories.map(({ label, value }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={jobCategory.includes(value)}
                      onChange={() => toggleJobCategory(value)}
                    />

                    <span>{label}</span>
                  </label>
                ))}

                <button
                  onClick={() => {
                    setShowJobCategoryDropdown(false);
                    triggerSearch();
                  }}
                  className="mt-2 w-full bg-[#6096B4] text-white py-2 rounded-lg hover:bg-[#517d98] font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Listing Time Dropdown */}
        <div className="relative w-full" ref={listingTimeRef}>
          <button
            onClick={() => setShowListingTimeDropdown(!showListingTimeDropdown)}
            className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg bg-white flex items-center justify-between h-12"
          >
            {listingTime === "any"
              ? "Listing Time"
              : listingTimeOptions.find((opt) => opt.value === listingTime)
                  ?.label || "Listing Time"}
            <svg
              className={`w-4 h-4 transition-transform ${
                showListingTimeDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showListingTimeDropdown && (
            <div className="absolute z-10 mt-2 max-h-80 w-full overflow-y-auto border border-[#BDCDD6] bg-white p-4 shadow-lg rounded-md">
              {listingTimeOptions.map(({ label, value }) => (
                <label key={value} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="listingTime"
                    value={value}
                    checked={listingTime === value}
                    onChange={() => setListingTime(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}

              {listingTime === "custom" && (
                <div className="mt-2 flex flex-col gap-2">
                  <label className="flex flex-col">
                    Start Date:
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="border border-gray-300 rounded p-1 mt-1"
                    />
                  </label>
                  <label className="flex flex-col">
                    End Date:
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="border border-gray-300 rounded p-1 mt-1"
                    />
                  </label>
                </div>
              )}

              <button
                onClick={() => {
                  setShowListingTimeDropdown(false);
                  triggerSearch();
                }}
                className="mt-4 w-full bg-[#6096B4] text-white py-2 rounded-lg hover:bg-[#517d98] font-semibold"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="relative w-full" ref={sortRef}>
          <button
            onClick={() => setShowSortDropdown((prev) => !prev)}
            className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg bg-white flex items-center justify-between h-12"
          >
            {
              {
                date: "Date (Newest)",
                salaryAsc: "Salary (Low to High)",
                salaryDesc: "Salary (High to Low)",
                nearby: "Nearby",
              }[sort]
            }
            <svg
              className={`w-4 h-4 transition-transform ${
                showSortDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showSortDropdown && (
            <div className="absolute z-10 mt-2 w-full border border-[#BDCDD6] bg-white shadow-lg rounded-md p-4">
              {[
                { label: "Date (Newest)", value: "date" },
                { label: "Salary (Low to High)", value: "salaryAsc" },
                { label: "Salary (High to Low)", value: "salaryDesc" },
                { label: "Nearby", value: "nearby" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="sortOption"
                    value={value}
                    checked={sort === (value as SortOption)}
                    onChange={() => {
                      setSort(value as SortOption);
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}

              <button
                onClick={() => {
                  setShowSortDropdown(false);
                  triggerSearch();
                }}
                className="mt-2 w-full bg-[#6096B4] text-white py-2 rounded-lg hover:bg-[#517d98] font-semibold"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Reset All Button */}
        <button
          onClick={() => {
            setTitle("");
            setLocation("");
            setemploymentTypes([]);
            setRemoteFilter("all");
            setJobCategory([]);
            setListingTime("any");
            setCustomStartDate("");
            setCustomEndDate("");
            setSort("date");

            onSearch({
              title: "",
              location: "",
              employmentType: [],
              isRemote: null,
              jobCategory: [],
              listingTime: "any",
              sortBy: "createdAt",
              sortOrder: "desc",
            });
          }}
          className="w-full px-4 py-3 border border-[#6096B4] text-[#6096B4] rounded-lg hover:bg-[#f0f6f9] font-semibold h-12"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
