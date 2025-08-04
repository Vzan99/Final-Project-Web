"use client";

import { useEffect, useState } from "react";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import API from "@/lib/axios";
import { Pagination } from "@/components/pagination";

export default function DeveloperAssessmentPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const fetchAssessments = async () => {
    try {
      const res = await API.get("/assessments/developer/all", {
        params: { page, pageSize },
      });
      const items = res.data.assessments || res.data || [];
      const total = res.data.total ?? items.length;
      setAssessments(items);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error("Failed to fetch assessments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${id}`);
      fetchAssessments();
    } catch {
      alert("Failed to delete assessment");
    }
  };

  const handleEdit = (assessment: any) => {
    setEditing(assessment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchAssessments();
  }, [page]);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <div>
        <AssessmentForm
          onCreated={fetchAssessments}
          editData={editing}
          onFinishEdit={() => setEditing(null)}
        />
        {editing && (
          <p className="text-yellow-700 text-sm mt-2">
            Currently editing: <strong>{editing.name}</strong> — click "Cancel"
            to stop editing.
          </p>
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Existing Assessments</h2>
        {loading ? (
          <p className="text-gray-500 italic">Loading...</p>
        ) : assessments.length === 0 ? (
          <p className="text-gray-500">No assessments found.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {assessments.map((a) => (
                <li key={a.id} className="border rounded p-4 shadow-sm">
                  <h3 className="font-bold">{a.name}</h3>
                  {a.description && (
                    <p className="text-sm text-gray-600 mb-1">
                      {a.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    Time limit: {a.timeLimit} minutes | Passing score:{" "}
                    {a.passingScore ?? 75}
                  </p>
                  <div className="mt-2 flex gap-3 text-sm">
                    <button
                      onClick={() => setViewing(a)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(a)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </section>

      {viewing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewing(null)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{viewing.name}</h2>
            {viewing.description && (
              <p className="mb-2 text-gray-700">{viewing.description}</p>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Time Limit: {viewing.timeLimit} mins | Passing Score:{" "}
              {viewing.passingScore}
            </p>
            <ol className="space-y-4 list-decimal ml-5">
              {(viewing.questions || []).map((q: any, i: number) => (
                <li key={i} className="space-y-2">
                  <p className="font-medium">{q.question}</p>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    {q.options?.map((opt: string, j: number) => (
                      <li key={j}>{opt}</li>
                    ))}
                  </ul>
                  {q.options?.[q.answer] !== undefined && (
                    <p className="text-sm text-green-800 font-medium mt-1">
                      Jawaban benar: Option {q.answer + 1} - "
                      {q.options[q.answer]}"
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </main>
  );
}
