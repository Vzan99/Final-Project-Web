"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/applications/${id}`)
      .then((res) => setData(res.data.data))
      .catch(() => router.push("/dashboard/jobs"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Application not found.</p>;

  const { user, job, test, ...app } = data;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Application Detail</h1>

      <section className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold text-lg">Job: {job.title}</h2>
        <p>
          <strong>Status:</strong> {app.status}
        </p>
        <p>
          <strong>Applied At:</strong>{" "}
          {new Date(app.appliedAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Expected Salary:</strong> Rp
          {app.expectedSalary.toLocaleString()}
        </p>
        {app.coverLetter && (
          <p>
            <strong>Cover Letter:</strong> {app.coverLetter}
          </p>
        )}
        <a
          href={app.cvFile}
          target="_blank"
          className="text-blue-600 underline"
        >
          View CV
        </a>
      </section>

      <section className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="font-semibold text-lg">Applicant</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        {user.profile && (
          <>
            <p>
              <strong>Gender:</strong> {user.profile.gender}
            </p>
            <p>
              <strong>Education:</strong> {user.profile.education}
            </p>
            <p>
              <strong>Address:</strong> {user.profile.address}
            </p>
            <p>
              <strong>Skills:</strong> {user.profile.skills.join(", ")}
            </p>
            {user.profile.resumeUrl && (
              <a
                href={user.profile.resumeUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            )}
          </>
        )}
      </section>

      {test && (
        <section className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold text-lg">Pre-Selection Test</h2>
          <p>
            <strong>Score:</strong> {test.score} / 100
          </p>
          <p>
            <strong>Status:</strong> {test.passed ? "Passed" : "Failed"}
          </p>
          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(test.submittedAt).toLocaleDateString()}
          </p>
        </section>
      )}
    </div>
  );
}
