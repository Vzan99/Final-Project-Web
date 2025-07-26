"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { skillsSchema } from "@/schemas/profile/user/skillsSchema";
import { UserProfileData } from "@/types/userprofile";

type SkillsFormProps = {
  initialData: UserProfileData | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function SkillsForm({
  initialData,
  onSuccess,
  onCancel,
}: SkillsFormProps) {
  const initialSkills = initialData?.profile?.skills?.join(", ") || "";

  const handleSubmit = async (values: { skills: string }) => {
    try {
      await API.put("/profile/edit/user", {
        userId: initialData?.id,
        skills: values.skills.split(",").map((s) => s.trim()),
      });
      toast.success("Skills updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to update skills: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Formik
      initialValues={{ skills: initialSkills }}
      validationSchema={skillsSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label htmlFor="skills" className="block font-medium text-gray-700">
              Skills (comma separated)
            </label>
            <Field
              id="skills"
              name="skills"
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="e.g. JavaScript, React, Node.js"
            />
            <ErrorMessage
              name="skills"
              component="div"
              className="text-red-500 text-sm mt-1"
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
