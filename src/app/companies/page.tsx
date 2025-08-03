"use client";

import React, { useState, useEffect } from "react";
import API from "@/lib/axios";
import CompanySearchBar from "@/components/company/companySearchBar";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import CompanyCardSkeleton from "@/components/loadingSkeleton/companyCardSkeleton";
import { Pagination } from "@/components/pagination";

type Company = {
  id: string;
  description: string;
  location: string;
  logo?: string | null;
  admin: {
    name: string;
    email: string;
  };
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    location: "",
    sortBy: "name" as "name" | "location",
    sortOrder: "asc" as "asc" | "desc",
    page: 1,
    pageSize: 9,
  });

  const totalPages = Math.ceil(total / filters.pageSize);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setLoaded(false);
      try {
        const res = await API.get("/companies", { params: filters });
        setCompanies(res.data.companies);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Failed to load companies", error);
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    };
    fetchCompanies();
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <CompanySearchBar
        onSearch={(newFilters) => {
          setFilters({ ...filters, ...newFilters, page: 1 });
        }}
      />

      {loading ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: filters.pageSize }).map((_, idx) => (
            <li key={idx}>
              <CompanyCardSkeleton />
            </li>
          ))}
        </ul>
      ) : !loaded ? null : companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {companies.map((c) => (
              <li
                key={c.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition cursor-pointer w-full min-h-[160px] relative flex flex-col justify-between overflow-hidden"
              >
                <a
                  href={`/companies/${c.id}`}
                  className=" h-full flex flex-col justify-between"
                >
                  {/* Logo in top-right corner */}
                  <div className="absolute top-4 right-4">
                    {c.logo ? (
                      <img
                        src={
                          getCloudinaryImageUrl(c.logo, {
                            width: 60,
                            height: 60,
                            crop: "fit",
                          }) ?? "/precise_logo.jpeg"
                        }
                        alt={`${c.admin.name} logo`}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/precise_logo.jpeg";
                        }}
                      />
                    ) : (
                      <img
                        src="/precise_logo.jpeg"
                        alt="Default logo"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                  </div>

                  {/* Content area */}
                  <div className="space-y-2 pr-16">
                    <h2 className="text-xl font-semibold">{c.admin.name}</h2>
                    <p className="text-gray-600">{c.location}</p>
                    <div
                      className="text-sm text-gray-700 line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: c.description }}
                    />
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(newPage) => handlePageChange(newPage)}
          />
        </>
      )}
    </div>
  );
}
