"use client";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";
import API from "@/lib/axios";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

import ProfileForm from "@/components/userprofile/forms/profileForm";
import ContactForm from "@/components/userprofile/forms/contactForm";
import BasicInfoForm from "@/components/userprofile/forms/basicInfoForm";
import EducationForm from "@/components/userprofile/forms/educationForm";
import SkillsForm from "@/components/userprofile/forms/skillsForm";
import ExperienceForm from "@/components/userprofile/forms/experienceForm";

import SectionCard from "@/components/userprofile/sectionCard";
import EditDialog from "@/components/userprofile/editDialog";
import { Pencil } from "lucide-react";
import ResumeDownloadButton from "@/components/userprofile/resumeDownloadButton";
import { toast } from "react-toastify";

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
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileImageRef = useRef<HTMLInputElement>(null);
  const fileResumeRef = useRef<HTMLInputElement>(null);
  const fileBannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleResendVerification = async () => {
    setLoadingVerify(true);
    try {
      await API.post("/auth/resend-verification");
      toast.success("Verification email sent!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setLoadingVerify(false);
    }
  };

  const profileImageUrl =
    getCloudinaryImageUrl(profile?.profile?.photoUrl) ||
    "/placeholder_user.png";
  const bannerImageUrl =
    getCloudinaryImageUrl(profile?.profile?.bannerUrl) ||
    "/placeholder_banner.png";
  const resumeFilename = profile?.profile?.resumeUrl || null;

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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("banner", file);

      await API.put("/profile/edit/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await dispatch(fetchUser());
    } catch (err) {
      console.error("Banner upload failed:", err);
      setUploadError("Failed to upload banner. Please try again.");
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
        {/* Banner */}
        <div className="relative bg-white rounded-t-xl h-48 group overflow-hidden">
          <button
            type="button"
            onClick={() => fileBannerRef.current?.click()}
            className="absolute inset-0 w-full h-full z-10 cursor-pointer"
            disabled={uploadLoading}
            aria-label="Change Banner Image"
          />
          <div
            className={`w-full h-full bg-cover bg-center transition-opacity duration-300 pointer-events-none ${
              uploadLoading ? "opacity-50 animate-pulse" : ""
            }`}
            style={{
              backgroundImage: `url('${bannerImageUrl}')`,
            }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileBannerRef}
            onChange={handleBannerUpload}
            hidden
          />
        </div>

        {/* Profile Card */}
        <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start z-20">
          {/* Profile image container */}
          <div className="absolute -top-16 left-0 right-0 md:left-8 md:right-auto z-30">
            <div className="relative w-32 h-32 mx-auto md:mx-0 cursor-pointer">
              <button
                type="button"
                onClick={() => fileImageRef.current?.click()}
                disabled={uploadLoading}
                className={`rounded-full overflow-hidden w-32 h-32 border-6 border-white block cursor-pointer ${
                  uploadLoading ? "animate-pulse" : ""
                }`}
                aria-label="Change Profile Picture"
              >
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  draggable={false}
                />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileImageRef}
                hidden
              />
            </div>

            {uploadError && (
              <p className="text-sm text-red-600 mt-2 text-center md:text-left">
                {uploadError}
              </p>
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
            <div className="flex items-center space-x-2 mt-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {profile.name || "Unnamed User"}
              </h1>

              {profile.isVerified ? (
                <div className="relative group">
                  <img
                    src="/verified_true.png"
                    alt="Verified User"
                    className="w-6 h-6"
                  />
                  <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                    Verified User
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <img
                    src="/verified_false.png"
                    alt="Unverified User"
                    className="w-6 h-6"
                  />
                  <button
                    onClick={handleResendVerification}
                    disabled={loadingVerify}
                    className={`text-sm text-[#89A8B2] border border-dashed border-[#89A8B2] rounded-4xl px-3 py-1 hover:bg-[#7a98a1] hover:text-white transition flex items-center justify-center ${
                      loadingVerify ? "animate-pulse" : ""
                    }`}
                    aria-label="Get Verified Now"
                  >
                    {loadingVerify ? "Sending..." : "Get verified now"}
                  </button>
                </div>
              )}
            </div>

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
            {/* Badge Section */}
            {(profile.subscription || profile.assessments?.length) && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-1">
                  Badges
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* Subscription Badge */}
                  {profile.subscription?.status === "ACTIVE" && (
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                      {profile.subscription.type === "PROFESSIONAL"
                        ? "PRO"
                        : "STANDARD"}
                    </span>
                  )}

                  {/* Assessment Badges */}
                  {profile.assessments?.map(
                    (a: {
                      id: string;
                      badge: string;
                      assessment: { name: string };
                    }) => (
                      <span
                        key={a.id}
                        className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {a.badge} - {a.assessment.name}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
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

            {/* Resume */}
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
              {uploadLoading ? (
                <div className="h-10 w-40 bg-gray-300 rounded mx-auto animate-pulse mb-2 flex items-center justify-center text-gray-700 font-medium">
                  Uploading...
                </div>
              ) : (
                <button
                  onClick={() => fileResumeRef.current?.click()}
                  className="bg-[#89A8B2] text-white px-4 py-2 rounded mb-2 hover:bg-[#7a98a1]"
                  disabled={uploadLoading}
                >
                  {resumeFilename ? "Change Resume" : "Upload Resume"}
                </button>
              )}
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
              {profile.subscription?.status !== "ACTIVE" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900">
                  <h3 className="font-semibold mb-2">
                    Upgrade to Create Stunning CVs!
                  </h3>
                  <p className="mb-3">
                    Unlock our CV Generator to create professional,
                    ready-to-download resumes. Customize, preview, and export
                    with ease — exclusive for subscribed users.
                  </p>
                  <a
                    href="/subscription/upgrade"
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-medium"
                  >
                    Upgrade to Access CV Generator
                  </a>
                </div>
              )}

              {profile.subscription?.status === "ACTIVE" && (
                <a
                  href="/cv"
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium"
                >
                  Open CV Generator
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <SectionCard
              title="Experience"
              onEdit={() => setExperienceEditOpen(true)}
            >
              {profile?.profile?.experiences &&
              profile.profile.experiences.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {profile.profile.experiences.map((exp, i) => (
                    <li key={exp.id || i}>
                      <span className="font-semibold">{exp.title}</span> at{" "}
                      <span className="italic">{exp.companyName}</span> (
                      {new Date(exp.startDate).toLocaleDateString()} -{" "}
                      {exp.currentlyWorking
                        ? "Present"
                        : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString()
                        : "N/A"}
                      )
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No experience added yet.</p>
              )}
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
        {" "}
        <ExperienceForm
          initialData={profile}
          onSuccess={handleSuccess(setExperienceEditOpen)}
          onCancel={() => setExperienceEditOpen(false)}
        />
      </EditDialog>
    </main>
  );
}
