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
      className="p-6 border border-[#ccc] rounded-xl bg-white text-black text-sm font-sans shadow-none"
    >
      <h2 className="text-xl font-bold text-[#111]">{form.name}</h2>
      <p className="text-[#555]">
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
      <h3 className="font-semibold text-[#222] mb-1">{title}</h3>
      <p className="text-[#444] whitespace-pre-line">{content}</p>
    </div>
  ) : null;
}
