import { Pencil } from "lucide-react";

export default function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[#89A8B2] hover:text-[#7a98a1]"
            aria-label={`Edit ${title}`}
          >
            <Pencil size={16} />
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600 space-y-1">{children}</div>
    </div>
  );
}
