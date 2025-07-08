import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function EditDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white max-w-xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-y-auto relative">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 pt-4 pb-6">{children}</div>
        </div>
      </div>
    </Dialog>
  );
}
