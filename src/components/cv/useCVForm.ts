"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";

export function useCVForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    experience: "",
    education: "",
    skills: "",
  });

  useEffect(() => {
    API.get("/user/cv-form").then((res) => {
      setForm((prev) => ({ ...prev, ...res.data }));
    });
  }, []);

  const handleDownloadFromServer = async (values: typeof form) => {
    try {
      const payload = {
        ...values,
        extraSkills: values.skills.split(",").map((s) => s.trim()),
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
    } catch {
      alert("Failed to download CV");
    }
  };

  return { form, setForm, handleDownloadFromServer };
}
