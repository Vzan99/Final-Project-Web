"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { useParams } from "next/navigation";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import ReviewForm from "@/components/review/ReviewForm";
import ReviewList from "@/components/review/ReviewList";
import { Pagination } from "@/components/pagination";
import CompanyDetailsSkeleton from "@/components/loadingSkeleton/companyDetailSkeleton";
import JobsListSkeleton from "@/components/loadingSkeleton/jobsListSkeleton";

type Company = {
  id: string;
  description: string;
  location: string;
  logo?: string | null;
  bannerUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  foundedYear?: number | null;
  admin: {
    name: string;
    email: string;
  };
};

type Job = {
  id: string;
  title: string;
  location: string;
  createdAt: string;
};

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const companyId = id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"About" | "Jobs" | "Reviews">(
    "About"
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobPage, setJobPage] = useState(1);
  const [jobTotalPages, setJobTotalPages] = useState(1);
  const jobPageSize = 5;

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await API.get(`/companies/${companyId}`);
        setCompany(res.data);
      } catch (err) {
        console.error("Error loading company", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  useEffect(() => {
    if (activeTab === "Jobs") {
      const fetchJobs = async () => {
        setJobsLoading(true);
        try {
          const res = await API.get(`/companies/${companyId}/jobs`, {
            params: {
              page: jobPage,
              pageSize: jobPageSize,
            },
          });
          setJobs(res.data.jobs || []);
          setJobTotalPages(res.data.totalPages || 1);
        } catch (err) {
          console.error("Error loading jobs", err);
          setJobs([]);
        } finally {
          setJobsLoading(false);
        }
      };
      fetchJobs();
    }
  }, [activeTab, companyId, jobPage]);

  if (loading) {
    return <CompanyDetailsSkeleton />;
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-[#f3f2ef] pt-8 text-black max-w-5xl mx-auto px-4 md:px-0">
        <p>Company not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {/* Banner */}
        <div className="relative bg-white rounded-t-xl h-48 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${
                getCloudinaryImageUrl(company.bannerUrl, {
                  width: 1200,
                  height: 300,
                  crop: "fill",
                }) || "/placeholder_banner.png"
              }')`,
            }}
          />
        </div>

        {/* Company Card + Tabs Container */}
        <div className="relative bg-white rounded-b-xl shadow p-6 px-4 md:px-8 pt-10 flex flex-col items-start z-20">
          {/* Logo */}
          <div className="absolute -top-20 left-0 right-0 md:left-8 md:right-auto z-30">
            <div className="w-32 h-32 mx-auto md:mx-0 border-6 border-white rounded-md bg-white">
              <div className="w-full h-full bg-white rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src={
                    getCloudinaryImageUrl(company.logo, {
                      width: 200,
                      height: 200,
                      crop: "fill",
                    }) || "/placeholder_user.png"
                  }
                  alt="Company Logo"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center mt-4 max-w-lg w-full space-y-1 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              {company.admin.name}
            </h1>
            <p className="text-sm text-gray-600">{company.location}</p>
            {company.website && (
              <p className="text-sm text-gray-600">
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {company.website}
                </a>
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            {["About", "Jobs", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`pb-2 px-1 font-medium transition ${
                  activeTab === tab
                    ? "text-[#6096B4] border-b-2 border-[#6096B4]"
                    : "text-gray-500 hover:text-[#6096B4] border-b-2 border-transparent hover:border-[#6096B4]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="w-full">
            {activeTab === "About" && (
              <div className="text-gray-700 space-y-4">
                {company.description ? (
                  <div className="company-description text-gray-700 text-justify break-words">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: company?.description || "<p>No description</p>",
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No company description provided.
                  </p>
                )}
                {company.foundedYear && (
                  <p className="text-sm">Founded Year: {company.foundedYear}</p>
                )}
                {company.industry && (
                  <p className="text-sm">Industry: {company.industry}</p>
                )}
              </div>
            )}
            {activeTab === "Jobs" && (
              <div>
                {jobsLoading ? (
                  <JobsListSkeleton />
                ) : jobs.length === 0 ? (
                  <p className="text-gray-600">
                    No published jobs from this company yet.
                  </p>
                ) : (
                  <>
                    <ul className="space-y-4">
                      {jobs.map((job) => (
                        <li
                          key={job.id}
                          className="border rounded p-4 hover:shadow-md transition cursor-pointer"
                        >
                          <a href={`/jobs/${job.id}`} className="block">
                            <h3 className="text-lg font-semibold text-[#6096B4]">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {job.location}
                            </p>
                            <p className="text-xs text-gray-400">
                              Posted:{" "}
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <Pagination
                      page={jobPage}
                      totalPages={jobTotalPages}
                      onPageChange={(newPage: number) => setJobPage(newPage)}
                    />
                  </>
                )}
              </div>
            )}
            {activeTab === "Reviews" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Leave a Review</h3>
                <ReviewForm
                  companyId={company.id}
                  onSubmitted={() => setRefreshKey((prev) => prev + 1)}
                />
                <h3 className="text-lg font-semibold mt-6">User Reviews</h3>
                <ReviewList companyId={company.id} refreshKey={refreshKey} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
