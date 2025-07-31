"use client";

type CVPreviewProps = {
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
};

export default function CVPreview({ form, pdfRef }: CVPreviewProps) {
  return (
    <div
      ref={pdfRef}
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        border: "1px solid #cccccc",
        borderRadius: "12px",
        padding: "24px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        lineHeight: "1.5",
      }}
    >
      <h2
        style={{
          color: "#111111",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "4px",
        }}
      >
        {form.name || "[Your Name]"}
      </h2>
      <p style={{ color: "#555555", marginBottom: "16px" }}>
        {form.email || "[email@example.com]"} | {form.phone || "[Phone]"}
      </p>

      <Section
        title="Summary"
        content={form.summary || "No summary provided."}
      />
      <Section
        title="Experience"
        content={form.experience || "No experience listed."}
      />
      <Section
        title="Education"
        content={form.education || "No education listed."}
      />
      <Section title="Skills" content={form.skills || "No skills listed."} />
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  if (!content) return null;
  return (
    <div style={{ marginTop: "16px" }}>
      <h3
        style={{
          fontWeight: "600",
          color: "#222222",
          marginBottom: "4px",
          fontSize: "16px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#444444",
          whiteSpace: "pre-line",
          margin: 0,
        }}
      >
        {content}
      </p>
    </div>
  );
}
