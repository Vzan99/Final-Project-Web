"use client";

import { useEffect, useState } from "react";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import API from "@/lib/axios";

export default function DeveloperAssessmentPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    try {
      const res = await API.get("/assessments/developer/all");
      setAssessments(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <AssessmentForm onCreated={fetchAssessments} />

      <section>
        <h2 className="text-xl font-semibold mb-4">Existing Assessments</h2>

        {loading ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : assessments.length === 0 ? (
          <p className="text-gray-500">No assessments found.</p>
        ) : (
          <ul className="space-y-4">
            {assessments.map((a) => (
              <li key={a.id} className="border rounded p-4 shadow-sm">
                <h3 className="font-bold">{a.name}</h3>
                {a.description && (
                  <p className="text-sm text-gray-600 mb-1">{a.description}</p>
                )}
                <p className="text-sm text-gray-700">
                  Time limit: {a.timeLimit} minutes | Passing score:{" "}
                  {a.passingScore ?? 75}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
