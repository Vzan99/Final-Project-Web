"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "@/types/userprofile";
import { contactSchema } from "@/schemas/profile/user/contactSchema";

type ContactFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ContactForm({
  initialData,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const initialValues = {
    phone: initialData?.phone || "",
    email: initialData?.email || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
      const payload = {
        userId: initialData?.id,
        phone: values.phone,
      };

      await API.put("/profile/edit/user", payload);

      toast.success("Contact info updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update contact info: " +
          (error?.response?.data?.message || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={contactSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Email (non-editable) */}
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email (cannot be changed here)
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              disabled
              className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              aria-disabled="true"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block font-medium text-gray-700">
              Phone
            </label>
            <Field
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter phone number"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#89A8B2] text-white hover:bg-[#7a98a1]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
