"use client";

import { useFormik } from "formik";
import { preSelectionTestSchema } from "./PreSelectionTestSchema";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import PreSelectionQuestionCard from "./PreSelectionQuestionCard";

export default function PreSelectionTestQuestionForm() {
  const { id } = useParams(); // jobId
  const router = useRouter();
  const [page, setPage] = useState(0); // 0-based index
  const pageSize = 5;

  const formik = useFormik({
    initialValues: {
      questions: Array.from({ length: 25 }, () => ({
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      })),
    },
    validationSchema: preSelectionTestSchema,
    onSubmit: async (values) => {
      try {
        await API.post("/pre-selection-tests", {
          jobId: id,
          questions: values.questions,
        });
        alert("Pre-selection test berhasil disimpan!");
        router.push(`/dashboard/jobs/${id}`);
      } catch (err: any) {
        alert(err?.response?.data?.message || "Terjadi kesalahan.");
      }
    },
  });

  const start = page * pageSize;
  const end = start + pageSize;
  const maxPage = Math.ceil(25 / pageSize);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">Buat Soal Pre-Selection Test</h2>

      {formik.values.questions.slice(start, end).map((_, idx) => (
        <PreSelectionQuestionCard
          key={start + idx}
          index={start + idx}
          formik={formik}
        />
      ))}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Sebelumnya
        </button>
        <div>
          Halaman {page + 1} / {maxPage}
        </div>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(maxPage - 1, p + 1))}
          disabled={page === maxPage - 1}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Selanjutnya
        </button>
      </div>

      {page === maxPage - 1 && (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit Soal
        </button>
      )}
    </form>
  );
}
