"use client";

import { useState, FormEvent } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
// import toast from "react-hot-toast"; // optional

export default function UpgradeSubscriptionPage() {
  const [selectedType, setSelectedType] = useState<"STANDARD" | "PROFESSIONAL">(
    "STANDARD"
  );
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!paymentProof) {
      alert("Please upload your payment proof.");
      return;
    }

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(paymentProof.type)
    ) {
      alert("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    if (paymentProof.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("type", selectedType);
    formData.append("paymentMethod", "TRANSFER");
    formData.append("paymentProof", paymentProof);

    try {
      await axios.post("/subscription/user/subscribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // toast.success("Subscription request submitted!");
      alert("Subscription request submitted successfully!");
      router.push("/subscription");
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Upgrade Subscription
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Choose Plan:</label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(
                e.target.value === "STANDARD" ? "STANDARD" : "PROFESSIONAL"
              )
            }
            className="w-full p-2 border rounded-xl"
          >
            <option value="STANDARD">STANDARD – Rp25.000</option>
            <option value="PROFESSIONAL">PROFESSIONAL – Rp100.000</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Upload Payment Proof:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
            className="w-full border rounded-xl p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
