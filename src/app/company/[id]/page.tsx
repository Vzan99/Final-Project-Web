import axios from "@/lib/axios";
import ReviewForm from "@/components/review/ReviewForm";
import ReviewList from "@/components/review/ReviewList";

async function getReviews(companyId: string) {
  const res = await axios.get(`/reviews/company/${companyId}`);
  return res.data;
}

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const companyId = params.id;
  const reviews = await getReviews(companyId);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Profil Perusahaan</h1>
      {/* ... tampilkan info perusahaan jika ada ... */}

      <ReviewForm companyId={companyId} />
      <ReviewList reviews={reviews} />
    </main>
  );
}
