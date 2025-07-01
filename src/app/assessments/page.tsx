"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/axios";

export default function UserAssessmentListPage() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    API.get("/assessments")
      .then((res) => setAssessments(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("Fitur ini hanya untuk user dengan subscription aktif.");
        } else {
          alert("Gagal memuat data assessment.");
        }
      });
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Skill Assessments</h1>

      {assessments.length === 0 ? (
        <p className="text-gray-600">No assessments available.</p>
      ) : (
        <ul className="space-y-4">
          {assessments.map((a: any) => (
            <li key={a.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{a.name}</h2>
              <p className="text-sm text-gray-600">{a.description}</p>
              <p className="text-sm text-gray-500">
                Time Limit: {a.timeLimit} minutes
              </p>
              <Link
                href={`/assessments/${a.id}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Mulai Assessment
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
