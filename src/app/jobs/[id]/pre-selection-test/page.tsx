import Spinner from "@/components/loadingSkeleton/spinner";
import PreSelectionAnswerForm from "@/components/pre-selection-test/PreSelectionAnswerForm";
import ProtectedRoute from "@/components/protectedRoute";

export default function PreSelectionTestUserPage() {
  return (
    <ProtectedRoute
      allowedRoles={["USER"]}
      requireVerified={true}
      fallback={<Spinner />}
    >
      <div className="max-w-4xl mx-auto py-10 px-4">
        <PreSelectionAnswerForm />
      </div>
    </ProtectedRoute>
  );
}
