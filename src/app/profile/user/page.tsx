"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil } from "lucide-react";
import ProfileForm from "./profileForm";
import API from "@/lib/axios";
import { X } from "lucide-react";

type UserProfileData = {
  id: string;
  name: string;
  email: string;
  profile?: {
    birthDate: string;
    gender: string;
    education: string;
    address: string;
    photoUrl?: string;
    resumeUrl?: string;
    skills: string[];
  };
  certificates?: any[];
};

export default function UserProfilePage() {
  const [isEditOpen, setEditOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  const fileImageRef = useRef<HTMLInputElement>(null);
  const fileResumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        const data = res.data.data;
        setProfile(data);

        if (data.profile?.photoUrl) {
          setProfileImage(data.profile.photoUrl);
        }

        if (data.profile?.resumeUrl) {
          const filename = data.profile.resumeUrl.split("/").pop() || null;
          setResumeFilename(filename);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResumeFilename(file.name);
  };

  const userName = profile?.name || "";
  const userLocation = profile?.profile?.address || "";

  return (
    <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {/* Top Section: Banner + Profile Image */}
        <div
          className="relative bg-white rounded-t-xl h-48"
          style={{
            backgroundImage: "url('/placeholder_banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Name + Location + Edit Button */}
        <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start">
          {/* Profile Image Overlapping */}
          <div className="absolute -top-16 left-8">
            <div className="relative w-32 h-32">
              <img
                src={profileImage || "/placeholder_user.png"}
                alt="Profile"
                className="rounded-full object-cover w-full h-full border-6 border-white"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-[#89A8B2] text-white rounded-full p-1 hover:bg-[#7a98a1]"
                onClick={() => fileImageRef.current?.click()}
              >
                <Pencil size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileImageRef}
                hidden
              />
            </div>
          </div>

          {/* Name + Location (with margin for the photo) */}

          {/* Edit Button far right */}
          <button
            onClick={() => setEditOpen(true)}
            className="ml-auto bg-[#89A8B2] text-white rounded-full p-2 hover:bg-[#7a98a1] transition self-start"
            aria-label="Edit Profile"
            title="Edit Profile"
          >
            <Pencil size={18} />
          </button>
          <div className="flex flex-col justify-center mt-4">
            <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
            <p className="text-sm text-gray-600">
              {userLocation || "Location not provided"}
            </p>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Resume Upload */}
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Resume
              </h2>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={fileResumeRef}
                onChange={handleResumeUpload}
                hidden
              />
              <button
                onClick={() => fileResumeRef.current?.click()}
                className="bg-[#89A8B2] text-white px-4 py-2 rounded hover:bg-[#7a98a1]"
              >
                {resumeFilename ? "Change Resume" : "Upload Resume"}
              </button>
              {resumeFilename && (
                <p className="text-sm mt-2 text-[#89A8B2]">{resumeFilename}</p>
              )}
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

      {/* Profile Form Dialog */}
      <Dialog
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-y-auto relative">
            {/* Title + Close Button */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setEditOpen(false)}
                className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-6 pt-4 pb-6">
              <ProfileForm />
            </div>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
