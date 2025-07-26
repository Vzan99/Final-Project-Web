"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import PreSelectionTestQuestionForm from "@/components/dashboard/pre-selection-test/PreSelectionTestQuestionForm";
import PreSelectionTestSkeleton from "@/components/dashboard/pre-selection-test/PreSelectionTestSkeleton";

export default function EditPreSelectionTestPage() {
  const { id: rawId } = useParams();
  const jobId = (rawId as string).slice(0, 36);
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      API.get(`/pre-selection-tests/admin/jobs/${jobId}/pre-selection-test`)
        .then((res) => {
          const rawQuestions = res.data.data.questions;
          const questionsWithIndex = rawQuestions.map(
            (q: any, idx: number) => ({
              ...q,
              index: idx,
            })
          );
          setQuestions(questionsWithIndex);
        })
        .catch(() => {
          toast.error("Failed to load pre-selection test");
          router.push("/dashboard/jobs");
        })
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  if (loading) return <PreSelectionTestSkeleton />;
  if (!questions.length) return <p>No test found for this job.</p>;

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <PreSelectionTestQuestionForm
        jobId={jobId}
        initialQuestions={questions}
        mode="edit"
      />
    </div>
  );
}
