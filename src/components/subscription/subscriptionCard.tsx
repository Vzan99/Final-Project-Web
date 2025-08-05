"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import { MySubscription } from "@/types/subscription";

export default function SubscriptionCard() {
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    API.get("/subscriptions/user/me")
      .then((res) => setSubscription(res.data))
      .catch(() => {});
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-500";
      default:
        return "text-red-600";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
      {subscription ? (
        <div>
          <p className={`font-medium ${getStatusColor(subscription.status)}`}>
            {subscription.status}
          </p>
          {subscription.type && (
            <p className="text-sm text-gray-700 mt-1">
              Plan: {subscription.type}
            </p>
          )}
          {subscription.expiredAt && (
            <p className="text-sm text-gray-600 mt-2">
              Expires at:{" "}
              {new Date(subscription.expiredAt).toLocaleDateString("id-ID")}
            </p>
          )}
          {subscription.status !== "ACTIVE" && (
            <button
              onClick={() => router.push("/subscription/upgrade")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      ) : (
        <p>Loading your subscription...</p>
      )}
    </div>
  );
}
