export default function ReviewList({ reviews }: { reviews: any[] }) {
  if (!reviews.length)
    return <p className="text-gray-500">Belum ada review.</p>;

  return (
    <div className="space-y-4 mt-6">
      {reviews.map((rev, idx) => (
        <div key={idx} className="border p-4 rounded shadow-sm bg-white">
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
    </div>
  );
}
