"use client";

import React, { useState, useEffect } from "react";
import EditDialog from "@/components/userprofile/editDialog";
import { toast } from "react-toastify";
import { rejectionFeedbackSchema } from "@/schemas/rejectApplicant";

interface RejectDialogProps {
  isOpen: boolean;
  initialFeedback?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

export default function RejectDialog({
  isOpen,
  initialFeedback = "",
  loading = false,
  onClose,
  onSubmit,
}: RejectDialogProps) {
  const [feedback, setFeedback] = useState(initialFeedback);

  useEffect(() => {
    if (isOpen) setFeedback(initialFeedback);
  }, [isOpen, initialFeedback]);

  const handleSubmit = async () => {
    try {
      const validated = await rejectionFeedbackSchema.validate({ feedback });
      onSubmit(validated.feedback.trim());
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <EditDialog
      open={isOpen}
      onClose={onClose}
      title="Provide Rejection Feedback"
    >
      <textarea
        className="w-full border rounded p-2 h-32 resize-none"
        placeholder="Reason for rejection..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <p>Feedback maximum contains 200 characters</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#89A8B2] hover:bg-[#648089] text-white rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </EditDialog>
  );
}
