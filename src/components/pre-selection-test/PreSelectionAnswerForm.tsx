"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { preSelectionAnswerSchema } from "./preSelectionAnswerSchema";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import PreSelectionQuestionCard from "./PreSelectionQuestionCard";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS_PER_PAGE = 5;

export default function PreSelectionAnswerForm() {
  const { id } = useParams(); // jobId
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const formik = useFormik({
    initialValues: { answers: Array(25).fill(undefined) },
    validationSchema: preSelectionAnswerSchema,
    onSubmit: async (values) => {
      try {
        await API.post(
          `/pre-selection-tests/jobs/${id}/pre-selection-test/submit`,
          values
        );
        toast.success("Tes berhasil dikirim!");
        router.push(`/jobs`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Gagal submit tes.");
      }
    },
  });

  useEffect(() => {
    API.get(`/pre-selection-tests/jobs/${id}/pre-selection-test`)
      .then((res) => setQuestions(res.data.data.questions))
      .catch(() => toast.error("Gagal memuat soal"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!questions.length) return <p>Soal tidak tersedia.</p>;

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col px-4 lg:px-12 py-6 gap-6 max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <h1 className="text-2xl font-bold text-gray-800">Pre-Selection Test</h1>

      {/* Question Cards */}
      <div className="space-y-4">
        {currentQuestions.map((q, i) => {
          const actualIndex = startIndex + i;
          return (
            <PreSelectionQuestionCard
              key={actualIndex}
              index={actualIndex}
              question={q.question}
              options={q.options}
              value={formik.values.answers[actualIndex]}
              onChange={(val) =>
                formik.setFieldValue(`answers[${actualIndex}]`, val)
              }
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
        >
          Sebelumnya
        </button>

        <p className="text-gray-600 text-sm">
          Halaman {currentPage} dari {totalPages}
        </p>

        {currentPage < totalPages ? (
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Selanjutnya
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Submit Jawaban
          </button>
        )}
      </div>
    </form>
  );
}
