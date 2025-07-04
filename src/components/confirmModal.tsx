"use client";

import { Dialog } from "@headlessui/react";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message = "Are you sure you want to proceed?",
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
        <h2
          id="confirm-modal-title"
          className="text-lg font-bold mb-2 text-gray-800"
        >
          Confirm Action
        </h2>
        <p
          id="confirm-modal-description"
          className="text-sm text-gray-600 mb-4"
        >
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-[#6096B4] hover:bg-[#4a7b98] text-white"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, continue
          </button>
        </div>
      </div>
    </Dialog>
  );
}
