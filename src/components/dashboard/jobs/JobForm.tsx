"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { jobSchema } from "./JobSchema";

interface JobFormValues {
  title: string;
  description: string;
  location: string;
  category: string;
  deadline: string;
  salary?: number;
  experienceLevel: "Entry" | "Mid" | "Senior";
  jobType: "Full-time" | "Part-time" | "Contract";
  isRemote: boolean;
  tags: string[];
  bannerUrl?: string;
  hasTest: boolean;
}

interface JobFormProps {
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => Promise<void>;
  isEdit?: boolean;
}

const defaultValues: JobFormValues = {
  title: "",
  description: "",
  location: "",
  category: "",
  deadline: "",
  salary: undefined,
  experienceLevel: "Entry",
  jobType: "Full-time",
  isRemote: false,
  tags: [],
  bannerUrl: "",
  hasTest: false,
};

const textFields = [
  ["title", "Job Title"],
  ["description", "Description"],
  ["location", "Location"],
  ["category", "Category Name (e.g., UI/UX, Backend, etc)"],
  ["deadline", "Deadline (YYYY-MM-DD)"],
  ["salary", "Salary (optional)"],
  ["bannerUrl", "Banner URL (optional)"],
] as const;

export default function JobForm({
  initialValues = {},
  onSubmit,
  isEdit = false,
}: JobFormProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik<JobFormValues>({
    initialValues: { ...defaultValues, ...initialValues },
    validationSchema: jobSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await onSubmit(values);
        toast.success(isEdit ? "Job updated!" : "Job created!");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to submit job");
      } finally {
        setLoading(false);
      }
    },
  });

  const inputClass =
    "w-full border px-3 py-2 rounded mt-1 focus:ring-[#6096B4] focus:border-[#6096B4]";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-xl">
      {textFields.map(([key, label]) => {
        type FieldKey = keyof JobFormValues;
        const fieldKey = key as FieldKey;

        return (
          <div key={key}>
            <label className="block font-semibold">{label}</label>
            <input
              type={fieldKey === "salary" ? "number" : "text"}
              name={fieldKey}
              onChange={formik.handleChange}
              value={
                formik.values[fieldKey] !== undefined
                  ? String(formik.values[fieldKey])
                  : ""
              }
              className={inputClass}
            />
            {formik.touched[fieldKey] && formik.errors[fieldKey] && (
              <p className="text-red-500 text-sm">{formik.errors[fieldKey]}</p>
            )}
          </div>
        );
      })}

      <div>
        <label className="block font-semibold">Experience Level</label>
        <select
          name="experienceLevel"
          value={formik.values.experienceLevel}
          onChange={formik.handleChange}
          className={inputClass}
        >
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold">Job Type</label>
        <select
          name="jobType"
          value={formik.values.jobType}
          onChange={formik.handleChange}
          className={inputClass}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className="font-semibold">Is Remote?</label>
        <input
          type="checkbox"
          name="isRemote"
          checked={formik.values.isRemote}
          onChange={formik.handleChange}
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="font-semibold">Include Pre-Selection Test?</label>
        <input
          type="checkbox"
          name="hasTest"
          checked={formik.values.hasTest}
          onChange={formik.handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#6096B4] text-white px-4 py-2 rounded hover:bg-[#4d7a96]"
      >
        {loading
          ? isEdit
            ? "Updating..."
            : "Submitting..."
          : isEdit
          ? "Update Job"
          : "Create Job"}
      </button>
    </form>
  );
}
