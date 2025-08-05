"use client";

import API from "@/lib/axios";
import { useEffect, useState } from "react";
import { Analytics, PendingSubscription } from "@/types/subscription";

export default function DeveloperSubscriptionPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [pendingSubs, setPendingSubs] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/subscriptions/developer/analytics"),
      API.get("/subscriptions/developer"),
    ])
      .then(([analyticsRes, listRes]) => {
        setAnalytics(analyticsRes.data);
        setPendingSubs(
          listRes.data.filter((s: PendingSubscription) => !s.isApproved)
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await API.patch(`/subscriptions/developer/${id}/approve`);
      setPendingSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to approve subscription");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await API.patch(`/subscriptions/developer/${id}/reject`);
      setPendingSubs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to reject subscription");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!analytics)
    return <p className="p-6 text-red-600">Failed to load data.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-8 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
        {pendingSubs.length === 0 ? (
          <p className="text-gray-500">No pending subscriptions.</p>
        ) : (
          <ul className="space-y-4">
            {pendingSubs.map((sub) => (
              <li key={sub.id} className="border p-4 rounded-xl">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold">
                      {sub.user.name} ({sub.user.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      Plan: {sub.type} – Rp{sub.amount.toLocaleString("id-ID")}{" "}
                      via {sub.paymentMethod}
                    </p>
                  </div>
                  <img
                    src={sub.paymentProof}
                    alt="Payment Proof"
                    className="w-28 h-20 object-cover rounded-md border"
                  />
                </div>
                <button
                  onClick={() => handleApprove(sub.id)}
                  className="mt-3 px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(sub.id)}
                  className="mt-3 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2"
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
