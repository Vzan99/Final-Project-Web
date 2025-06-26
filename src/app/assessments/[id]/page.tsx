"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`/assessments`).then((res) => {
      const data = res.data.find((a: any) => a.id === id);
      if (!data) return;
      axios.get(`/assessments/${id}/result`).then((r) => {
        if (r.data) router.replace(`/assessments/${id}/result`);
      });
      setQuestions(data.questions || []);
      setAnswers(new Array(data.questions.length).fill(""));
    });
  }, [id]);

  const handleChange = (idx: number, value: string) => {
    const copy = [...answers];
    copy[idx] = value;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    await axios.post(`/assessments/${id}/submit`, { answers });
    router.push(`/assessments/${id}/result`);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kerjakan Assessment</h1>
      {questions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <p className="font-medium">
            {idx + 1}. {q.question}
          </p>
          <div className="mt-2 space-y-1">
            {q.choices.map((c: string, cIdx: number) => (
              <label key={cIdx} className="block">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value={c}
                  checked={answers[idx] === c}
                  onChange={() => handleChange(idx, c)}
                  className="mr-2"
                />
                {c}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow"
      >
        Submit
      </button>
    </main>
  );
}
