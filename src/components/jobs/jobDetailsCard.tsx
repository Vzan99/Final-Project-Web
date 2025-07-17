"use client";

import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Share2, Send } from "lucide-react";
import { Job } from "@/types/jobs";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { JobDetailsSkeleton } from "../loadingSkeleton/jobDetailsSkeleton";

import ApplyJobModal from "../jobs/ApplyJobModal";


type JobDetailsCardProps = {
  job: Job | null;
};

export function JobDetailsCard({ job }: JobDetailsCardProps) {
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [testStatus, setTestStatus] = useState<{
    submitted: boolean;
    score?: number;
    passed?: boolean;
  } | null>(null);

  const [showApplyForm, setShowApplyForm] = useState(false);


  useEffect(() => {
    if (!job) return;

    const fetchSaved = async () => {
      try {
        const res = await API.get("/jobs/saved", { withCredentials: true });
        const savedJobs = Array.isArray(res.data) ? res.data : [];
        setIsSaved(savedJobs.some((savedJob) => savedJob.id === job.id));
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
        setIsSaved(false);
      }
    };

    fetchSaved();
  }, [job]);

  useEffect(() => {
    if (!job?.company?.id) return;

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await API.get(
          `/jobs/company/${job.company?.id}/suggestions`,
          {
            params: { excludeJobId: job.id },
            withCredentials: false,
          }
        );
        setSuggestedJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch suggested jobs", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [job]);

  useEffect(() => {
    if (!job?.id || !job.hasTest) return;

    const fetchTestStatus = async () => {
      try {
        const res = await API.get(
          `/pre-selection-tests/${job.id}/pre-selection-submitted`,
          {
            withCredentials: true,
          }
        );
        setTestStatus(res.data.data);
      } catch (err) {
        console.error("Failed to fetch test status", err);
      }
    };

    fetchTestStatus();
  }, [job]);

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

  const handleShare = async () => {
    if (!job) return;
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/jobs/${job.id}`
      );
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy job link.");
      console.error(err);
    }
  };

  if (!job) return <JobDetailsSkeleton />;

  const companyName = job.company?.admin?.name ?? "Unknown Company";
  const logoUrl = job.company?.logo || "/precise_logo.jpeg";
  const bannerUrl = job.company?.bannerUrl;

  const renderSaveButton = () => {
    if (isSaved === null) {
      return <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />;
    }
    return (
      <button
        onClick={handleSave}
        disabled={saving}
        className={`p-2 rounded-full transition ${
          isSaved ? "bg-[#6096B4]/20 text-[#6096B4]" : "hover:bg-gray-100"
        }`}
        title={isSaved ? "Unsave Job" : "Save Job"}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Unsave Job" : "Save Job"}
      >
        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    );
  };

  const handleApply = () => {
    setShowApplyDialog(true);
  };

  return (
    <div className="relative space-y-4">
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt={`${companyName} banner`}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      {showApplyDialog && job && (
        <EditDialog
          open={showApplyDialog}
          onClose={() => setShowApplyDialog(false)}
          title={`Apply for ${job.title}`}
        >
          <ApplyJobForm
            jobId={job.id}
            onSuccess={() => setShowApplyDialog(false)}
            onCancel={() => setShowApplyDialog(false)}
          />
        </EditDialog>
      )}

      <div className="absolute top-0 right-0 flex gap-2 p-2 z-10">
        {renderSaveButton()}
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Share Job"
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="w-16 h-16 object-contain rounded"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
          <p className="text-gray-600">{companyName}</p>
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
            <span className="font-semibold text-gray-700">Salary:</span> $
            {job.salary.toLocaleString()}
          </div>
        )}
        <div>
          <span className="font-semibold text-gray-700">Remote:</span>{" "}
          {job.isRemote ? "Yes" : "No"}
        </div>
      </div>

      {job.hasTest ? (
        testStatus === null ? (
          <p className="text-sm text-gray-500 italic">
            Checking test status...
          </p>
        ) : !testStatus.submitted ? (
          <button
            onClick={() =>
              window.location.assign(`/jobs/${job.id}/pre-selection-test`)
            }
            className="mt-2 flex items-center gap-2 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Take Pre-Test
          </button>
        ) : testStatus.passed ? (
          <button
            onClick={() => setShowApplyForm(true)}
            className="mt-2 flex items-center gap-2 bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#517d98] transition"
          >
            <Send size={16} /> Apply Now
          </button>
        ) : (
          <p className="text-sm text-red-500">You did not pass the pre-test</p>
        )
      ) : (
        <button
          onClick={() => setShowApplyForm(true)}
          className="mt-2 flex items-center gap-2 bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#517d98] transition"
        >
          <Send size={16} /> Apply Now
        </button>
      )}

      <div className="prose max-w-none text-sm text-gray-800 whitespace-pre-line pt-4">
        {job.description}
      </div>

      {/* Suggested Jobs Section */}
      {suggestedJobs.length > 0 && (
        <div className="pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            More jobs from {companyName}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {suggestedJobs.map((suggestedJob) => (
              <div
                key={suggestedJob.id}
                className="border p-3 rounded shadow-sm"
              >
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {suggestedJob.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {suggestedJob.location}
                </p>
                <p className="text-xs text-gray-400">
                  ${suggestedJob.salary?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <ApplyJobModal
        jobId={job.id}
        open={showApplyForm}
        onClose={() => setShowApplyForm(false)}
      />
    </div>
  );
}
