"use client";

import React from "react";

type Props = {
  resumeUrl: string | null | undefined; // e.g. "meitlorywraf0eovr4rc.docx"
};

export default function ResumeDownloadButton({ resumeUrl }: Props) {
  const handleDownload = async () => {
    if (!resumeUrl) return alert("No resume available to download");

    try {
      // Separate public ID and extension
      const publicId = resumeUrl.split(".")[0]; // e.g. "meitlorywraf0eovr4rc"
      const ext = resumeUrl.split(".")[1] || "pdf"; // fallback to pdf if missing

      // Cloudinary URL without extension
      const url = `https://res.cloudinary.com/ddunl3ta7/raw/upload/${publicId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger download with extension
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `resume.${ext}`; // Set download filename with extension
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed, please try again.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!resumeUrl}
      className="bg-[#89A8B2] text-white px-4 py-2 rounded hover:bg-[#7a98a1]"
    >
      {resumeUrl ? "Download Resume" : "No Resume Uploaded"}
    </button>
  );
}
