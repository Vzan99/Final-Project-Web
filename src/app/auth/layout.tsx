import Spinner from "@/components/loadingSkeleton/spinner";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}
