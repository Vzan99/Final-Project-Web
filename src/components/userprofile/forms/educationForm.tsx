"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "@/types/userprofile";
import { educationSchema } from "@/schemas/profile/user/educationSchema";

type EducationFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function EducationForm({
  initialData,
  onSuccess,
  onCancel,
}: EducationFormProps) {
  const initialValues = {
    education: initialData?.profile?.education || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
      await API.put("/profile/edit/user", {
        userId: initialData?.id,
        education: values.education,
      });

      toast.success("Education updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update education: " +
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
      validationSchema={educationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label
              htmlFor="education"
              className="block font-medium text-gray-700"
            >
              Education
            </label>
            <Field
              id="education"
              name="education"
              type="text"
              placeholder="e.g. Bachelor’s Degree in Computer Science"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="education"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end gap-3">
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
