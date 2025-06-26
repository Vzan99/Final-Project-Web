"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";

export default function AssessmentListPage() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/assessments").then((res) => setAssessments(res.data));
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Skill Assessments</h1>
      <ul className="space-y-4">
        {assessments.map((a) => (
          <li key={a.id} className="border p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">{a.name}</h2>
            <p className="text-sm text-gray-600">{a.description}</p>
            <Link
              href={`/assessments/${a.id}`}
              className="inline-block mt-2 text-indigo-600 hover:underline"
            >
              Kerjakan
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
