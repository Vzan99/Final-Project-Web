"use client";

import { useRef, useState } from "react";

export default function ResumeUpload() {
  const [filename, setFilename] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      // TODO: Send to API with FormData
    }
  };

  return (
    <div className="mt-6 text-center">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileRef}
        onChange={handleUpload}
        hidden
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="bg-[#89A8B2] text-white px-4 py-2 rounded hover:bg-[#7a98a1]"
      >
        {filename ? "Change Resume" : "Upload Resume"}
      </button>
      {filename && <p className="text-sm mt-2 text-[#89A8B2]">{filename}</p>}
    </div>
  );
}
