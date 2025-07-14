"use client";

import React, { useState, useEffect } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "@/types/userprofile";

type ContactFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ContactForm({
  initialData,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setPhone(initialData.phone || "");
    setEmail(initialData.email || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userId: initialData?.id,
        phone,
      };

      await API.put("/profile/edit/user", payload);

      toast.success("Contact info updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update contact info: " +
          (error?.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email (non-editable) */}
      <div>
        <label htmlFor="email" className="block font-medium text-gray-700">
          Email (cannot be changed here)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          type="text"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
