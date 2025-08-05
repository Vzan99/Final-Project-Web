"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { preSelectionAnswerSchema } from "./preSelectionAnswerSchema";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import PreSelectionQuestionCard from "./PreSelectionQuestionCard";
import PreSelectionTestAnswerSkeleton from "./PreSelectionTestAnswerSkeleton";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS_PER_PAGE = 5;

export default function PreSelectionAnswerForm() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const formik = useFormik({
    initialValues: { answers: Array(25).fill(undefined) },
    validationSchema: preSelectionAnswerSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await API.post(
          `/pre-selection-tests/jobs/${id}/pre-selection-test/submit`,
          values
        );
        toast.success("Test successfully sent!");
        router.push(`/jobs`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to submit test.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    API.get(`/pre-selection-tests/jobs/${id}/pre-selection-test`)
      .then((res) => setQuestions(res.data.data.questions))
      .catch(() => toast.error("Failed to load test"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PreSelectionTestAnswerSkeleton />;
  if (!questions.length) return <p>No question available.</p>;

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

      {/* Pagination + Cancel Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>

          <p className="text-gray-600 text-sm">
            Page {currentPage} of {totalPages}
          </p>

          {currentPage < totalPages ? (
            <button
              type="button"
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => router.push(`/jobs`)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
