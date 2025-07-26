"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { toast } from "react-toastify";

type ProtectedButtonProps = {
  allowedRoles?: string[];
  requireVerified?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
};

export default function ProtectedButton({
  allowedRoles,
  requireVerified = false,
  onClick,
  className,
  children,
  disabled,
  title,
}: ProtectedButtonProps) {
  const router = useRouter();
  const { user, isHydrated } = useAppSelector((state) => state.auth);

  const handleClick = () => {
    if (!isHydrated) return;

    if (!user) {
      toast.error("Please login to continue");
      router.push(`/auth/login`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("Access denied");
      return;
    }

    if (requireVerified && user.role === "USER" && !user.isVerified) {
      toast.error("Please verify your email");
      router.push("/auth/unverified-email");
      return;
    }

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}
