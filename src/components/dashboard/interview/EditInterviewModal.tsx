"use client";

import { InterviewItem } from "@/app/dashboard/interviews/page";
import { useFormik } from "formik";
import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";

interface Props {
  interview: InterviewItem;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditInterviewModal({
  interview,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      dateTime: interview.dateTime.slice(0, 16),
      location: interview.location ?? "",
      notes: interview.notes ?? "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await API.patch(`/interviews/${interview.id}`, values);
        toast.success("Interview updated successfully.");
        onUpdated();
      } catch {
        toast.error("Failed to update interview.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Interview</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formik.values.dateTime}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-[#6096B4] focus:border-[#6096B4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location (optional)
            </label>
            <input
              type="text"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-[#6096B4] focus:border-[#6096B4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-[#6096B4] focus:border-[#6096B4]"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
