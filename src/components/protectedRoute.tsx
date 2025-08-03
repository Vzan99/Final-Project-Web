"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerified?: boolean;
  requireUnverified?: boolean;
  requireSubscriptionStatus?: "ACTIVE" | "INACTIVE" | "PENDING";
  requireSubscriptionType?: "STANDARD" | "PROFESSIONAL";
  fallback?: React.ReactNode;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireVerified = false,
  requireUnverified = false,
  requireSubscriptionStatus,
  requireSubscriptionType,
  fallback = null,
}: Props) {
  const router = useRouter();
  const { user, isHydrated, loading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
      return;
    }

    if (requireVerified && !user.isVerified) {
      router.replace("/auth/unverified-email");
      return;
    }

    if (requireUnverified && user.isVerified) {
      router.replace("/unauthorized");
      return;
    }

    if (requireSubscriptionStatus) {
      const currentStatus = user.subscription?.status;
      if (currentStatus !== requireSubscriptionStatus) {
        router.replace("/subscription");
        return;
      }
    }

    if (requireSubscriptionType) {
      const currentType = user.subscription?.type;
      if (currentType !== requireSubscriptionType) {
        router.replace("/subscription");
        return;
      }
    }
  }, [
    isHydrated,
    user,
    allowedRoles,
    requireVerified,
    requireUnverified,
    requireSubscriptionStatus,
    requireSubscriptionType,
    router,
  ]);

  const isBlocked =
    !isHydrated ||
    loading ||
    !user ||
    (allowedRoles && !allowedRoles.includes(user.role)) ||
    (requireVerified && !user.isVerified) ||
    (requireUnverified && user.isVerified) ||
    (requireSubscriptionStatus &&
      user.subscription?.status !== requireSubscriptionStatus) ||
    (requireSubscriptionType &&
      user.subscription?.type !== requireSubscriptionType);

  if (isBlocked) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
