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
  banner?: File; // ✅ ganti dari bannerUrl menjadi banner (File)
  hasTest: boolean;
}

interface JobFormProps {
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: FormData) => Promise<void>;
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
  banner: undefined,
  hasTest: false,
};

const textFields = [
  ["title", "Job Title"],
  ["description", "Description"],
  ["location", "Location"],
  ["category", "Category Name (e.g., UI/UX, Backend, etc)"],
  ["deadline", "Deadline (YYYY-MM-DD)"],
  ["salary", "Salary (optional)"],
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
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, val]) => {
          if (key === "tags") {
            (val as string[]).forEach((tag: string) =>
              formData.append("tags", tag)
            );
          } else if (key === "banner" && val instanceof File) {
            formData.append("banner", val);
          } else if (
            typeof val === "boolean" ||
            typeof val === "number" ||
            typeof val === "string"
          ) {
            formData.append(key, String(val));
          }
        });

        await onSubmit(formData);
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
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 max-w-xl bg-white p-6 rounded-xl shadow-md"
    >
      {textFields.map(([key, label]) => {
        type FieldKey = keyof JobFormValues;
        const fieldKey = key as FieldKey;

        return (
          <div key={key}>
            <label className="block font-semibold text-[#1a1a1a]">
              {label}
            </label>
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
              <p className="text-red-500 text-sm">
                {formik.errors[fieldKey] as string}
              </p>
            )}
          </div>
        );
      })}

      {/* Upload Banner */}
      <div>
        <label className="block font-semibold text-[#1a1a1a]">
          Upload Banner
        </label>
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            formik.setFieldValue("banner", file);
          }}
          className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 text-sm file:bg-[#6096B4] file:text-white file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
        />
        {formik.errors.banner && (
          <p className="text-red-500 text-sm">
            {formik.errors.banner as string}
          </p>
        )}
      </div>

      {/* Experience Level */}
      <div>
        <label className="block font-semibold text-[#1a1a1a]">
          Experience Level
        </label>
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

      {/* Job Type */}
      <div>
        <label className="block font-semibold text-[#1a1a1a]">Job Type</label>
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

      {/* Remote and Test */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isRemote"
          checked={formik.values.isRemote}
          onChange={formik.handleChange}
          className="accent-[#6096B4]"
        />
        <label className="font-semibold text-[#1a1a1a]">Is Remote?</label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="hasTest"
          checked={formik.values.hasTest}
          onChange={formik.handleChange}
          className="accent-[#6096B4]"
        />
        <label className="font-semibold text-[#1a1a1a]">
          Include Pre-Selection Test?
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#6096B4] text-white px-5 py-2 rounded-md hover:bg-[#4d7a96] transition font-medium"
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
