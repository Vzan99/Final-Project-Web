"use client";

import { useEffect, useRef, useState } from "react";
import axios from "@/lib/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    axios.get("/cv-form").then((res) => {
      setForm((prev) => ({ ...prev, ...res.data }));
    });
  }, []);

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("cv.pdf");
  };

  const handleDownloadFromServer = async () => {
    try {
      const payload = {
        summary: form.summary,
        extraSkills: form.skills.split(",").map((s) => s.trim()),
        projects: [],
      };
      const res = await axios.post("/generate-cv", payload, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "cv-server.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download from server");
    }
  };

  return { form, setForm, pdfRef, handleDownload, handleDownloadFromServer };
}
