"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import ApplicantCard from "@/components/dashboard/applicants/ApplicantCard";
import ApplicantFilterForm, {
  ApplicantFilter,
} from "@/components/dashboard/applicants/ApplicantFilterForm";
import ApplicantCardSkeleton from "@/components/dashboard/applicants/ApplicantCardSkeleton";
import { Applicant } from "@/types/applicant";

function getAge(birthDate: string | null) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function ApplicantListPage() {
  const { id: jobId } = useParams();
  const router = useRouter();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasTest, setHasTest] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<ApplicantFilter>({
    name: "",
    minAge: "",
    maxAge: "",
    minSalary: "",
    maxSalary: "",
    education: "",
  });

  useEffect(() => {
    if (jobId) {
      API.get(`/applications/jobs/${jobId}/applicants`)
        .then((res) => {
          const { hasTest, applicants, totalPages } = res.data.data;
          setHasTest(hasTest);
          setApplicants(applicants);
          setTotalPages(totalPages);
        })
        .catch(() => {
          toast.error("Failed to fetch applicants");
          router.push("/dashboard/jobs");
        })
        .finally(() => setLoading(false));
    }
  }, [jobId, page]);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const age = getAge(app.user.profile?.birthDate ?? null);

      if (
        filters.name &&
        !app.user.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }

      if (filters.minAge && (age === null || age < parseInt(filters.minAge))) {
        return false;
      }

      if (filters.maxAge && (age === null || age > parseInt(filters.maxAge))) {
        return false;
      }

      if (
        filters.minSalary &&
        app.expectedSalary < parseInt(filters.minSalary)
      ) {
        return false;
      }

      if (
        filters.maxSalary &&
        app.expectedSalary > parseInt(filters.maxSalary)
      ) {
        return false;
      }

      if (
        filters.education &&
        app.user.profile?.education?.toLowerCase() !==
          filters.education.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [applicants, filters]);

  const educationOptions = useMemo(() => {
    const set = new Set<string>();
    applicants.forEach((a) => {
      if (a.user.profile?.education) set.add(a.user.profile.education);
    });
    return Array.from(set);
  }, [applicants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEE9DA] p-8">
        <div className="bg-white p-6 rounded-xl shadow space-y-6 text-[#1a1a1a]">
          <h1 className="text-3xl font-bold text-[#6096B4]">Applicants</h1>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ApplicantCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#EEE9DA] min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6 text-[#1a1a1a]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6096B4]">
            Applicants
          </h1>
        </div>

        {/* Filter Form */}
        <ApplicantFilterForm
          filters={filters}
          onChange={setFilters}
          educationOptions={educationOptions}
        />

        {/* Applicant List */}
        {filteredApplicants.length === 0 ? (
          <p className="text-gray-600">No applicants found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredApplicants.map((app) => (
              <ApplicantCard
                key={app.id}
                applicant={app}
                hasTest={hasTest}
                onStatusUpdate={(newStatus) =>
                  handleStatusUpdate(app.id, newStatus)
                }
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 pt-4 border-t border-gray-200">
          <button
            className="px-3 py-2 bg-gray-200 text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            First
          </button>
          <button
            className="px-3 py-2 bg-gray-200 text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-2 bg-gray-200 text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
          <button
            className="px-3 py-2 bg-gray-200 text-sm rounded disabled:opacity-50 hover:bg-gray-300 transition"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
