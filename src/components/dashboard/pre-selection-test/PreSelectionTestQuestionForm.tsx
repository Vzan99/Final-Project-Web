"use client";

import { useFormik } from "formik";
import { preSelectionTestSchema } from "./PreSelectionTestSchema";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import PreSelectionQuestionCard from "./PreSelectionQuestionCard";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Props {
  jobId: string;
  initialQuestions: Question[];
  mode: "create" | "edit";
}
export default function PreSelectionTestQuestionForm({
  jobId,
  initialQuestions,
  mode,
}: Props) {
  const { id } = useParams();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageSize = 5;

  const formik = useFormik({
    initialValues: {
      questions:
        mode === "edit" && initialQuestions.length === 25
          ? initialQuestions
          : Array.from({ length: 25 }, () => ({
              question: "",
              options: ["", "", "", ""],
              correctIndex: 0,
            })),
    },
    validationSchema: preSelectionTestSchema,
    onSubmit: async (values) => {
      const jobId = Array.isArray(id) ? id[0] : id;

      if (!jobId || typeof jobId !== "string") {
        alert("Job ID is not valid.");
        return;
      }
      setIsSubmitting(true);
      try {
        if (mode === "create") {
          await API.post("/pre-selection-tests", {
            jobId,
            questions: values.questions,
          });
        } else {
          await API.patch(`/pre-selection-tests/${jobId}`, {
            questions: values.questions,
          });
        }

        alert("Pre-selection successfuly saved!");
        router.push(`/dashboard/jobs/${jobId}`);
      } catch (err: any) {
        alert(err?.response?.data?.message || "Something Wrong.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const start = page * pageSize;
  const end = start + pageSize;
  const maxPage = Math.ceil(25 / pageSize);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 bg-white border border-gray-300 p-6 rounded-lg shadow"
    >
      <h2 className="text-3xl font-bold text-[#6096B4]">
        {mode === "edit"
          ? "Edit Pre-Selection Test"
          : "Create Pre-Selection Test"}
      </h2>

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
          onClick={() => {
            setPage((p) => {
              const prevPage = Math.max(0, p - 1);
              if (prevPage !== p) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              return prevPage;
            });
          }}
          disabled={page === 0}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-sm"
        >
          Prev
        </button>
        <div className="text-sm text-gray-700">
          Page {page + 1} of {maxPage}
        </div>
        <button
          type="button"
          onClick={() => {
            setPage((p) => {
              const nextPage = Math.min(maxPage - 1, p + 1);
              if (nextPage !== p) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              return nextPage;
            });
          }}
          disabled={page === maxPage - 1}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-sm"
        >
          Next
        </button>
      </div>

      {page === maxPage - 1 && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#6096B4] hover:bg-[#4d7a96] text-white py-2 rounded-md font-medium text-sm transition"
        >
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Submitting..."
            : mode === "edit"
            ? "Update Test"
            : "Submit Test"}
        </button>
      )}
      <button
        type="button"
        onClick={() => router.push(`/dashboard/jobs/${jobId}`)}
        className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md font-medium text-sm transition"
      >
        Cancel
      </button>
    </form>
  );
}
