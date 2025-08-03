"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function GuestRoute({ children, fallback = null }: Props) {
  const { user, isHydrated, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (user) {
      setRedirecting(true);
      router.replace("/home");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || loading || redirecting) return <>{fallback}</>;

  return <>{children}</>;
}
