"use client";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";
import API from "@/lib/axios";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

import ProfileForm from "./components/forms/profileForm";
import ContactForm from "./components/forms/contactForm";
import BasicInfoForm from "./components/forms/basicInfoForm";
import EducationForm from "./components/forms/educationForm";
import SkillsForm from "./components/forms/skillsForm";
import ExperienceForm from "./components/forms/experienceForm";

import SectionCard from "./components/sectionCard";
import EditDialog from "./components/editDialog";
import { Pencil } from "lucide-react";
import ResumeDownloadButton from "./components/resumeDownloadButton";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export default function UserProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const [isEditOpen, setEditOpen] = useState(false);
  const [isContactEditOpen, setContactEditOpen] = useState(false);
  const [isBasicInfoEditOpen, setBasicInfoEditOpen] = useState(false);
  const [isEducationEditOpen, setEducationEditOpen] = useState(false);
  const [isSkillsEditOpen, setSkillsEditOpen] = useState(false);
  const [isExperienceEditOpen, setExperienceEditOpen] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileImageRef = useRef<HTMLInputElement>(null);
  const fileResumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const profileImageUrl =
    getCloudinaryImageUrl(profile?.profile?.photoUrl) ||
    "/placeholder_user.png";

  const resumeFilename = profile?.profile?.resumeUrl || null;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const resumeDownloadUrl = resumeFilename
    ? `https://res.cloudinary.com/${cloudName}/raw/upload/${resumeFilename}`
    : null;

  const closeAllModals = () => {
    setEditOpen(false);
    setContactEditOpen(false);
    setBasicInfoEditOpen(false);
    setEducationEditOpen(false);
    setSkillsEditOpen(false);
    setExperienceEditOpen(false);
  };

  const handleSuccess = (
    dialogSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return () => {
      dispatch(fetchUser());
      dialogSetter(false);
    };
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      await API.put("/profile/edit/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await dispatch(fetchUser());
    } catch (err) {
      console.error("Resume upload failed:", err);
      setUploadError("Failed to upload resume. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      await API.put("/profile/edit/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await dispatch(fetchUser());
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Failed to upload photo. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black max-w-5xl mx-auto px-4 md:px-0">
        <SkeletonBlock className="rounded-t-xl h-48 mb-10" />
        <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start">
          <div className="absolute -top-16 left-8">
            <SkeletonBlock className="w-32 h-32 rounded-full border-6 border-white" />
          </div>
          <SkeletonBlock className="h-10 w-40 ml-auto mb-4 rounded-full" />
          <SkeletonBlock className="h-8 w-60 mb-2 rounded" />
          <SkeletonBlock className="h-4 w-40 rounded" />
          <div className="mt-4">
            <SkeletonBlock className="h-6 w-32 mb-1 rounded" />
            <SkeletonBlock className="h-12 w-full rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonBlock key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="md:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonBlock key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div
          className="relative bg-white rounded-t-xl h-48"
          style={{
            backgroundImage: "url('/placeholder_banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start">
          <div className="absolute -top-16 left-8">
            <div className="relative w-32 h-32">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="rounded-full object-cover w-full h-full border-6 border-white"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-[#89A8B2] text-white rounded-full p-1 hover:bg-[#7a98a1]"
                onClick={() => fileImageRef.current?.click()}
                title="Change Profile Picture"
                disabled={uploadLoading}
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
            {uploadLoading && (
              <p className="text-sm text-blue-600 mt-2">Uploading photo...</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-600 mt-2">{uploadError}</p>
            )}
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="ml-auto bg-[#89A8B2] text-white rounded-full p-2 hover:bg-[#7a98a1] transition self-start"
            aria-label="Edit Profile"
          >
            <Pencil size={18} />
          </button>

          <div className="flex flex-col justify-center mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.name || "Unnamed User"}
            </h1>
            <p className="text-sm text-gray-600">
              {profile.profile?.address || "Location not provided"}
            </p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              About Me
            </h2>
            <p className="text-gray-600">
              {profile.profile?.about || "No description provided."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <SectionCard
              title="Contact Info"
              onEdit={() => setContactEditOpen(true)}
            >
              <p>Email: {profile.email}</p>
              <p>Phone: {profile.phone || "Not provided"}</p>
            </SectionCard>

            <SectionCard
              title="Basic Info"
              onEdit={() => setBasicInfoEditOpen(true)}
            >
              <p>Gender: {profile.profile?.gender || "Not specified"}</p>
              <p>
                Birth Date:{" "}
                {profile.profile?.birthDate
                  ? new Date(profile.profile.birthDate).toLocaleDateString()
                  : "Not specified"}
              </p>
            </SectionCard>

            {/* Resume Upload/Download */}
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
                className="bg-[#89A8B2] text-white px-4 py-2 rounded hover:bg-[#7a98a1] mb-2"
              >
                {resumeFilename ? "Change Resume" : "Upload Resume"}
              </button>

              {resumeFilename && (
                <>
                  <p className="text-sm text-[#89A8B2] mb-2">
                    {resumeFilename}
                  </p>
                  <ResumeDownloadButton
                    resumeUrl={profile?.profile?.resumeUrl}
                  />
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <SectionCard
              title="Experience"
              onEdit={() => setExperienceEditOpen(true)}
            >
              <p>No experience added yet.</p>
            </SectionCard>

            <SectionCard title="Skills" onEdit={() => setSkillsEditOpen(true)}>
              <p>
                {profile.profile?.skills?.length
                  ? profile.profile.skills.join(", ")
                  : "Add your key skills here."}
              </p>
            </SectionCard>

            <SectionCard
              title="Education"
              onEdit={() => setEducationEditOpen(true)}
            >
              <p>{profile.profile?.education || "No education added yet."}</p>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditDialog
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
      >
        <ProfileForm
          initialData={profile}
          onSuccess={handleSuccess(setEditOpen)}
          onCancel={() => setEditOpen(false)}
        />
      </EditDialog>

      <EditDialog
        open={isContactEditOpen}
        onClose={() => setContactEditOpen(false)}
        title="Edit Contact Info"
      >
        <ContactForm
          initialData={profile}
          onSuccess={handleSuccess(setContactEditOpen)}
          onCancel={() => setContactEditOpen(false)}
        />
      </EditDialog>

      <EditDialog
        open={isBasicInfoEditOpen}
        onClose={() => setBasicInfoEditOpen(false)}
        title="Edit Basic Info"
      >
        <BasicInfoForm
          initialData={profile}
          onSuccess={handleSuccess(setBasicInfoEditOpen)}
          onCancel={() => setBasicInfoEditOpen(false)}
        />
      </EditDialog>

      <EditDialog
        open={isEducationEditOpen}
        onClose={() => setEducationEditOpen(false)}
        title="Edit Education"
      >
        <EducationForm
          initialData={profile}
          onSuccess={handleSuccess(setEducationEditOpen)}
          onCancel={() => setEducationEditOpen(false)}
        />
      </EditDialog>

      <EditDialog
        open={isSkillsEditOpen}
        onClose={() => setSkillsEditOpen(false)}
        title="Edit Skills"
      >
        <SkillsForm
          initialData={profile}
          onSuccess={handleSuccess(setSkillsEditOpen)}
          onCancel={() => setSkillsEditOpen(false)}
        />
      </EditDialog>

      <EditDialog
        open={isExperienceEditOpen}
        onClose={() => setExperienceEditOpen(false)}
        title="Edit Experience"
      >
        <ExperienceForm
          initialData={profile}
          onSuccess={handleSuccess(setExperienceEditOpen)}
          onCancel={() => setExperienceEditOpen(false)}
        />
      </EditDialog>
    </main>
  );
}
