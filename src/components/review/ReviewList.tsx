"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import StarRatings from "react-star-ratings";

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

export default function ReviewList({
  companyId,
  refreshKey = 0,
}: {
  companyId: string;
  refreshKey?: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reviews/company/${companyId}`, {
        params: { page, pageSize },
      });
      setReviews(res.data.reviews || []);
      const total = res.data.total || 0;
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, companyId, refreshKey]);

  if (loading) return <p className="text-gray-500">Loading reviews...</p>;
  if (!Array.isArray(reviews) || reviews.length === 0)
    return <p className="text-gray-500">Belum ada review.</p>;

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
            {rev.position} | Estimasi Gaji: Rp{" "}
            {rev.salaryEstimate.toLocaleString("id-ID")}
          </p>
          <p className="mb-2 text-gray-800">{rev.content}</p>

          <div className="space-y-1 text-sm text-gray-700">
            <RatingRow
              label="Rating Umum:"
              value={rev.rating}
              name={`r-${rev.id}`}
            />
            <RatingRow
              label="Culture:"
              value={rev.cultureRating}
              name={`c-${rev.id}`}
            />
            <RatingRow
              label="Work-Life Balance:"
              value={rev.workLifeRating}
              name={`w-${rev.id}`}
            />
            <RatingRow
              label="Career Opportunity:"
              value={rev.careerRating}
              name={`ca-${rev.id}`}
            />
          </div>
        </div>
      ))}

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

function RatingRow({
  label,
  value,
  name,
}: {
  label: string;
  value: number;
  name: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-36">{label}</span>
      <StarRatings
        rating={value}
        starRatedColor="orange"
        numberOfStars={5}
        starDimension="18px"
        starSpacing="2px"
        name={name}
      />
    </div>
  );
}
