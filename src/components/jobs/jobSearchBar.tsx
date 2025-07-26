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

type SortOption = "date" | "salaryAsc" | "salaryDesc" | "relevance";

type FilterMeta = {
  employmentTypes: string[];
  isRemoteOptions: { label: string; value: boolean }[];
  categories: { id: string; name: string }[];
};

export type Filters = {
  title: string;
  location: string;
  jobType: string;
  isRemote: boolean | null;
  classifications: string[];
  listingTime: string;
  customStartDate?: string;
  customEndDate?: string;
  sortBy: "createdAt" | "salary" | "relevance";
  sortOrder: "asc" | "desc";
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
  const [jobType, setJobType] = useState(initialFilters.jobType || "");
  const [remoteFilter, setRemoteFilter] = useState<string>(() => {
    if (initialFilters.isRemote === true) return "true";
    if (initialFilters.isRemote === false) return "false";
    return "all";
  });
  const [classifications, setClassifications] = useState<string[]>(
    initialFilters.classifications || []
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
      case "relevance":
        return "relevance";
      case "createdAt":
      default:
        return "date";
    }
  });

  const [showClassificationDropdown, setShowClassificationDropdown] =
    useState(false);
  const [showListingTimeDropdown, setShowListingTimeDropdown] = useState(false);

  const classificationRef = useRef<HTMLDivElement>(null);
  const listingTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(initialFilters.title || "");
    setLocation(initialFilters.location || "");
    setJobType(initialFilters.jobType || "");
    setRemoteFilter(() => {
      if (initialFilters.isRemote === true) return "true";
      if (initialFilters.isRemote === false) return "false";
      return "all";
    });
    setClassifications(initialFilters.classifications || []);
    setListingTime(initialFilters.listingTime || "any");
    setCustomStartDate(initialFilters.customStartDate || "");
    setCustomEndDate(initialFilters.customEndDate || "");
    setSort(() => {
      switch (initialFilters.sortBy) {
        case "salary":
          return initialFilters.sortOrder === "asc"
            ? "salaryAsc"
            : "salaryDesc";
        case "relevance":
          return "relevance";
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
        classificationRef.current &&
        !classificationRef.current.contains(event.target as Node)
      ) {
        setShowClassificationDropdown(false);
      }
      if (
        listingTimeRef.current &&
        !listingTimeRef.current.contains(event.target as Node)
      ) {
        setShowListingTimeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleClassification = (value: string) => {
    setClassifications((prev) =>
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

    let sortBy: "createdAt" | "salary" | "relevance" = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    if (sort === "salaryAsc") {
      sortBy = "salary";
      sortOrder = "asc";
    } else if (sort === "salaryDesc") {
      sortBy = "salary";
      sortOrder = "desc";
    } else if (sort === "relevance") {
      sortBy = "relevance";
      sortOrder = "desc";
    }

    onSearch({
      title: title.trim(),
      location: location.trim(),
      jobType,
      isRemote:
        remoteFilter === "all"
          ? null
          : remoteFilter === "true"
          ? true
          : remoteFilter === "false"
          ? false
          : null,
      classifications,
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
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg h-12 bg-white text-gray-700"
          disabled={loadingMeta}
        >
          <option value="">All Work Types</option>
          {filtersMeta?.employmentTypes.map((et) => (
            <option key={et} value={et}>
              {et.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        {/* Location (isRemote) Types */}
        <select
          value={remoteFilter}
          onChange={(e) => setRemoteFilter(e.target.value)}
          className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg h-12 bg-white text-gray-700"
          disabled={loadingMeta}
        >
          <option value="all">All Locations</option>
          {filtersMeta?.isRemoteOptions.map(({ label, value }) => (
            <option key={String(value)} value={String(value)}>
              {label}
            </option>
          ))}
        </select>

        {/* Classification Dropdown */}
        <div className="relative w-full" ref={classificationRef}>
          <button
            onClick={() =>
              setShowClassificationDropdown(!showClassificationDropdown)
            }
            className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg bg-white flex items-center justify-between h-12"
            disabled={loadingMeta}
          >
            Category
            <svg
              className={`w-4 h-4 transition-transform ${
                showClassificationDropdown ? "rotate-180" : ""
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
          {showClassificationDropdown && (
            <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto border border-[#BDCDD6] bg-white p-4 shadow-lg rounded-md">
              {filtersMeta?.categories.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    type="checkbox"
                    checked={classifications.includes(option.name)}
                    onChange={() => toggleClassification(option.name)}
                  />
                  <span>{option.name}</span>
                </label>
              ))}
              <button
                onClick={() => {
                  setShowClassificationDropdown(false);
                  triggerSearch();
                }}
                className="mt-2 w-full bg-[#6096B4] text-white py-2 rounded-lg hover:bg-[#517d98] font-semibold"
              >
                Apply
              </button>
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
        <select
          value={sort}
          onChange={(e) => {
            const selectedSort = e.target.value as SortOption;
            setSort(selectedSort);

            let sortBy: "createdAt" | "salary" | "relevance" = "createdAt";
            let sortOrder: "asc" | "desc" = "desc";

            if (selectedSort === "salaryAsc") {
              sortBy = "salary";
              sortOrder = "asc";
            } else if (selectedSort === "salaryDesc") {
              sortBy = "salary";
              sortOrder = "desc";
            } else if (selectedSort === "relevance") {
              sortBy = "relevance";
              sortOrder = "desc";
            }

            onSearch({
              title: title.trim(),
              location: location.trim(),
              jobType,
              isRemote:
                remoteFilter === "all"
                  ? null
                  : remoteFilter === "true"
                  ? true
                  : remoteFilter === "false"
                  ? false
                  : null,
              classifications,
              listingTime,
              customStartDate:
                listingTime === "custom" ? customStartDate : undefined,
              customEndDate:
                listingTime === "custom" ? customEndDate : undefined,
              sortBy,
              sortOrder,
            });
          }}
          className="w-full px-4 py-3 border border-[#BDCDD6] rounded-lg h-12 bg-white text-gray-700"
        >
          <option value="date">Date Posted (Newest)</option>
          <option value="salaryDesc">Salary (High to Low)</option>
          <option value="salaryAsc">Salary (Low to High)</option>
          <option value="relevance">Relevance</option>
        </select>

        {/* Reset All Button */}
        <button
          onClick={() => {
            setTitle("");
            setLocation("");
            setJobType("");
            setRemoteFilter("all");
            setClassifications([]);
            setListingTime("any");
            setCustomStartDate("");
            setCustomEndDate("");
            setSort("date");

            onSearch({
              title: "",
              location: "",
              jobType: "",
              isRemote: null,
              classifications: [],
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
