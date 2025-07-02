"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { toast } from "react-toastify";

type ProtectedProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerified?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  showIfInvalid?: boolean;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireVerified = false,
  redirectTo = "/unauthorized",
  fallback = null,
  showIfInvalid = false,
}: ProtectedProps) {
  const { user, isHydrated } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    const check = () => {
      if (!user) {
        if (!showIfInvalid) {
          toast.error("Please login to continue");
          router.replace(
            `/auth/login?redirect=${encodeURIComponent(pathname)}`
          );
        }
        return setChecked(true);
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (!showIfInvalid) {
          toast.error("Access denied");
          router.replace(redirectTo);
        }
        return setChecked(true);
      }

      if (
        requireVerified &&
        user.role === "USER" &&
        user.isVerified === false
      ) {
        if (!showIfInvalid) {
          toast.error("Please verify your email");
          router.replace("/auth/unverified-email");
        }
        return setChecked(true);
      }

      setChecked(true);
    };

    check();
  }, [
    user,
    isHydrated,
    allowedRoles,
    requireVerified,
    redirectTo,
    pathname,
    router,
    showIfInvalid,
  ]);

  if (!checked || !isHydrated) return fallback;

  const isAllowed =
    user &&
    (!allowedRoles || allowedRoles.includes(user.role)) &&
    (!requireVerified || user.isVerified || user.role !== "USER");

  return (isAllowed && !showIfInvalid) || (!isAllowed && showIfInvalid) ? (
    <>{children}</>
  ) : null;
}
