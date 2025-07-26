"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import Sidebar from "../../components/settings/sidebar";
import AccountPreferences from "../../components/settings/accountPreferences";
import SignInSecurity from "../../components/settings/signInSecurity";
import ProtectedRoute from "@/components/protectedRoute";
import SettingsSkeleton from "@/components/loadingSkeleton/settingsSkeleton";

export type Section = "account-preferences" | "sign-in-security";

export default function SettingsPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeSection, setActiveSection] = useState<Section>(
    "account-preferences"
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "account-preferences":
        return <AccountPreferences currentUser={currentUser} />;
      case "sign-in-security":
        return <SignInSecurity />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={["USER", "ADMIN"]}
      fallback={<SettingsSkeleton />}
    >
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[#497187] mb-4">Settings</h1>

        {/* Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <section className="flex-grow rounded max-w-2xl min-h-[550px]">
            <div className="rounded bg-white border border-gray-200 divide-y divide-gray-100">
              <div>
                <h2 className="text-xl font-bold text-[#497187] px-4 py-3">
                  {activeSection === "account-preferences"
                    ? "Account Preferences"
                    : "Sign In & Security"}
                </h2>
              </div>
              <div>{renderMainContent()}</div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
