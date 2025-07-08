"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { MySubscription } from "@/types/subscription";

export function useSubscriptionStatus() {
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/subscriptions/user/me")
      .then((res) => setSubscription(res.data))
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, []);

  return { subscription, loading };
}
