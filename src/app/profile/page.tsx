"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil } from "lucide-react";
import ProfileForm from "./profileForm";
import ProfileImageUpload from "./profileImageUpload";
import ResumeUpload from "./resumeUpload";

export default function ProfilePage() {
  const [isEditOpen, setEditOpen] = useState(false);
  const userName = "john.doe@example.com".split("@")[0]; // Replace with actual user email
  const userLocation = "Jakarta, Indonesia"; // Replace with actual user data

  return (
    <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {/* Top Section: Banner + Profile Image */}
        <div className="relative bg-white rounded-t-xl h-48">
          <div className="absolute bottom-[-3rem] left-8">
            <ProfileImageUpload />
          </div>
        </div>

        {/* Name + Location + Edit Button */}
        <div className="bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
              <p className="text-sm text-gray-600">{userLocation}</p>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-[#89A8B2] text-white px-4 py-2 rounded hover:bg-[#7a98a1]"
            >
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Resume
              </h2>
              <ResumeUpload />
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Contact Info
              </h2>
              <p className="text-sm text-gray-600">Edit your contact details</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Activity
              </h2>
              <p className="text-sm text-gray-600">You haven't posted yet</p>
            </div>
          </div>

          {/* Right Main Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Experience
              </h2>
              <p className="text-gray-600 text-sm">No experience added yet.</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
              <p className="text-gray-600 text-sm">Add your key skills here.</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Education
              </h2>
              <p className="text-gray-600 text-sm">No education added yet.</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        className="relative z-50"
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Centered modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <ProfileForm />

            <div className="text-right mt-4">
              <button
                onClick={() => setEditOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
