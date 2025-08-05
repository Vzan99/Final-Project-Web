const plans = [
  {
    type: "STANDARD",
    price: 25000,
    features: ["CV Generator", "Skill Assessment x2"],
  },
  {
    type: "PROFESSIONAL",
    price: 100000,
    features: ["CV Generator", "Unlimited Skill Assessment", "Priority Review"],
  },
];

export default function PlanBenefitCard() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      {plans.map((plan) => (
        <div
          key={plan.type}
          className="bg-white shadow-md rounded-2xl p-6 border hover:border-blue-600 transition"
        >
          <h3 className="text-lg font-semibold mb-2">
            {plan.type} Plan – Rp{plan.price.toLocaleString("id-ID")}
          </h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
