"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import Link from "next/link";
import SearchBar from "@/components/searchBar";
import SignInCardSection from "@/app/home/signInCardSection";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await API.get("/jobs/public", {
            params: {
              lat: latitude,
              lng: longitude,
            },
            withCredentials: false,
          });

          setJobs(res.data.jobs);
          console.log("Nearby jobs:", res.data.jobs);
        } catch (err) {
          console.error("Failed to fetch jobs by location:", err);
        }
      },
      (error) => {
        console.warn("User denied geolocation. Fallback to latest jobs.");
        API.get("/jobs/public", {
          withCredentials: false,
        })
          .then((res) => setJobs(res.data.jobs))
          .catch((err) => console.error(err));
      }
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#EEE9DA] text-[#1a1a1a]">
      {/* Hero Section */}
      <section className="bg-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#6096B4]">
          Find Your Next <span className="text-[#1a1a1a]">Tech Job</span> Here
        </h1>
        <p className="text-lg md:text-xl mb-10 text-[#4B5563]">
          Explore opportunities from top tech companies. For developers,
          designers, and IT professionals.
        </p>

        <SearchBar />
      </section>

      <SignInCardSection />

      {/* Optional: Render jobs here */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Nearby or Latest Jobs</h2>
          <ul className="space-y-4">
            {jobs.map((job: any) => (
              <li
                key={job.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.location}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-[#EEE0C9]">{/* ... */}</section>

      {/* CTA */}
      <section className="bg-white py-14 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#6096B4]">
          Ready to take the next step in your tech career?
        </h2>
        <Link
          href="/auth/register"
          className="inline-block bg-[#6096B4] text-white px-8 py-3 mt-4 rounded-lg font-semibold hover:bg-[#4d7a96] transition"
        >
          Sign Up Today
        </Link>
      </section>
    </main>
  );
}
