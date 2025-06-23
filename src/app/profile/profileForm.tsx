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
}

const initialValues: ProfileValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  about: "",
};

export default function ProfileForm() {
  const handleSubmit = async (values: ProfileValues) => {
    try {
      console.log("Submitted Profile:", values);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">
                Full Name
              </label>
              <Field
                name="name"
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
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
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
              />
              <ErrorMessage
                name="about"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
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
