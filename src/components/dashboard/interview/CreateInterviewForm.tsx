"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";

interface JobOption {
  id: string;
  title: string;
}

interface ApplicantOption {
  userId: string;
  name: string;
  email: string;
}

interface Props {
  onCreated: () => void;
}

export default function CreateInterviewForm({ onCreated }: Props) {
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [applicants, setApplicants] = useState<ApplicantOption[]>([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      jobId: "",
      userId: "",
      dateTime: "",
      location: "",
      notes: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        await API.post("/interviews", values);
        toast.success("Interview successfully created!");
        resetForm();
        onCreated();
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.message ||
          "Failed to create interview.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    API.get("/jobs/")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => toast.error("Failed to fetch jobs"));
  }, []);

  useEffect(() => {
    if (formik.values.jobId) {
      API.get(`/applications/jobs/${formik.values.jobId}/applicants`)
        .then((res) => {
          const filtered = res.data.data.applicants.filter(
            (a: any) => a.status === "INTERVIEW"
          );
          setApplicants(
            filtered.map((a: any) => ({
              userId: a.user?.id,
              name: a.user?.name,
              email: a.user?.email,
            }))
          );
        })
        .catch(() => toast.error("Failed to fetch applicants"));
    } else {
      setApplicants([]);
    }
  }, [formik.values.jobId]);

  const inputClass =
    "w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-[#6096B4] focus:border-[#6096B4] focus:outline-none";

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto px-4 sm:px-6 text-sm sm:text-base"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-[#6096B4] text-center sm:text-left">
        Create Interview Schedule
      </h2>

      {/* Select Job & Applicant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Select Job
          </label>
          <select
            name="jobId"
            value={formik.values.jobId}
            onChange={formik.handleChange}
            className={`${inputClass} w-full text-sm sm:text-base`}
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Select Applicant
          </label>
          <select
            name="userId"
            value={formik.values.userId}
            onChange={formik.handleChange}
            disabled={!formik.values.jobId}
            className={`${inputClass} w-full text-sm sm:text-base`}
          >
            <option value="">Select applicant</option>
            {applicants.map((user, idx) => (
              <option key={user.userId || idx} value={user.userId}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Date & Time
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formik.values.dateTime}
            onChange={formik.handleChange}
            className={`${inputClass} w-full text-sm sm:text-base`}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            className={`${inputClass} w-full text-sm sm:text-base`}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block font-medium mb-1 text-sm sm:text-base">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          className={`${inputClass} w-full text-sm sm:text-base`}
        />
      </div>

      {/* Submit */}
      <div className="pt-2 flex justify-center sm:justify-start">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6096B4] text-white px-4 py-2 rounded-md text-sm hover:bg-[#4d7a96] transition disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "Saving..." : "Create Interview"}
        </button>
      </div>
    </form>
  );
}
