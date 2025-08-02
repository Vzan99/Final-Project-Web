"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

const LOCAL_KEY_PREFIX = "assessment-";

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentIndex = parseInt(searchParams.get("q") || "0", 10);
  const localKey = `${LOCAL_KEY_PREFIX}${id}`;
  const localTimeKey = `${LOCAL_KEY_PREFIX}${id}-time`;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await API.get(`/assessments/${id}/detail`);
        const data = res.data;

        // Cek jika sudah pernah submit
        try {
          const result = await API.get(`/assessments/${id}/result`);
          if (result?.data?.score !== undefined) {
            router.replace(`/assessments/${id}/result`);
            return;
          }
        } catch (err: any) {
          if (err.response?.status !== 404) {
            toast.error("Gagal mengecek status hasil assessment.");
            router.push("/assessments");
            return;
          }
        }

        setQuestions(data.questions || []);

        const storedAnswers = localStorage.getItem(localKey);
        setAnswers(
          storedAnswers
            ? JSON.parse(storedAnswers)
            : new Array(data.questions.length).fill("")
        );

        const storedTime = localStorage.getItem(localTimeKey);
        setTimeLeft(
          storedTime ? parseInt(storedTime, 10) : (data.timeLimit || 30) * 60
        );

        if (!storedTime) {
          localStorage.setItem(
            localTimeKey,
            ((data.timeLimit || 30) * 60).toString()
          );
        }
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
      setTimeLeft((prev) => {
        const updated = prev !== null ? prev - 1 : null;
        if (updated !== null) {
          localStorage.setItem(localTimeKey, updated.toString());
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitting && timeLeft !== null && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitting, timeLeft]);

  const handleAnswer = (value: string) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
    localStorage.setItem(localKey, JSON.stringify(updated));
  };

  const goToQuestion = (index: number) => {
    router.replace(`/assessments/${id}?q=${index}`);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const incomplete = answers.some((a) => !a.trim());
    const wrongLength = answers.length !== questions.length;

    if (incomplete || wrongLength) {
      toast.error("Semua pertanyaan harus dijawab.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Mengirim jawaban...");

    try {
      await API.post(`/assessments/${id}/submit`, { answers });
      localStorage.removeItem(localKey);
      localStorage.removeItem(localTimeKey);

      toast.update(toastId, {
        render: "Berhasil submit!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      router.push(`/assessments/${id}/result`);
    } catch {
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

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="p-6 max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">
            Pertanyaan {currentIndex + 1} dari {totalQuestions}
          </h1>
          {timeLeft !== null && (
            <span className="text-lg font-mono bg-gray-100 px-4 py-1 rounded border">
              ⏳ {formatTime(timeLeft)}
            </span>
          )}
        </div>

        {currentQuestion ? (
          <div className="mb-6">
            <p className="font-medium mb-2">{currentQuestion.question}</p>
            <div className="space-y-1">
              {currentQuestion.options.map((opt: string, j: number) => (
                <label key={j} className="block">
                  <input
                    type="radio"
                    name="answer"
                    value={opt}
                    checked={answers[currentIndex] === opt}
                    onChange={() => handleAnswer(opt)}
                    disabled={submitting}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Pertanyaan tidak ditemukan.</p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Selanjutnya
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || answers.some((a) => !a)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Mengirim..." : "Submit Assessment"}
            </button>
          )}
        </div>

        {timeLeft === 0 && (
          <p className="mt-4 text-red-600 font-medium">
            Waktu habis. Jawaban telah disubmit otomatis.
          </p>
        )}
      </main>
    </ProtectedRoute>
  );
}
