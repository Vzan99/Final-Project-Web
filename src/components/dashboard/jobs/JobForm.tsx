"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { jobSchema } from "./JobSchema";
import debounce from "lodash.debounce";

interface JobFormValues {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  jobCategory: string;
  deadline: string;
  salary?: number;
  experienceLevel: string;
  employmentType: string;
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
  jobCategory: "",
  deadline: "",
  salary: undefined,
  experienceLevel: "Entry",
  employmentType: "Full-time",
  isRemote: false,
  tags: [],
  banner: undefined,
  hasTest: false,
};

const jobCategories = [
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULL_STACK_DEVELOPER",
  "MOBILE_APP_DEVELOPER",
  "DEVOPS_ENGINEER",
  "GAME_DEVELOPER",
  "SOFTWARE_ENGINEER",
  "DATA_ENGINEER",
  "SECURITY_ENGINEER",
  "OTHER",
];

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "VOLUNTEER",
  "OTHER",
];

export default function JobForm({
  initialValues = {},
  onSubmit,
  isEdit = false,
}: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<
    { formatted: string; lat: number; lng: number }[]
  >([]);

  const fetchSuggestions = debounce(async (q: string) => {
    if (!q) return setSuggestions([]);

    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        q
      )}&key=${process.env.NEXT_PUBLIC_OPENCAGE_KEY}&limit=5`
    );
    const { results } = await res.json();
    setSuggestions(
      results.map((r: any) => ({
        formatted: r.formatted,
        lat: r.geometry.lat,
        lng: r.geometry.lng,
      }))
    );
  }, 300);

  if (initialValues.deadline) {
    initialValues.deadline = initialValues.deadline.split("T")[0];
  }
  const formik = useFormik<JobFormValues>({
    initialValues: { ...defaultValues, ...initialValues },
    validationSchema: jobSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("location", values.location);
        if (values.latitude != null)
          formData.append("latitude", String(values.latitude));
        if (values.longitude != null)
          formData.append("longitude", String(values.longitude));
        formData.append("deadline", values.deadline);
        formData.append("experienceLevel", values.experienceLevel);
        formData.append("employmentType", values.employmentType);
        formData.append("jobCategory", values.jobCategory);
        formData.append("isRemote", String(values.isRemote));
        formData.append("hasTest", String(values.hasTest));
        if (values.salary) formData.append("salary", String(values.salary));
        if (values.banner instanceof File) {
          formData.append("banner", values.banner);
        }
        values.tags.forEach((tag) => formData.append("tags", tag));

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

        {/* Text Inputs */}
        {[
          { label: "Job Title", name: "title" },
          { label: "Description", name: "description" },
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

        <div className="relative">
          <label className="block font-semibold text-[#1a1a1a]">Location</label>
          <input
            type="text"
            name="location"
            value={formik.values.location}
            onChange={(e) => {
              formik.setFieldValue("location", e.target.value);
              fetchSuggestions(e.target.value);
              formik.setFieldValue("latitude", undefined);
              formik.setFieldValue("longitude", undefined);
            }}
            autoComplete="off"
            className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full mt-1 max-h-60 overflow-auto rounded shadow-lg">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    formik.setFieldValue("location", s.formatted);
                    formik.setFieldValue("latitude", s.lat);
                    formik.setFieldValue("longitude", s.lng);
                    setSuggestions([]);
                  }}
                >
                  {s.formatted}
                </li>
              ))}
            </ul>
          )}
          {formik.errors.location && (
            <p className="text-red-500 text-sm">{formik.errors.location}</p>
          )}
        </div>

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
            type="text"
            name="salary"
            value={
              formik.values.salary !== undefined
                ? formik.values.salary.toLocaleString("en-US")
                : ""
            }
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const parsed = parseInt(rawValue, 10);
              if (!isNaN(parsed)) {
                formik.setFieldValue("salary", parsed);
              } else {
                formik.setFieldValue("salary", undefined);
              }
            }}
            className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
          />
          {formik.errors.salary && (
            <p className="text-red-500 text-sm">{formik.errors.salary}</p>
          )}
        </div>

        {/* Category Select */}
        <div>
          <label className="block font-semibold text-[#1a1a1a]">Category</label>
          <select
            name="jobCategory"
            value={formik.values.jobCategory}
            onChange={formik.handleChange}
            className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
          >
            <option value="">Select a category</option>
            {jobCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          {formik.errors.jobCategory && (
            <p className="text-red-500 text-sm">{formik.errors.jobCategory}</p>
          )}
        </div>

        {/* Job Type & Experience Level */}
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
              name="employmentType"
              value={formik.values.employmentType}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
            >
              <option value="">Select type</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold text-[#1a1a1a]">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. react, frontend, remote"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "," || e.key === "Enter") {
                e.preventDefault();
                const value = tagInput.trim();
                if (value && !formik.values.tags.includes(value)) {
                  formik.setFieldValue("tags", [...formik.values.tags, value]);
                }
                setTagInput("");
              } else if (e.key === "Backspace" && tagInput === "") {
                const newTags = [...formik.values.tags];
                newTags.pop();
                formik.setFieldValue("tags", newTags);
              }
            }}
            className="w-full border px-3 py-2 rounded mt-1 text-sm focus:ring-[#6096B4] focus:border-[#6096B4]"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formik.values.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#6096B4] text-white px-2 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    formik.setFieldValue(
                      "tags",
                      formik.values.tags.filter((t) => t !== tag)
                    )
                  }
                  className="text-white hover:text-gray-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
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
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/jobs")}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>

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
        </div>
      </form>
    </div>
  );
}
