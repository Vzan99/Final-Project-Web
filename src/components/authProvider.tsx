"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser())
      .unwrap()
      .catch(() => {});
  }, [dispatch]);

  return <>{children}</>;
}
