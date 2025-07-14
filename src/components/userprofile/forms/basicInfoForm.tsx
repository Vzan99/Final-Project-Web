"use client";

import React, { useState, useEffect } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "@/types/userprofile";

type BasicInfoFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BasicInfoForm({
  initialData,
  onSuccess,
  onCancel,
}: BasicInfoFormProps) {
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setGender(initialData.profile?.gender || "");
    setBirthDate(initialData.profile?.birthDate || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userId: initialData?.id,
        gender,
        birthDate,
      };

      await API.put("/profile/edit/user", payload);

      toast.success("Basic info updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update basic info: " +
          (error?.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gender */}
      <div>
        <label htmlFor="gender" className="block font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Birth Date */}
      <div>
        <label htmlFor="birthDate" className="block font-medium text-gray-700">
          Birth Date
        </label>
        <input
          id="birthDate"
          type="date"
          value={birthDate ? birthDate.slice(0, 10) : ""}
          onChange={(e) => setBirthDate(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
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
