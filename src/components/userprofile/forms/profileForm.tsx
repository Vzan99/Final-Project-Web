"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "@/types/userprofile";
import { profileSchema } from "@/schemas/profile/user/profileSchema";

type ProfileFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ProfileForm({
  initialData,
  onSuccess,
  onCancel,
}: ProfileFormProps) {
  const initialValues = {
    name: initialData?.name || "",
    address: initialData?.profile?.address || "",
    about: initialData?.profile?.about || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
      await API.put("/profile/edit/user", {
        userId: initialData?.id,
        name: values.name,
        address: values.address,
        about: values.about,
      });

      toast.success("Profile updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update profile: " +
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
      validationSchema={profileSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700">
              Name
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700"
            >
              Address
            </label>
            <Field
              id="address"
              name="address"
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block font-medium text-gray-700">
              About Me
            </label>
            <Field
              id="about"
              name="about"
              as="textarea"
              rows={4}
              placeholder="Write a short bio about yourself"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="about"
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
