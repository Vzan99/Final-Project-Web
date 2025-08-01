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
        console.log("Submit interview values:", values);
        await API.post("/interviews", values);
        toast.success("Interview berhasil dibuat!");
        resetForm();
        onCreated();
      } catch (err: any) {
        console.error("Interview creation error:", err);
        const message =
          err.response?.data?.error ||
          err.message ||
          "Gagal membuat interview.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    API.get("/jobs/")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => toast.error("Gagal mengambil daftar job"));
  }, []);

  useEffect(() => {
    if (formik.values.jobId) {
      API.get(`/applications/jobs/${formik.values.jobId}/applicants`)
        .then((res) => {
          const filtered = res.data.data.applicants.filter(
            (a: any) => a.status === "INTERVIEW"
          );
          console.log("Applicants from BE:", res.data.data);
          setApplicants(
            filtered.map((a: any) => ({
              userId: a.user?.id,
              name: a.user?.name,
              email: a.user?.email,
            }))
          );
        })
        .catch(() => toast.error("Gagal mengambil pelamar"));
    } else {
      setApplicants([]);
    }
  }, [formik.values.jobId]);

  const inputClass =
    "w-full border border-gray-300 px-3 py-2 rounded-md mt-1 focus:ring-[#6096B4] focus:border-[#6096B4] focus:outline-none";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5 max-w-2xl">
      <h2 className="text-xl font-bold text-[#6096B4]">
        Buat Jadwal Interview
      </h2>

      <div>
        <label className="block font-semibold">Pilih Job</label>
        <select
          name="jobId"
          value={formik.values.jobId}
          onChange={formik.handleChange}
          className={inputClass}
        >
          <option value="">Pilih job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Pilih Pelamar</label>
        <select
          name="userId"
          value={formik.values.userId}
          onChange={formik.handleChange}
          disabled={!formik.values.jobId}
          className={inputClass}
        >
          <option value="">Pilih pelamar</option>
          {applicants.map((user, idx) => (
            <option key={user.userId || idx} value={user.userId}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Tanggal & Waktu</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={formik.values.dateTime}
          onChange={formik.handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block font-semibold">Lokasi (Opsional)</label>
        <input
          type="text"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block font-semibold">Catatan (Opsional)</label>
        <textarea
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#6096B4] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#4d7a96] transition font-medium disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Buat Interview"}
      </button>
    </form>
  );
}
