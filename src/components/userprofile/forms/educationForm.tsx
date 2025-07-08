"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { UserProfileData } from "../../../../../types/userprofile";

type EducationFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function EducationForm({
  initialData,
  onSuccess,
  onCancel,
}: EducationFormProps) {
  const [education, setEducation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setEducation(initialData.profile?.education || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/profile/edit/user", {
        userId: initialData?.id,
        education,
      });
      toast.success("Education updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update education: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="education" className="block font-medium text-gray-700">
          Education
        </label>
        <input
          id="education"
          type="text"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="e.g. Bachelor’s Degree in Computer Science"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#89A8B2] text-white hover:bg-[#7a98a1]"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
