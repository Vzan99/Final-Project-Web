"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import API from "@/lib/axios";
import { toast } from "react-toastify";

type Props = {
  jobId: string;
  open: boolean;
  onClose: () => void;
};

export default function ApplyJobModal({ jobId, open, onClose }: Props) {
  const [expectedSalary, setExpectedSalary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Resume is required.");
      return;
    }

    if (resume.size > 1024 * 1024) {
      toast.error("Resume must be less than 1MB.");
      return;
    }

    const formData = new FormData();
    formData.append("expectedSalary", expectedSalary);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);

    try {
      setLoading(true);

      console.log("POST to:", `/jobs/${jobId}/apply`);

      await API.post(`/jobs/${jobId}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Application submitted!");

      // Reset form
      setExpectedSalary("");
      setCoverLetter("");
      setResume(null);
      onClose();
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.error || "Failed to submit application.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel
          className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative"
          aria-modal="true"
          role="dialog"
        >
          <button onClick={onClose} className="absolute top-3 right-3">
            <X size={20} />
          </button>

          <Dialog.Title className="text-lg font-semibold mb-4">
            Apply for this Job
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Expected Salary</label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Cover Letter (optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Resume (PDF/DOC/Image)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#6096B4] text-white px-4 py-2 rounded hover:bg-[#517d98] transition"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
