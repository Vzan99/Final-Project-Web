"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { forgotPasswordSchema } from "@/schemas/auth/forgotPassword";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import ForgotPasswordSkeleton from "@/components/loadingSkeleton/forgotPasswordSkeleton";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (initializing) return <ForgotPasswordSkeleton />;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1f0e8] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#333]">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            try {
              await API.post("/auth/request-password-reset", values);
              toast.success("Reset email sent. Please check your inbox.");
              router.push("/auth/login");
            } catch (err: any) {
              const msg =
                err.response?.data?.message || "Failed to send reset email.";
              toast.error(msg);
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#89a8b2]"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full bg-[#89a8b2] text-white py-2 px-4 rounded-md hover:bg-[#73909a] transition duration-200 ${
                  loading ? "animate-pulse" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
