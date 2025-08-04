"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import Spinner from "@/components/loadingSkeleton/spinner";
import ProtectedRoute from "@/components/protectedRoute";
import toast from "react-hot-toast";

type Question = {
  id: string;
  question: string;
  options: string[];
};

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  const localStorageKey = `assessment-${id}-startTime`;

  useEffect(() => {
    if (!id) return;

    API.get(`/assessments/${id}/detail`)
      .then((res) => {
        const qs = res.data.questions || [];
        const timeLimit = res.data.timeLimit || 10;

        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(""));

        const existingStart = localStorage.getItem(localStorageKey);
        const startTime = existingStart ? parseInt(existingStart) : Date.now();
        if (!existingStart) {
          localStorage.setItem(localStorageKey, startTime.toString());
        }

        const endTime = startTime + timeLimit * 60 * 1000;
        const updateTimer = () => {
          const now = Date.now();
          const diff = Math.max(0, Math.floor((endTime - now) / 1000));
          setTimeLeft(diff);
          if (diff <= 0) handleSubmit();
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      })
      .catch(() => {
        toast.error("Gagal memuat soal assessment");
        router.replace("/assessments");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswer = (value: string) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = questions.map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: answers[idx],
      }));

      await API.post(`/assessments/${id}/submit`, { answers: payload });

      localStorage.removeItem(localStorageKey);
      router.push(`/assessments/${id}/result`);
    } catch {
      toast.error("Gagal mengirim jawaban");
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (loading) return <Spinner />;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified
      requireSubscriptionStatus="ACTIVE"
      fallback={<Spinner />}
    >
      <main className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-800">
              Soal {currentIndex + 1} dari {questions.length}
            </p>
            <div className="flex items-center gap-4">
              <span className="font-mono bg-sky-900 text-white px-3 py-1 rounded-md text-md">
                {formatTime(timeLeft)}
              </span>
              <button
                onClick={
                  currentIndex === questions.length - 1
                    ? handleSubmit
                    : () => setCurrentIndex((prev) => prev + 1)
                }
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm font-semibold"
              >
                {currentIndex === questions.length - 1
                  ? "Selesai"
                  : "Selanjutnya →"}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Soal & Pilihan */}
          <div className="space-y-6 mt-4">
            <h2 className="text-xl font-bold text-gray-900">
              {questions[currentIndex].question}
            </h2>
            <div className="space-y-4">
              {questions[currentIndex].options.map((opt, j) => (
                <label
                  key={j}
                  className={`block px-4 py-3 border rounded-lg cursor-pointer transition
                    ${
                      answers[currentIndex] === opt
                        ? "bg-blue-50 border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    name={`q-${currentIndex}`}
                    value={opt}
                    checked={answers[currentIndex] === opt}
                    onChange={() => handleAnswer(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
