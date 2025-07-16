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

export default function PreSelectionAnswerForm() {
  const { id } = useParams(); // jobId
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: { answers: Array(25).fill(undefined) },
    validationSchema: preSelectionAnswerSchema,
    onSubmit: async (values) => {
      try {
        console.log("Submit values:", values);
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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold">Pre-Selection Test</h1>

      {questions.map((q, i) => (
        <PreSelectionQuestionCard
          key={i}
          index={i}
          question={q.question}
          options={q.options}
          value={formik.values.answers[i]}
          onChange={(val) => formik.setFieldValue(`answers[${i}]`, val)}
        />
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Jawaban
      </button>
    </form>
  );
}
