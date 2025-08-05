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
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/protectedRoute";
import UserProfileSkeleton from "@/components/loadingSkeleton/userProfileSkeleton";

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

  const fileImageRef = useRef<HTMLInputElement>(null);
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

  const handleSuccess = (
    dialogSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return () => {
      dispatch(fetchUser());
      dialogSetter(false);
    };
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      await API.put("/profile/edit/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await dispatch(fetchUser());
    } catch (err) {
      toast.error(
        "Failed to upload photo. File must be JPG, JPEG or PNG, Maximum 1 MB"
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("banner", file);

      await API.put("/profile/edit/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await dispatch(fetchUser());
    } catch (err) {
      toast.error(
        "Failed to upload banner. File must be JPG, JPEG or PNG, Maximum 1 MB"
      );
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["USER"]} fallback={<UserProfileSkeleton />}>
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
            <div className="absolute -top-16 left-0 right-0 md:left-8 md:right-auto z-30 pointer-events-none">
              <div className="relative w-32 h-32 mx-auto md:mx-0 cursor-pointer">
                <button
                  type="button"
                  onClick={() => fileImageRef.current?.click()}
                  disabled={uploadLoading}
                  className={`rounded-full w-32 h-32 border-6 border-white block cursor-pointer pointer-events-auto bg-white ${
                    uploadLoading ? "animate-pulse" : ""
                  }`}
                  aria-label="Change Profile Picture"
                >
                  <div className="bg-white w-full h-full flex items-center justify-center rounded-full overflow-hidden">
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="object-cover w-full h-full"
                      draggable={false}
                    />
                  </div>
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
                  {profile?.name || "Unnamed User"}
                </h1>

                {profile?.isVerified ? (
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
                {profile?.profile?.address || "Location not provided"}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">
                About Me
              </h2>
              <p className="text-gray-600">
                {profile?.profile?.about || "No description provided."}
              </p>
              {/* Badge Section */}
              {(profile?.subscription?.status === "ACTIVE" ||
                (profile?.assessments && profile.assessments.length > 0)) && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Badges
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {/* Subscription Badge */}
                    {profile.subscription?.status === "ACTIVE" && (
                      <span
                        title="Subscription"
                        className="relative inline-flex items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-sm px-4 py-1 rounded-full font-semibold shadow-md hover:shadow-lg transition"
                      >
                        {profile.subscription.type === "PROFESSIONAL"
                          ? "PRO"
                          : "STANDARD"}
                      </span>
                    )}

                    {/* Unique Skill Badges */}
                    {[
                      ...new Set(
                        (profile.assessments || [])
                          .filter((a) => a.badge && a.badge.trim() !== "")
                          .map((a) => a.badge!)
                      ),
                    ].map((badge, index) => (
                      <span
                        key={index}
                        title="Skill Assessment"
                        className="relative inline-flex items-center bg-sky-100 text-sky-800 text-sm px-3 py-1 rounded-full font-medium border border-sky-300 hover:bg-sky-200 transition"
                      >
                        {badge}
                      </span>
                    ))}
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
                <p>Email: {profile?.email}</p>
                <p>Phone: {profile?.phone || "Not provided"}</p>
              </SectionCard>

              <SectionCard
                title="Basic Info"
                onEdit={() => setBasicInfoEditOpen(true)}
              >
                <p>Gender: {profile?.profile?.gender || "Not specified"}</p>
                <p>
                  Birth Date:{" "}
                  {profile?.profile?.birthDate
                    ? new Date(profile.profile.birthDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Not specified"}
                </p>
              </SectionCard>

              <SectionCard title="CV Generator">
                {profile?.subscription?.status !== "ACTIVE" ? (
                  <>
                    <p className="text-gray-700 mb-2">
                      Create stunning, exportable CVs with our easy-to-use
                      generator. Customize, preview, and download in seconds.
                    </p>
                    <a
                      href="/subscription/upgrade"
                      className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md transition"
                    >
                      Upgrade to Unlock CV Generator
                    </a>
                  </>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">
                      You're subscribed! Start building your professional CV
                      now.
                    </p>
                    <a
                      href="/cv"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16l4 4 4-4m-4-4v8M4 4h16v16H4V4z"
                        />
                      </svg>
                      Open CV Generator
                    </a>
                  </div>
                )}
              </SectionCard>
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
                        {new Date(exp.startDate).toLocaleDateString("en-GB")} -{" "}
                        {exp.currentlyWorking
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString("en-GB")
                          : "N/A"}
                        )
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No experience added yet.</p>
                )}
              </SectionCard>

              <SectionCard
                title="Skills"
                onEdit={() => setSkillsEditOpen(true)}
              >
                {profile?.profile?.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>Add your key skills here.</p>
                )}
              </SectionCard>

              <SectionCard
                title="Education"
                onEdit={() => setEducationEditOpen(true)}
              >
                <p>
                  {profile?.profile?.education || "No education added yet."}
                </p>
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
    </ProtectedRoute>
  );
}
