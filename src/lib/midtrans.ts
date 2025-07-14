import API from "@/lib/axios";
import { SubscriptionType } from "@/types/subscription";

export async function createSnapTransaction(type: SubscriptionType) {
  const res = await API.post("/subscriptions/user/midtrans/token", { type });
  return res.data.token;
}
