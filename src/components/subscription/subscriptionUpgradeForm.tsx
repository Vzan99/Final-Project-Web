"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "@/lib/axios";
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

  const handleUpgrade = async () => {
    try {
      const res = await API.post("/subscriptions/user/midtrans/token", {
        type,
      });
      const token = res.data.token;

      if (typeof window.snap === "undefined") {
        toast.error("Midtrans belum siap. Coba beberapa saat lagi.");
        return;
      }

      window.snap.pay(token, {
        onSuccess: () => {
          toast.success("Payment Successful!");
          router.push("/subscription");
        },
        onPending: () => toast("Waiting for Payment..."),
        onError: () => toast.error("Payment Failed."),
        onClose: () => toast("You closed the payment popup."),
      });
    } catch (error) {
      toast.error("Failed to initiate payment.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proof) return toast.error("Please upload your payment proof");

    const formData = new FormData();
    formData.append("type", type);
    formData.append("paymentMethod", paymentMethod);
    formData.append("paymentProof", proof);

    try {
      await API.post("/subscriptions/user/subscribe", formData);
      toast.success("Subscription submitted! Awaiting approval.");
      router.push("/subscription");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Submission failed.");
    }
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""}
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 max-w-md w-full mx-auto space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">
            Upgrade Subscription
          </h2>

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

          <button
            type="button"
            onClick={handleUpgrade}
            className="bg-green-600 text-white w-full py-2 rounded-xl hover:bg-green-700 transition"
          >
            Pay with Midtrans
          </button>

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium">Transfer to:</p>
            <ul className="mt-1 space-y-1">
              <li>BCA - 1234567890 a.n. PT Presisi Indonesia</li>
              <li>GoPay / OVO - 0812 3456 7890 (Precise Payment)</li>
            </ul>
            <p className="mt-2 italic">
              After payment, upload the proof above. Your subscription will be
              activated after approval.
            </p>
          </div>
        </form>
      </main>
    </>
  );
}
