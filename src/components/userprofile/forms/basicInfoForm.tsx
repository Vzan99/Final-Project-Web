"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import { UserProfileData } from "@/types/userprofile";

import { basicInfoSchema } from "@/schemas/profile/user/basicInfoSchema";

type BasicInfoFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BasicInfoForm({
  initialData,
  onSuccess,
  onCancel,
}: BasicInfoFormProps) {
  const initialValues = {
    gender: initialData?.profile?.gender || "",
    birthDate: initialData?.profile?.birthDate
      ? initialData.profile.birthDate.slice(0, 10)
      : "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);

    try {
      const payload = {
        userId: initialData?.id,
        gender: values.gender,
        birthDate: values.birthDate,
      };

      await API.put("/profile/edit/user", payload);

      toast.success("Basic info updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update basic info: " +
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
      validationSchema={basicInfoSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block font-medium text-gray-700">
              Gender
            </label>
            <Field
              as="select"
              id="gender"
              name="gender"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Field>
            <ErrorMessage
              name="gender"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label
              htmlFor="birthDate"
              className="block font-medium text-gray-700"
            >
              Birth Date
            </label>
            <Field
              type="date"
              id="birthDate"
              name="birthDate"
              className="mt-1 block w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              max={new Date().toISOString().slice(0, 10)}
            />
            <ErrorMessage
              name="birthDate"
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
