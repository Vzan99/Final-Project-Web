"use client";

import React from "react";

export default function CVPreview({
  form,
  pdfRef,
}: {
  form: {
    name: string;
    email: string;
    phone: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
  };
  pdfRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={pdfRef}
      className="p-6 border rounded-xl bg-white shadow-md text-sm"
    >
      <h2 className="text-xl font-bold">{form.name}</h2>
      <p className="text-gray-600">
        {form.email} | {form.phone}
      </p>

      <Section title="Summary" content={form.summary} />
      <Section title="Experience" content={form.experience} />
      <Section title="Education" content={form.education} />
      <Section title="Skills" content={form.skills} />
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return content ? (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-700 whitespace-pre-line">{content}</p>
    </div>
  ) : null;
}
