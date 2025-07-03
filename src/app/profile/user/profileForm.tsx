"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { profileSchema } from "@/schemas/profileSchema";
import { toast } from "react-toastify";

interface ProfileValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  about: string;
  birthDate: string;
  gender: string;
  education: string;
  skills: string;
}

const initialValues: ProfileValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  about: "",
  birthDate: "",
  gender: "",
  education: "",
  skills: "",
};

export default function ProfileForm() {
  const handleSubmit = async (values: ProfileValues) => {
    try {
      console.log("Submitted Profile:", values);
      // Replace this with actual API call
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    // Optional: Add confirmation here
    window.location.reload(); // Or close modal if inside Dialog
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Fields */}
            <div>
              <label className="block text-gray-700 font-medium">
                Full Name
              </label>
              <Field
                name="name"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Phone</label>
              <Field
                name="phone"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Location
              </label>
              <Field
                name="location"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                About Me
              </label>
              <Field
                name="about"
                as="textarea"
                rows={4}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="about"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Birth Date
              </label>
              <Field
                name="birthDate"
                type="date"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="birthDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Gender</label>
              <Field
                as="select"
                name="gender"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Education
              </label>
              <Field
                name="education"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="education"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Skills</label>
              <Field
                name="skills"
                type="text"
                placeholder="e.g., React, Node.js, PostgreSQL"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="skills"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#89A8B2] text-white px-6 py-2 rounded hover:bg-[#7a98a1] transition"
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
