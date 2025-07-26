"use client";

import { Section } from "../../app/settings/page";

type SidebarProps = {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
};

export default function Sidebar({
  activeSection,
  setActiveSection,
}: SidebarProps) {
  const tabs = [
    { label: "Account", key: "account-preferences" },
    { label: "Security", key: "sign-in-security" },
  ] as const;

  return (
    <>
      {/* Mobile / Tablet Horizontal Tabs */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 mb-6">
        <div className="flex space-x-2 min-w-max">
          {tabs.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeSection === key
                  ? "bg-[#6096B4] text-white"
                  : "bg-white border-gray-300 text-[#497187] hover:bg-gray-100"
              }`}
            >
              {label === "Account"
                ? "Account Preferences"
                : "Sign in & Security"}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 space-y-4 flex-shrink-0">
        {tabs.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-full text-left px-4 py-3 rounded font-medium shadow-sm transition ${
              activeSection === key
                ? "bg-[#6096B4] text-white"
                : "bg-white text-[#6096B4] hover:bg-gray-50"
            }`}
          >
            {label === "Account" ? "Account Preferences" : "Sign in & Security"}
          </button>
        ))}
      </aside>
    </>
  );
}
