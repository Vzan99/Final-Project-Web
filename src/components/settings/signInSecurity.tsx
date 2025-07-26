"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import ChangeEmailForm from "./changeEmailForm";
import ChangePasswordForm from "./changePasswordForm";
import { useAppSelector } from "@/lib/redux/hooks";

type SubSection = "change-email" | "change-password" | null;

export default function SignInSecurity() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeSubSection, setActiveSubSection] = useState<SubSection>(null);

  if (activeSubSection === "change-email")
    return (
      <div>
        <div className="flex justify-between items-center mb-6 px-4 py-3">
          <h2 className="text-xl font-semibold text-[#497187]">Change Email</h2>
          <button
            onClick={() => setActiveSubSection(null)}
            className="text-sm text-[#6096B4] hover:underline"
          >
            ← Back
          </button>
        </div>
        <ChangeEmailForm />
      </div>
    );

  if (activeSubSection === "change-password")
    return (
      <div>
        <div className="flex justify-between items-center mb-6 px-4 py-3">
          <h2 className="text-xl font-semibold text-[#497187]">
            Change Password
          </h2>
          <button
            onClick={() => setActiveSubSection(null)}
            className="text-sm text-[#6096B4] hover:underline"
          >
            ← Back
          </button>
        </div>
        <ChangePasswordForm />
      </div>
    );

  return (
    <div
      className="divide-y divide-gray-100 rounded bg-white"
      style={{ borderColor: "#F1F5F9" }}
    >
      <div
        className="flex justify-between items-center px-4 py-3 hover:bg-[#F1F5F9] cursor-pointer"
        onClick={() => setActiveSubSection("change-email")}
      >
        <div>
          <p className="text-gray-700 font-medium">Email Address</p>
          <p className="text-sm text-[#497187]">{currentUser?.email}</p>
        </div>
        <ArrowRight />
      </div>
      <div
        className="flex justify-between items-center px-4 py-3 hover:bg-[#F1F5F9] cursor-pointer"
        onClick={() => setActiveSubSection("change-password")}
      >
        <p className="text-gray-700 font-medium">Change Password</p>
        <ArrowRight />
      </div>
    </div>
  );
}
