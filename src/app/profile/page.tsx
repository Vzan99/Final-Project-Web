"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil } from "lucide-react";
import ProfileForm from "./profileForm";
import API from "@/lib/axios";

type ProfileData = {
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

export default function ProfilePage() {
  const [isEditOpen, setEditOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

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
        >
          <div className="absolute bottom-[-3rem] left-8">
            <div className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={profileImage || "/placeholder_user.png"}
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full border border-[#B3C8CF]"
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
          </div>
        </div>

        {/* Name + Location + Edit Button */}
        <div className="bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{userName}</h1>
              <p className="text-sm text-gray-600">
                {userLocation || "Location not provided"}
              </p>
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
