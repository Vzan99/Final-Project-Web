import { ArrowRight } from "lucide-react";

export default function Subscriptions() {
  return (
    <div
      className="divide-y divide-gray-100 rounded bg-white"
      style={{ borderColor: "#F1F5F9" }}
    >
      <div
        className="flex justify-between items-center px-4 py-3 hover:bg-[#F1F5F9] cursor-pointer"
        onClick={() => console.log("View subscription status")}
      >
        <p className="text-gray-700 font-medium">Subscription Status</p>
        <ArrowRight />
      </div>
      <div
        className="flex justify-between items-center px-4 py-3 hover:bg-[#F1F5F9] cursor-pointer"
        onClick={() => console.log("View purchase history")}
      >
        <p className="text-gray-700 font-medium">View Purchase History</p>
        <ArrowRight />
      </div>
    </div>
  );
}
