"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { Subscription } from "@/types/subscription";

export default function SubscriptionHistory() {
  const [history, setHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/subscriptions/user/history")
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-2xl w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Subscription History</h2>
      {loading ? (
        <p className="text-gray-500 italic">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-600">No subscription history found.</p>
      ) : (
        <ul className="space-y-4">
          {history
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
            .map((sub, i) => (
              <li key={i} className="border-b pb-2">
                <p className="font-semibold">
                  {sub.type} - Rp{sub.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(sub.startDate).toLocaleDateString("id-ID")} -{" "}
                  {new Date(sub.endDate).toLocaleDateString("id-ID")}
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      sub.paymentStatus === "PAID"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }
                  >
                    {sub.paymentStatus}
                  </span>{" "}
                  {sub.isApproved ? "Approved" : "Pending approval"}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
