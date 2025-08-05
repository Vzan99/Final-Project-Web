export type SubscriptionType = "STANDARD" | "PROFESSIONAL";

export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type PaymentStatus = "PENDING" | "PAID";

export type Subscription = {
  type: SubscriptionType;
  startDate: string;
  endDate: string;
  amount: number;
  isApproved: boolean;
  paymentStatus: PaymentStatus;
};

export type MySubscription = {
  status: SubscriptionStatus;
  expiredAt?: string;
  type?: SubscriptionType;
  startDate?: string;
  endDate?: string;
};

export type Analytics = {
  total: number;
  active: number;
  expired: number;
  standard: number;
  professional: number;
  revenue: number;
};

export type PendingSubscription = {
  id: string;
  type: SubscriptionType;
  amount: number;
  paymentMethod: string;
  paymentProof: string;
  isApproved: boolean;
  paymentStatus: PaymentStatus;
  user: {
    name: string;
    email: string;
  };
};
