"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { resetPasswordSchema } from "@/schemas/auth/resetPassword";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [token, router]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f0e8] px-4">
      <div className="max-w-md w-full bg-white shadow-md p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#333]">
          Reset Your Password
        </h2>

        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={resetPasswordSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await API.post("/auth/reset-password", {
                token,
                newPassword: values.newPassword,
              });

              toast.success("Password reset successfully!");
              router.push("/auth/login");
            } catch (err: any) {
              const msg =
                err.response?.data?.message || "Failed to reset password.";
              toast.error(msg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  New Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#89a8b2]">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    className="flex-grow outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="ml-2 text-gray-500 hover:text-[#89a8b2]"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="p"
                  className="text-sm text-red-600"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#89a8b2]">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    className="flex-grow outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-gray-500 hover:text-[#89a8b2]"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-sm text-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#89a8b2] text-white py-2 px-4 rounded-md hover:bg-[#73909a] transition duration-200"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
