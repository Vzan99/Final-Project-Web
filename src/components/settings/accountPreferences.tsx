import Image from "next/image";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { useState } from "react";

type AccountPreferencesProps = {
  currentUser: { isVerified?: boolean } | null;
};

export default function AccountPreferences({
  currentUser,
}: AccountPreferencesProps) {
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await API.post("/auth/resend-verification");
      toast.success("Verification email sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  // Initial loading pulse until currentUser is loaded
  if (currentUser === null) {
    return (
      <div className="p-6 animate-pulse space-y-4 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
        <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 p-6">
      {currentUser?.isVerified ? (
        <>
          <Image
            src="/verified_true.png"
            alt="Verified"
            width={64}
            height={64}
            className="mx-auto"
          />
          <p className="text-green-600 font-bold text-lg">
            You are already verified
          </p>
        </>
      ) : (
        <>
          <Image
            src="/verified_false.png"
            alt="Not Verified"
            width={64}
            height={64}
            className="mx-auto"
          />
          <h2 className="text-lg font-semibold text-[#497187]">
            Show authenticity to boost trust
          </h2>
          <p className="text-red-600 font-semibold">You are not verified</p>
          <div className="flex justify-center">
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className={`bg-[#6096B4] hover:bg-[#497187] text-white px-6 py-2 rounded flex items-center justify-center ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {loading ? "Sending..." : "Get Verified"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
