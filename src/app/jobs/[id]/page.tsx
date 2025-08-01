"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { Job } from "@/types/jobs";
import { JobDetailsSkeleton } from "@/components/loadingSkeleton/jobDetailsSkeleton";
import { JobDetailsCard } from "@/components/jobs/jobDetailsCard";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    setLoading(true);

    API.get(`/jobs/${params.id}/details`)
      .then((res) => {
        setJob(res.data);
      })
      .catch(() => {
        router.push("/jobs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params?.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <JobDetailsSkeleton />
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-center text-red-600 font-medium">
          Sorry, the job details could not be loaded.
        </p>
      </main>
    );
  }

  const rawBannerId = job.company?.bannerUrl;
  const cloudBanner = getCloudinaryImageUrl(rawBannerId, {
    width: 1600,
    height: 400,
    crop: "fill",
  });
  const bannerUrl = cloudBanner || "/precise_logo.jpeg";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner with overlay content */}
      <div className="relative w-full h-56 md:h-64 lg:h-72 bg-gray-200">
        <img
          src={bannerUrl}
          alt="Company Banner"
          className="w-full h-full object-cover rounded-b-lg"
        />
      </div>

      {/* Job details section */}
      <div className="relative z-0 mt-2 max-w-5xl mx-auto px-4 py-10">
        <JobDetailsCard job={job} />
      </div>
    </main>
  );
}
