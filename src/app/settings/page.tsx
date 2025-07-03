"use client";

import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/redux/hooks";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Section = "account-preferences" | "sign-in-security" | "subscriptions";
type SubSection = "change-email" | "change-password" | null;

export default function SettingsPage() {
  const currentUser = useAppSelector((state) => state.auth.user);

  const [activeSection, setActiveSection] = useState<Section>(
    "account-preferences"
  );
  const [activeSubSection, setActiveSubSection] = useState<SubSection>(null);

  const [emailData, setEmailData] = useState({ newEmail: "", password: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResendVerification = async () => {
    try {
      await API.post("/auth/resend-verification");
      toast.success("Verification email sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend email.");
    }
  };

  const renderTitle = () => {
    switch (activeSection) {
      case "account-preferences":
        return "Account Preferences";
      case "sign-in-security":
        return "Sign In & Security";
      case "subscriptions":
        return "Subscriptions & Payments";
      default:
        return "";
    }
  };

  const renderMainContent = () => {
    if (activeSubSection === "change-email") {
      return (
        <div>
          <div className="flex justify-between items-center mb-6 px-4 py-3">
            <h2 className="text-xl font-semibold text-[#497187]">
              Change Email
            </h2>
            <button
              onClick={() => setActiveSubSection(null)}
              className="text-sm text-[#6096B4] hover:underline"
            >
              ← Back
            </button>
          </div>
          <form className="space-y-4 px-4 py-3">
            <input
              type="email"
              name="newEmail"
              placeholder="New Email"
              value={emailData.newEmail}
              onChange={handleEmailChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Current Password"
              value={emailData.password}
              onChange={handleEmailChange}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#6096B4] text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (activeSubSection === "change-password") {
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
          <form className="space-y-4 px-4 py-3">
            <input
              type="password"
              name="oldPassword"
              placeholder="Current Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#6096B4] text-white px-4 py-2 rounded"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      );
    }

    switch (activeSection) {
      case "account-preferences":
        return (
          <div className="text-center space-y-4 p-6">
            <Image
              src="/verified_true.png"
              alt="Verified"
              width={64}
              height={64}
              className="mx-auto"
            />
            <h2 className="text-lg font-semibold text-[#497187]">
              Show authenticity to boost trust
            </h2>
            {!currentUser?.isVerified ? (
              <button
                onClick={handleResendVerification}
                className="bg-[#6096B4] hover:bg-[#497187] text-white px-6 py-2 rounded"
              >
                Get Verified
              </button>
            ) : (
              <p className="text-green-600 font-medium">
                You are already verified
              </p>
            )}
          </div>
        );

      case "sign-in-security":
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

      case "subscriptions":
        return (
          <div
            className="divide-y divide-gray-100 rounded bg-white"
            style={{ borderColor: "#F1F5F9" }}
          >
            <div
              className="flex justify-between items-center px-4 py-3 hover:bg-[#F1F5F9] cursor-pointer"
              onClick={() => console.log("View subscription status")}
            >
              <p className="text-gray-700 font-medium">Subscription Status</p>
              <ArrowRight />
            </div>
            <div
              className="flex justify-between items-center px-4 py-3 hover:bg-[#F1F5F9] cursor-pointer"
              onClick={() => console.log("View purchase history")}
            >
              <p className="text-gray-700 font-medium">View Purchase History</p>
              <ArrowRight />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 space-y-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-[#497187] mb-4">Settings</h1>
        {[
          { label: "Account Preferences", key: "account-preferences" },
          { label: "Sign in & Security", key: "sign-in-security" },
          { label: "Subscriptions & Payments", key: "subscriptions" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActiveSection(item.key as Section);
              setActiveSubSection(null);
            }}
            className={`w-full text-left px-4 py-3 rounded font-medium shadow-sm transition ${
              activeSection === item.key
                ? "bg-[#6096B4] text-white"
                : "bg-white text-[#6096B4] hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <section
        className="flex-grow rounded p-6 max-w-2xl min-h-[550px]"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className="rounded bg-white border border-gray-200 divide-y divide-gray-100"
          style={{ borderColor: "#F1F5F9" }}
        >
          {/* Title + Content now grouped */}
          <div>
            <h2 className="text-xl font-bold text-[#497187] px-4 py-3">
              {renderTitle()}
            </h2>
          </div>
          <div>{renderMainContent()}</div>
        </div>
      </section>
    </main>
  );
}
