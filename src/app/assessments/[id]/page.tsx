"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await API.get(`/assessments/${id}/detail`);
        const data = res.data;

        const result = await API.get(`/assessments/${id}/result`);
        if (result.data) {
          router.replace(`/assessments/${id}/result`);
          return;
        }

        setQuestions(data.questions || []);
        setAnswers(new Array(data.questions.length).fill(""));
        setTimeLeft((data.timeLimit || 30) * 60);
      } catch (err) {
        toast.error("Gagal memuat data assessment.");
        router.push("/assessments");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || submitting) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const incomplete = answers.some((ans) => !ans);
    if (incomplete) {
      toast.error("Semua pertanyaan harus dijawab.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Mengirim jawaban...");

    try {
      await API.post(`/assessments/${id}/submit`, { answers });
      toast.update(toastId, {
        render: "Berhasil submit!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      router.push(`/assessments/${id}/result`);
    } catch (err) {
      toast.update(toastId, {
        render: "Gagal submit jawaban",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kerjakan Assessment</h1>
          {timeLeft !== null && (
            <span className="text-lg font-mono bg-gray-100 px-4 py-1 rounded border">
              ⏳ {formatTime(timeLeft)}
            </span>
          )}
        </div>

        {questions.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="font-medium mb-1">
              {i + 1}. {q.question}
            </p>
            <div className="space-y-1">
              {q.options.map((opt: string, j: number) => (
                <label key={j} className="block">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => handleChange(i, opt)}
                    disabled={submitting}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={submitting || answers.some((a) => !a)}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {timeLeft === 0 && (
          <p className="mt-4 text-red-600 font-medium">
            Waktu habis. Jawaban telah disubmit otomatis.
          </p>
        )}
      </main>
    </ProtectedRoute>
  );
}
