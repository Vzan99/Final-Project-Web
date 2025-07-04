"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { UserProfileData } from "../../types";

type ExperienceFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ExperienceForm({
  initialData,
  onSuccess,
  onCancel,
}: ExperienceFormProps) {
  const [experience, setExperience] = useState(""); // Replace with real experience data later
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/profile/edit/user", {
        userId: initialData?.id,
        experience,
      });
      toast.success("Experience updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update experience: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="experience" className="block font-medium text-gray-700">
          Experience
        </label>
        <textarea
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={5}
          placeholder="Describe your experience"
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
