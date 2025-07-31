"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";

interface Review {
  id: string;
  user?: { name?: string };
  isAnonymous: boolean;
  isVerified: boolean;
  position: string;
  salaryEstimate: number;
  content: string;
  rating: number;
  cultureRating: number;
  workLifeRating: number;
  careerRating: number;
}

export default function ReviewList({ companyId }: { companyId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reviews/company/${companyId}`, {
        params: {
          page,
          pageSize,
        },
      });
      setReviews(res.data.reviews || []);
      const total = res.data.total || 0;
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, companyId]);

  if (loading) {
    return <p className="text-gray-500">Loading reviews...</p>;
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p className="text-gray-500">Belum ada review.</p>;
  }

  return (
    <div className="space-y-6 mt-6">
      {reviews.map((rev) => (
        <div key={rev.id} className="border p-4 rounded shadow-sm bg-white">
          <div className="flex items-center justify-between mb-1">
            <strong>
              {rev.isAnonymous ? "Anonim" : rev.user?.name || "-"}
            </strong>
            {rev.isVerified && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                Terverifikasi
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {rev.position} | Est. Gaji: Rp {rev.salaryEstimate.toLocaleString()}
          </p>
          <p className="mb-2">{rev.content}</p>
          <div className="text-sm text-gray-500">
            🌟 {rev.rating}/5 | Culture: {rev.cultureRating} | WLB:{" "}
            {rev.workLifeRating} | Career: {rev.careerRating}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
