import { Suspense } from "react";
import JobListingsPage from "./page";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function JobsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <JobListingsPage />
    </Suspense>
  );
}
