"use client";

import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/redux/hooks";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeSection, setActiveSection] = useState<
    "verify" | "change-email" | "change-password" | null
  >(null);

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

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

  return (
    <main className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-6">
        {/* Account Preferences */}
        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-[#6096B4] font-semibold text-lg mb-2">
            Account Preferences
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Show authenticity to boost trust.
          </p>
          {!currentUser?.isVerified && (
            <button
              onClick={handleResendVerification}
              className="text-sm text-white bg-[#6096B4] hover:bg-[#497187] px-4 py-2 rounded"
            >
              Verify for free
            </button>
          )}
        </div>

        {/* Sign in & Security */}
        <div className="bg-white border rounded shadow">
          <button className="w-full text-left px-4 py-3 font-semibold text-[#6096B4]">
            Sign in & Security
          </button>

          {/* Account Access */}
          <div className="border-t px-4 py-3 text-sm space-y-3">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => setActiveSection("change-email")}
            >
              <div>
                <p className="font-medium text-gray-700">Email Address</p>
                <p className="text-[#497187] text-xs">{currentUser?.email}</p>
              </div>
              <ArrowRight size={18} />
            </div>

            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => setActiveSection("change-password")}
            >
              <div>
                <p className="font-medium text-gray-700">Change Password</p>
              </div>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>

        {/* Subscriptions & Payments */}
        <div className="bg-white border rounded shadow">
          <button className="w-full text-left px-4 py-3 font-semibold text-[#6096B4]">
            Subscriptions & Payments
          </button>
          <div className="border-t px-4 py-3 text-sm space-y-3">
            <div className="text-gray-700">Subscription Status</div>
            <div className="text-gray-700">View Purchase History</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-grow bg-white border rounded shadow p-6">
        {activeSection === "change-email" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#497187]">
              Change Email
            </h2>
            <form className="space-y-4">
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
              <button
                type="submit"
                className="bg-[#6096B4] text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {activeSection === "change-password" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#497187]">
              Change Password
            </h2>
            <form className="space-y-4">
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
              <button
                type="submit"
                className="bg-[#6096B4] text-white px-4 py-2 rounded"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
