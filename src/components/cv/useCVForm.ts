"use client";

import { useEffect, useRef, useState } from "react";
import API from "@/lib/axios";

export function useCVForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    API.get("/user/cv-form").then((res) => {
      setForm((prev) => ({ ...prev, ...res.data }));
    });
  }, []);

  const handleDownloadFromServer = async () => {
    try {
      const payload = {
        summary: form.summary,
        extraSkills: form.skills.split(",").map((s) => s.trim()),
        projects: [],
      };
      const res = await API.post("/user/generate-cv", payload, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "cv.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download CV");
    }
  };

  return { form, setForm, pdfRef, handleDownloadFromServer };
}
