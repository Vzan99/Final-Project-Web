"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerified?: boolean;
  fallback?: React.ReactNode;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireVerified = false,
  fallback = null,
}: Props) {
  const router = useRouter();
  const { user, isHydrated, loading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
    } else if (requireVerified && user.role === "USER" && !user.isVerified) {
      router.replace("/auth/unverified-email");
    }
  }, [isHydrated, user, allowedRoles, requireVerified, router]);

  if (
    !isHydrated ||
    loading ||
    !user ||
    (allowedRoles && !allowedRoles.includes(user.role)) ||
    (requireVerified && user.role === "USER" && !user.isVerified)
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
