"use client";

import React, { useState, useEffect } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "../../../../../types/userprofile";

type ProfileFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ProfileForm({
  initialData,
  onSuccess,
  onCancel,
}: ProfileFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setAddress(initialData.profile?.address || "");
    setAbout(initialData.profile?.about || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userId: initialData?.id,
        name,
        address,
        about,
      };

      await API.put("/profile/edit/user", payload);

      toast.success("Profile updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update profile: " +
          (error?.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block font-medium text-gray-700">
          Address
        </label>
        <input
          id="address"
          type="text"
          value={address || ""}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      {/* About */}
      <div>
        <label htmlFor="about" className="block font-medium text-gray-700">
          About Me
        </label>
        <textarea
          id="about"
          value={about || ""}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          className="mt-1 block w-full border rounded px-3 py-2"
          placeholder="Write a short bio about yourself"
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
