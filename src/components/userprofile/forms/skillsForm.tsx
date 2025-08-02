"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { UserProfileData } from "@/types/userprofile";

type SkillsFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function SkillsForm({
  initialData,
  onSuccess,
  onCancel,
}: SkillsFormProps) {
  const initialSkills = initialData?.profile?.skills || [];
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();

    if (!trimmed) return;
    if (trimmed.length > 20) {
      toast.error("Each skill must be 20 characters or less.");
      return;
    }
    if (skills.includes(trimmed)) {
      toast.warning("Skill already added.");
      return;
    }
    if (skills.length >= 50) {
      toast.error("You can only add up to 50 skills.");
      return;
    }

    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (skills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.put("/profile/edit/user", {
        userId: initialData?.id,
        skills,
      });
      toast.success("Skills updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update skills: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="skills" className="block font-medium text-gray-700">
          Skills
        </label>
        <div className="relative mt-1">
          <input
            id="skills"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full border rounded px-3 py-2 pr-20"
            placeholder="Type a skill and press Enter, comma, or click Add"
            maxLength={20}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="absolute right-1 top-1 bottom-1 px-3 rounded bg-[#6096B4] text-white hover:bg-[#4b7c95] text-sm"
          >
            Add
          </button>
        </div>

        {/* Skill Chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-blue-500 hover:text-red-500"
                aria-label={`Remove ${skill}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {skills.length} / 50 skills added
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#89A8B2] text-white hover:bg-[#7a98a1]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
