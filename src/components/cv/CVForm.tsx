"use client";

import React from "react";

export default function CVForm({
  form,
  setForm,
  onClientDownload,
  onServerDownload,
}: {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onClientDownload: () => void;
  onServerDownload: () => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev: typeof form) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
      />
      <Textarea
        label="Professional Summary"
        name="summary"
        value={form.summary}
        onChange={handleChange}
      />
      <Textarea
        label="Work Experience"
        name="experience"
        value={form.experience}
        onChange={handleChange}
      />
      <Textarea
        label="Education"
        name="education"
        value={form.education}
        onChange={handleChange}
      />
      <Textarea
        label="Skills (comma separated)"
        name="skills"
        value={form.skills}
        onChange={handleChange}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClientDownload}
          className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Download PDF (Client)
        </button>
        <button
          type="button"
          onClick={onServerDownload}
          className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
        >
          Download PDF (Server)
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input {...props} className="w-full border rounded-xl p-2" />
    </div>
  );
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <textarea {...props} rows={3} className="w-full border rounded-xl p-2" />
    </div>
  );
}
