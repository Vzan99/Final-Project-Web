import { Suspense } from "react";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <main>{children}</main>
    </Suspense>
  );
}
