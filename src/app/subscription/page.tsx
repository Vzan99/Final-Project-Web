import SubscriptionCard from "@/components/subscription/subscriptionCard";
import SubscriptionHistory from "@/components/subscription/subscriptionHistory";
import PlanBenefitCard from "@/components/subscription/planBenefitCard";

export default function SubscriptionPage() {
  return (
    <main className="flex flex-col items-center p-6">
      <SubscriptionCard />
      <SubscriptionHistory />
      <PlanBenefitCard />
    </main>
  );
}
