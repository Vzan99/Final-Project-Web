"use client";

import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Send } from "lucide-react";
import { Job } from "@/types/jobs";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { JobDetailsSkeleton } from "../loadingSkeleton/jobDetailsSkeleton";
import ApplyJobModal from "../jobs/ApplyJobModal";
import Link from "next/link";
import ProtectedButton from "@/components/protectedButton";
import SocialShare from "@/components/socialShare";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import toFriendlyName from "@/utils/friendly";

function isProfileComplete(user: RootState["auth"]["user"] | null) {
  if (!user || !user.profile) return false;

  const { birthDate, gender, education, address } = user.profile;

  return (
    birthDate &&
    birthDate.trim() !== "" &&
    gender &&
    gender.trim() !== "" &&
    education &&
    education.trim() !== "" &&
    address &&
    address.trim() !== ""
  );
}

type JobDetailsCardProps = {
  job: Job | null;
};

export function JobDetailsCard({ job }: JobDetailsCardProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [testStatus, setTestStatus] = useState<{
    submitted: boolean;
    score?: number;
    passed?: boolean;
  } | null>(null);
  const [hasApplied, setHasApplied] = useState<boolean | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showProfileIncompleteBanner, setShowProfileIncompleteBanner] =
    useState(false);

  const profileComplete = isProfileComplete(user);

  const isUserVerifiedAndAllowed =
    user && user.isVerified && user.role === "USER";

  useEffect(() => {
    if (!job) return;

    let isMounted = true;

    const fetchAllData = async () => {
      try {
        if (!isUserVerifiedAndAllowed) {
          setIsSaved(false);
          setHasApplied(false);
          setTestStatus(null);
        }

        const tasks: Promise<any>[] = [];

        const suggestedPromise = API.get(
          `/jobs/company/${job.company?.id}/suggestions`,
          {
            params: { excludeJobId: job.id },
            withCredentials: false,
          }
        )
          .then((res) => {
            if (isMounted) setSuggestedJobs(res.data);
          })
          .catch((err) => {
            console.error("Fetch suggested jobs error:", err);
          });
        tasks.push(suggestedPromise);

        if (isUserVerifiedAndAllowed) {
          const savedPromise = API.get("/jobs/saved", {
            withCredentials: true,
          })
            .then((res) => {
              const savedJobs = Array.isArray(res.data) ? res.data : [];
              if (isMounted) setIsSaved(savedJobs.some((j) => j.id === job.id));
            })
            .catch((err) => {
              console.error("Fetch saved jobs error:", err);
              if (isMounted) setIsSaved(false);
            });

          const testPromise = job.hasTest
            ? API.get(
                `/pre-selection-tests/${job.id}/pre-selection-submitted`,
                { withCredentials: true }
              )
                .then((res) => {
                  if (isMounted) setTestStatus(res.data.data);
                })
                .catch((err) => {
                  console.error("Fetch test status error:", err);
                })
            : Promise.resolve();

          const appliedPromise = API.get(`/applications/${job.id}/status`, {
            withCredentials: true,
          })
            .then((res) => {
              if (isMounted) setHasApplied(res.data.applied);
            })
            .catch((err) => {
              console.error("Fetch application status error:", err);
              if (isMounted) setHasApplied(false);
            });

          tasks.push(savedPromise, testPromise, appliedPromise);
        }

        await Promise.all(tasks);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [job, user, isUserVerifiedAndAllowed]);

  const rawLogoId = job?.company?.logo;
  const logoUrl =
    getCloudinaryImageUrl(rawLogoId, {
      width: 128,
      height: 128,
      crop: "fill",
    }) || "/precise_logo.jpeg";

  const handleSave = async () => {
    if (!job || isSaved === null) return;

    setSaving(true);
    try {
      if (isSaved) {
        await API.delete(`/jobs/${job.id}/save`, { withCredentials: true });
        setIsSaved(false);
        toast.success("Removed from saved jobs");
      } else {
        await API.post(`/jobs/${job.id}/save`, {}, { withCredentials: true });
        setIsSaved(true);
        toast.success("Job saved");
      }
    } catch (err) {
      toast.error("Failed to update saved jobs");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyClick = () => {
    setShowProfileIncompleteBanner(false);
    if (!profileComplete) {
      setShowProfileIncompleteBanner(true);
      return;
    }
    setShowApplyForm(true);
  };

  const handleTakePreTestClick = () => {
    setShowProfileIncompleteBanner(false);
    if (!profileComplete) {
      setShowProfileIncompleteBanner(true);
      return;
    }
    window.location.assign(`/jobs/${job?.id}/pre-selection-test`);
  };

  if (!job || isLoading) {
    return <JobDetailsSkeleton />;
  }

  const isExpired = job.isExpired;
  const isClosed = job.isClosed;
  const isPublished = job.status === "PUBLISHED";
  const companyName = job.company?.admin?.name ?? "Unknown Company";

  const renderSaveButton = () => {
    if (isSaved === null) {
      return <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />;
    }

    return (
      <ProtectedButton
        allowedRoles={["USER"]}
        requireVerified={true}
        onClick={handleSave}
        disabled={saving}
        className={`p-2 rounded-full bg-white transition ${
          isSaved
            ? "bg-[#6096B4]/20 text-[#6096B4] hover:bg-gray-100"
            : "hover:bg-gray-100 hover:text-[#6096B4]"
        }`}
        title={isSaved ? "Unsave Job" : "Save Job"}
      >
        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </ProtectedButton>
    );
  };

  const renderApplyButton = () => {
    if (!isPublished || isClosed || isExpired) {
      return (
        <p className="mt-2 text-md text-red-800 font-bold">
          {isClosed
            ? "This job has been closed by the company."
            : isExpired
            ? "This job has expired."
            : "This job is not available."}
        </p>
      );
    }

    if (hasApplied) {
      return (
        <button
          disabled
          className="mt-2 flex items-center gap-2 bg-gray-300 text-gray-600 px-6 py-2 rounded-lg cursor-not-allowed"
        >
          Already Applied
        </button>
      );
    }

    if (job.hasTest) {
      if (!user || testStatus === null || !testStatus.submitted) {
        return (
          <>
            <ProtectedButton
              allowedRoles={["USER"]}
              requireVerified={true}
              onClick={handleTakePreTestClick}
              className="mt-2 flex items-center gap-2 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Take Pre-Test
            </ProtectedButton>
            {showProfileIncompleteBanner && (
              <div className="mt-2 p-3 rounded bg-yellow-100 border border-yellow-300 text-yellow-900 font-semibold text-center">
                Please complete your profile (birth date, gender, education, and
                current address) before taking the pre-test.{" "}
                <Link
                  href="/profile/user"
                  className="underline hover:text-yellow-700"
                >
                  Go to Profile
                </Link>
              </div>
            )}
          </>
        );
      }

      if (testStatus.passed) {
        return (
          <>
            <ProtectedButton
              allowedRoles={["USER"]}
              requireVerified={true}
              onClick={handleApplyClick}
              className="mt-2 flex items-center gap-2 bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#517d98] transition"
            >
              <Send size={16} /> Apply Now
            </ProtectedButton>
            {showProfileIncompleteBanner && (
              <div className="mt-2 p-3 rounded bg-yellow-100 border border-yellow-300 text-yellow-900 font-semibold text-center">
                Please complete your profile (birth date, gender, education, and
                current address) before applying.{" "}
                <Link
                  href="/profile/user"
                  className="underline hover:text-yellow-700"
                >
                  Go to Profile
                </Link>
              </div>
            )}
          </>
        );
      }

      return (
        <p className="text-sm text-red-500">You did not pass the pre-test.</p>
      );
    }

    return (
      <>
        <ProtectedButton
          allowedRoles={["USER"]}
          requireVerified={true}
          onClick={handleApplyClick}
          className="mt-2 flex items-center gap-2 bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#517d98] transition"
        >
          <Send size={16} /> Apply Now
        </ProtectedButton>
        {showProfileIncompleteBanner && (
          <div className="mt-2 p-3 rounded bg-yellow-100 border border-yellow-300 text-yellow-900 font-semibold text-center">
            Please complete your profile (birth date, gender, education, and
            current address) before applying.{" "}
            <Link
              href="/profile/user"
              className="underline hover:text-yellow-700"
            >
              Go to Profile
            </Link>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="relative space-y-4">
      <div className="hidden sm:flex absolute top-0 right-0 gap-2 p-2 z-10">
        {renderSaveButton()}
        <SocialShare
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={`Check out this job: ${job.title} at ${companyName}`}
        />
      </div>

      <div className="flex items-center gap-4">
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="w-16 h-16 object-contain rounded"
        />
        <div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 hover:underline cursor-pointer">
              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
            </h2>
          </div>

          {job.company?.id ? (
            <Link
              href={`/companies/${job.company.id}`}
              className="text-gray-600 hover:underline"
            >
              {companyName}
            </Link>
          ) : (
            <p className="text-gray-600">{companyName}</p>
          )}

          <p className="text-sm text-gray-500">{job.location}</p>
          <p className="text-xs text-gray-400">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {job.jobType && (
          <div>
            <span className="font-semibold text-gray-700">Job Type:</span>{" "}
            {job.jobType}
          </div>
        )}
        {job.experienceLevel && (
          <div>
            <span className="font-semibold text-gray-700">Experience:</span>{" "}
            {job.experienceLevel}
          </div>
        )}
        {job.salary !== undefined && (
          <div>
            <span className="font-semibold text-gray-700">Salary:</span> Rp.
            {job.salary.toLocaleString()}
          </div>
        )}
        <div>
          <span className="font-semibold text-gray-700">Employment Type:</span>{" "}
          {toFriendlyName(job.employmentType)}
        </div>

        <div>
          <span className="font-semibold text-gray-700">Job Category:</span>{" "}
          {toFriendlyName(job.jobCategory)}
        </div>

        <div>
          <span className="font-semibold text-gray-700">
            Application Deadline:
          </span>{" "}
          {job.deadline
            ? new Date(job.deadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Not specified"}
        </div>

        <div>
          <span className="font-semibold text-gray-700">Remote:</span>{" "}
          {job.isRemote ? "Yes" : "No"}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:block">
        <div className="flex items-center justify-between gap-2 sm:block">
          {renderApplyButton()}

          {/* Mobile-only save/share buttons */}
          <div className="flex gap-2 sm:hidden">
            {renderSaveButton()}
            <SocialShare
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={`Check out this job: ${job.title} at ${companyName}`}
            />
          </div>
        </div>
      </div>

      <div className="prose max-w-none text-sm text-gray-800 whitespace-pre-line pt-4 text-justify">
        {job.description}
      </div>

      {suggestedJobs.length > 0 && (
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            More jobs from {companyName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {suggestedJobs.map((suggestedJob) => (
              <Link
                key={suggestedJob.id}
                href={`/jobs/${suggestedJob.id}`}
                className="block border p-3 rounded shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {suggestedJob.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {suggestedJob.location}
                </p>
                <p className="text-xs text-gray-400">
                  Rp. {suggestedJob.salary?.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ApplyJobModal
        jobId={job.id}
        open={showApplyForm}
        onClose={() => setShowApplyForm(false)}
        setHasApplied={setHasApplied}
      />
    </div>
  );
}
