import SubscriptionCard from "@/components/subscription/subscriptionCard";
import SubscriptionHistory from "@/components/subscription/subscriptionHistory";
import PlanBenefitCard from "@/components/subscription/planBenefitCard";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function SubscriptionPage() {
  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      fallback={<Spinner />}
    >
      <main className="flex flex-col items-center p-6">
        <SubscriptionCard />
        <SubscriptionHistory />
        <PlanBenefitCard />
      </main>
    </ProtectedRoute>
  );
}
