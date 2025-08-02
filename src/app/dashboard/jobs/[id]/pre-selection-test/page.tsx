"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PreSelectionTestQuestionForm from "@/components/dashboard/pre-selection-test/PreSelectionTestQuestionForm";
import API from "@/lib/axios";
import PreSelectionTestSkeleton from "@/components/dashboard/pre-selection-test/PreSelectionTestSkeleton";

export default function PreSelectionTestPage() {
  const { id } = useParams();
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isPreTestEnabled, setIsPreTestEnabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await API.get(`/jobs/${id}`);
        const job = jobRes.data.data;
        const testEnabled = job.hasTest === true;

        setIsPreTestEnabled(testEnabled);

        if (testEnabled) {
          try {
            const testRes = await API.get(`/pre-selection-tests/${id}`);
            const questions = testRes.data.data?.questions || [];

            if (questions.length > 0) {
              setMode("edit");
              setInitialQuestions(questions);
            }
          } catch (err: any) {
            if (err.response?.status === 404) {
              setMode("create");
            } else {
              console.error("Error fetching pre-test:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching job detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading || !id || typeof id !== "string")
    return <PreSelectionTestSkeleton />;

  if (!isPreTestEnabled) {
    return (
      <div className="text-center text-red-600 font-semibold">
        This job does not have pre-selection test enabled.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#EEE9DA] min-h-screen">
      <PreSelectionTestQuestionForm
        jobId={id}
        initialQuestions={initialQuestions}
        mode={mode}
      />
    </div>
  );
}
