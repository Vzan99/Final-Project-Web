"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePasswordSchema } from "@/schemas/settings/change-password";
import ConfirmModal from "@/components/confirmModal";

export default function ChangePasswordForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const formikSubmitRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={changePasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await API.put("/profile/change-password", {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            });
            toast.success("Password changed successfully.");
          } catch (err: any) {
            toast.error(
              err.response?.data?.message || "Failed to change password."
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, submitForm }) => {
          formikSubmitRef.current = submitForm;

          return (
            <Form className="space-y-4 px-4 py-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Current Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4]">
                  <Field
                    type={showOldPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="flex-grow outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="ml-2 text-gray-500 hover:text-[#6096B4]"
                    tabIndex={-1}
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="currentPassword"
                  component="p"
                  className="text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  New Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4]">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    className="flex-grow outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="ml-2 text-gray-500 hover:text-[#6096B4]"
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

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4]">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    className="flex-grow outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2 text-gray-500 hover:text-[#6096B4]"
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

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-[#6096B4] text-white px-4 py-2 rounded"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Confirm Modal */}
      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (formikSubmitRef.current) formikSubmitRef.current();
          setIsConfirmOpen(false);
        }}
        message="Are you sure you want to update your password?"
      />
    </>
  );
}
