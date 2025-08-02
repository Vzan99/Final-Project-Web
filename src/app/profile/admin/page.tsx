"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

import CompanyForm from "@/components/companyprofile/companyForm";
import EditDialog from "@/components/userprofile/editDialog";
import CompanyProfileSkeleton from "@/components/loadingSkeleton/companyProfileSkeleton";
import ProtectedRoute from "@/components/protectedRoute";

export default function CompanyProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const company = user?.company;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.name || "",
    description: company?.description || "",
    location: company?.location || "",
    website: company?.website || "",
    industry: company?.industry || "",
    foundedYear: company?.foundedYear?.toString() || "",
  });
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const fileLogoRef = useRef<HTMLInputElement>(null);
  const fileBannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    setFormData({
      companyName: user?.name || "",
      description: company?.description || "",
      location: company?.location || "",
      website: company?.website || "",
      industry: company?.industry || "",
      foundedYear: company?.foundedYear?.toString() || "",
    });
  }, [user, company]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const form = new FormData();
      form.append("photo", file);
      await API.put("/profile/edit/photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchUser());
      toast.success("Logo updated!");
    } catch {
      toast.error("Failed to upload logo.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const form = new FormData();
      form.append("banner", file);
      await API.put("/profile/edit/banner", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchUser());
      toast.success("Banner updated!");
    } catch {
      toast.error("Failed to upload banner.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: typeof formData) => {
    try {
      await API.put("/profile/edit/company", {
        ...values,
        foundedYear: parseInt(values.foundedYear) || null,
      });

      toast.success("Company profile updated.");
      setIsEditOpen(false);
      dispatch(fetchUser());
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update company.");
    }
  };

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

  return (
    <ProtectedRoute
      allowedRoles={["ADMIN"]}
      fallback={<CompanyProfileSkeleton />}
    >
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
                backgroundImage: `url('${
                  getCloudinaryImageUrl(company?.bannerUrl, {
                    width: 1200,
                    height: 300,
                    crop: "fill",
                  }) || "/placeholder_banner.png"
                }')`,
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

          {/* Company Card */}
          <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start z-20">
            {/* Logo container */}
            <div className="absolute -top-20 left-0 right-0 md:left-8 md:right-auto z-30 pointer-events-none">
              <div className="relative w-32 h-32 mx-auto md:mx-0 cursor-pointer">
                <button
                  type="button"
                  onClick={() => fileLogoRef.current?.click()}
                  disabled={uploadLoading}
                  className={`rounded-md overflow-hidden w-32 h-32 border-6 border-white block cursor-pointer pointer-events-auto bg-white ${
                    uploadLoading ? "animate-pulse" : ""
                  }`}
                  aria-label="Change Company Logo"
                >
                  <div className="bg-white w-full h-full flex items-center justify-center">
                    <img
                      src={
                        getCloudinaryImageUrl(company?.logo, {
                          width: 200,
                          height: 200,
                          crop: "fill",
                        }) || "/placeholder_user.png"
                      }
                      alt="Company Logo"
                      className="object-cover w-full h-full bg-white"
                      draggable={false}
                    />
                  </div>
                </button>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  ref={fileLogoRef}
                  hidden
                />
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="ml-auto bg-[#89A8B2] text-white rounded-full p-2 hover:bg-[#7a98a1] transition self-start"
              aria-label="Edit Company Profile"
            >
              <Pencil size={18} />
            </button>

            {/* Company info */}
            <div className="flex flex-col justify-center mt-4 w-full space-y-1">
              <div className="flex items-center space-x-2 mt-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.name}
                </h1>

                {user?.isVerified ? (
                  <div className="relative group">
                    <img
                      src="/verified_true.png"
                      alt="Verified User"
                      className="w-6 h-6"
                    />
                    <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                      Verified Admin
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <img
                      src="/verified_false.png"
                      alt="Unverified"
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

              {/* Location */}
              <p className="text-sm text-gray-600">
                {company?.location || "Location not provided"}
              </p>

              {/* Website directly below location */}
              {company?.website && (
                <p className="text-sm text-gray-600">
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {company.website}
                  </a>
                </p>
              )}

              {/* Description */}
              <div className="company-description text-gray-700 text-justify break-words">
                <div
                  dangerouslySetInnerHTML={{
                    __html: company?.description || "<p>No description</p>",
                  }}
                />
              </div>

              {/* Founded Year */}
              {company?.foundedYear && (
                <p className="text-sm text-gray-600">
                  Founded Year: {company.foundedYear}
                </p>
              )}

              {/* Industry */}
              {company?.industry && (
                <p className="text-sm text-gray-600">
                  Industry: {company.industry}
                </p>
              )}
            </div>
          </div>

          {/* Edit Dialog Modal */}
          <EditDialog
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            title="Edit Company Info"
          >
            <CompanyForm
              formData={formData}
              onChange={handleChange}
              onCancel={() => setIsEditOpen(false)}
              onSubmit={handleSubmit}
              loading={uploadLoading}
            />
          </EditDialog>
        </div>
      </main>
    </ProtectedRoute>
  );
}
