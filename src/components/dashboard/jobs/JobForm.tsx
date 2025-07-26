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
  banner?: File;
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
            (val as string[]).forEach((tag) => formData.append("tags", tag));
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

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 max-w-xl bg-white p-6 rounded-xl shadow-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-[#6096B4] mb-4">
          {isEdit ? "Edit Job" : "Create Job"}
        </h2>

        {/* Input Fields */}
        {[
          { label: "Job Title", name: "title" },
          { label: "Description", name: "description" },
          { label: "Location", name: "location" },
          { label: "Category", name: "category" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-semibold text-[#1a1a1a]">
              {label}
            </label>
            <input
              type="text"
              name={name}
              value={(formik.values as any)[name] ?? ""}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
            />
            {(formik.errors as any)[name] && (
              <p className="text-red-500 text-sm">
                {(formik.errors as any)[name]}
              </p>
            )}
          </div>
        ))}

        {/* Deadline */}
        <div>
          <label className="block font-semibold text-[#1a1a1a]">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formik.values.deadline}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
          />
          {formik.errors.deadline && (
            <p className="text-red-500 text-sm">{formik.errors.deadline}</p>
          )}
        </div>

        {/* Salary */}
        <div>
          <label className="block font-semibold text-[#1a1a1a]">Salary</label>
          <input
            type="number"
            name="salary"
            value={formik.values.salary ?? ""}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
          />
          {formik.errors.salary && (
            <p className="text-red-500 text-sm">{formik.errors.salary}</p>
          )}
        </div>

        {/* Banner Upload */}
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
            className="w-full border px-3 py-2 rounded mt-1 text-sm file:bg-[#6096B4] file:text-white file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
          />
          {formik.errors.banner && (
            <p className="text-red-500 text-sm">{formik.errors.banner}</p>
          )}
        </div>

        {/* Select Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#1a1a1a]">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formik.values.experienceLevel}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
            >
              {["Entry", "Mid", "Senior"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1a1a1a]">
              Job Type
            </label>
            <select
              name="jobType"
              value={formik.values.jobType}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
            >
              {["Full-time", "Part-time", "Contract"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isRemote"
            checked={formik.values.isRemote}
            onChange={formik.handleChange}
            className="accent-[#6096B4]"
          />
          <label className="font-semibold text-[#1a1a1a]">Remote?</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="hasTest"
            checked={formik.values.hasTest}
            onChange={formik.handleChange}
            className="accent-[#6096B4]"
          />
          <label className="font-semibold text-[#1a1a1a]">Include Test?</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6096B4] text-white px-5 py-2 rounded-lg hover:bg-[#4d7a96] transition font-medium"
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
    </div>
  );
}
