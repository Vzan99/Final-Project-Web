"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changeEmailSchema } from "@/schemas/settings/change-email";
import ConfirmModal from "@/components/confirmModal";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ChangeEmailForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState<{
    newEmail: string;
    password: string;
  } | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);

  return (
    <>
      <Formik
        initialValues={{ newEmail: "", password: "" }}
        validationSchema={changeEmailSchema(currentUser?.email || "")}
        onSubmit={async (values, { setSubmitting }) => {
          setFormValues(values);
          setShowModal(true);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 px-4 py-3">
            <div>
              <label
                htmlFor="newEmail"
                className="block mb-1 font-medium text-gray-700"
              >
                New Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4]">
                <Field
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  placeholder="Enter new email"
                  className="flex-grow outline-none bg-white"
                />
              </div>
              <ErrorMessage
                name="newEmail"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700"
              >
                Current Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4]">
                <Field
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter current password"
                  className="flex-grow outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-[#6096B4]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="p"
                className="text-sm text-red-600"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#6096B4] text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Confirm Modal */}
      <ConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          if (!formValues) return;
          try {
            const response = await API.put("/profile/change-email", formValues);
            toast.success(response.data.message || "Verification email sent.");
          } catch (err: any) {
            toast.error(
              err.response?.data?.message || "Failed to change email."
            );
          } finally {
            setShowModal(false);
          }
        }}
        message="Are you sure you want to change your email?"
      />
    </>
  );
}
