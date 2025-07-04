"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SubscriptionType } from "@/types/subscription";

const plans: { type: SubscriptionType; price: number }[] = [
  { type: "STANDARD", price: 25000 },
  { type: "PROFESSIONAL", price: 100000 },
];

const methods = ["BCA", "GoPay", "OVO"];

export default function SubscriptionUpgradeForm() {
  const [type, setType] = useState<SubscriptionType>("STANDARD");
  const [paymentMethod, setPaymentMethod] = useState("BCA");
  const [proof, setProof] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proof) {
      return toast.error("Please upload your payment proof.");
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("paymentMethod", paymentMethod);
    formData.append("paymentProof", proof);

    try {
      await axios.post("/subscription/user/subscribe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Subscription submitted! Awaiting approval.");
      router.push("/subscription");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Submission failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 max-w-md w-full mx-auto mt-10 space-y-4"
    >
      <h2 className="text-xl font-semibold">Upgrade Subscription</h2>

      <div>
        <label className="block font-medium mb-1">Plan</label>
        <select
          className="w-full border rounded-xl p-2"
          value={type}
          onChange={(e) => setType(e.target.value as SubscriptionType)}
        >
          {plans.map((p) => (
            <option key={p.type} value={p.type}>
              {p.type} – Rp{p.price.toLocaleString("id-ID")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Payment Method</label>
        <select
          className="w-full border rounded-xl p-2"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Payment Proof</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProof(e.target.files?.[0] || null)}
          className="w-full border rounded-xl p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
