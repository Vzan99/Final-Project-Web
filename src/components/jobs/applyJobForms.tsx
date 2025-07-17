"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "@/lib/axios";

type ApplyJobFormProps = {
  jobId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ApplyJobForm({
  jobId,
  onSuccess,
  onCancel,
}: ApplyJobFormProps) {
  const [expectedSalary, setExpectedSalary] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvFile) {
      toast.error("Please upload your CV file");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", cvFile);
    formData.append("expectedSalary", expectedSalary);
    formData.append("coverLetter", coverLetter);

    setLoading(true);
    try {
      await API.post(`/jobs/${jobId}/apply`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Application submitted successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to apply for the job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Expected Salary */}
      <div>
        <label htmlFor="expectedSalary" className="block text-sm font-medium">
          Expected Salary ($)
        </label>
        <input
          id="expectedSalary"
          type="number"
          value={expectedSalary}
          onChange={(e) => setExpectedSalary(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* CV Upload */}
      <div>
        <label htmlFor="cvFile" className="block text-sm font-medium">
          Upload CV
        </label>
        <input
          id="cvFile"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Cover Letter */}
      <div>
        <label htmlFor="coverLetter" className="block text-sm font-medium">
          Cover Letter (optional)
        </label>
        <textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={5}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#517d98]"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply"}
        </button>
      </div>
    </form>
  );
}
