"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
    }
    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center py-12">Loading...</div>;

  const {
    name,
    email,
    profile: {
      birthDate,
      gender,
      education,
      address,
      photoUrl,
      resumeUrl,
      skills,
    },
    certificates,
  } = profile;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300" />
          )}
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p>
            <strong>Gender:</strong> {gender}
          </p>
          <p>
            <strong>Birth Date:</strong>{" "}
            {new Date(birthDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Education:</strong> {education}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>

        {resumeUrl && (
          <div className="mt-4">
            <a
              href={resumeUrl}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string) => (
              <span
                key={skill}
                className="bg-[#93BFCF] text-white px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Certificates</h3>
          <ul className="space-y-3">
            {certificates.map((cert: any) => (
              <li key={cert.id} className="border-b pb-2">
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Certificate
                </a>
                <p className="text-sm text-gray-600">
                  Code: {cert.verificationCode}
                </p>
                <p className="text-sm text-gray-600">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString()} | Exp:{" "}
                  {cert.expiresAt
                    ? new Date(cert.expiresAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
