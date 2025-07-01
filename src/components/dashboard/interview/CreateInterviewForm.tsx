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
        toast.success("Interview berhasil dibuat!");
        resetForm();
        onCreated();
      } catch (err) {
        toast.error("Gagal membuat interview.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch jobs on mount
  useEffect(() => {
    API.get("/jobs/")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => toast.error("Gagal mengambil daftar job"));
  }, []);

  // Fetch applicants when jobId changes
  useEffect(() => {
    if (formik.values.jobId) {
      API.get(`/applications/jobs/${formik.values.jobId}/applicants`)
        .then((res) => {
          const filtered = res.data.data.filter(
            (a: any) => a.status === "INTERVIEW"
          );
          setApplicants(
            filtered.map((a: any) => ({
              userId: a.userId,
              name: a.name,
              email: a.email,
            }))
          );
        })
        .catch(() => toast.error("Gagal mengambil pelamar"));
    } else {
      setApplicants([]);
    }
  }, [formik.values.jobId]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 border p-4 rounded-md mb-8"
    >
      <h2 className="text-lg font-bold mb-2">Buat Jadwal Interview</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Job</label>
        <select
          name="jobId"
          value={formik.values.jobId}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Pilih job</option>
          {Array.isArray(jobs) &&
            jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Pelamar</label>
        <select
          name="userId"
          value={formik.values.userId}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
          disabled={!formik.values.jobId}
        >
          <option value="">Pilih pelamar</option>
          {applicants.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tanggal & Waktu
        </label>
        <input
          type="datetime-local"
          name="dateTime"
          value={formik.values.dateTime}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Lokasi (opsional)
        </label>
        <input
          type="text"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Catatan (opsional)
        </label>
        <textarea
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Buat Interview"}
      </button>
    </form>
  );
}
