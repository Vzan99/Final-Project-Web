"use client";

import React from "react";

type Props = {
  resumeUrl: string | null | undefined;
};

export default function ResumeDownloadButton({ resumeUrl }: Props) {
  const handleDownload = async () => {
    if (!resumeUrl) return alert("No resume available to download");

    try {
      const publicId = resumeUrl.split(".")[0];
      const ext = resumeUrl.split(".")[1] || "pdf";

      const url = `https://res.cloudinary.com/ddunl3ta7/raw/upload/${publicId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download file");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `resume.${ext}`;
      document.body.appendChild(link);
      link.click();

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
