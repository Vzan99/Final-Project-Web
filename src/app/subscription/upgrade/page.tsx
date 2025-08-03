import SubscriptionUpgradeForm from "@/components/subscription/subscriptionUpgradeForm";
import ProtectedRoute from "@/components/protectedRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function SubscriptionUpgradePage() {
  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      fallback={<Spinner />}
    >
      <SubscriptionUpgradeForm />
    </ProtectedRoute>
  );
}
