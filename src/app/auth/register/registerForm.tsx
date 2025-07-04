"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import API from "@/lib/axios";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/schemas/auth/registerSchema";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) toast.error(`Google login failed: ${error.message}`);
    } catch {
      toast.error("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md transition-all duration-300 ease-in-out text-black">
      <h2 className="text-2xl font-bold text-[#333] mb-1 text-center">
        Register as {role === "ADMIN" ? "Company" : "Job Seeker"}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Join Precise and start your journey today.
      </p>

      {/* Role Toggle */}
      <div className="flex justify-center mb-4 space-x-4">
        {["USER", "ADMIN"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r as "USER" | "ADMIN")}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              role === r
                ? "bg-[#6096B4] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            disabled={loading}
          >
            {r === "USER" ? "Job Seeker" : "Company"}
          </button>
        ))}
      </div>

      <Formik
        initialValues={{
          name: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        enableReinitialize
        validationSchema={registerSchema(role)}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const endpoint =
              role === "ADMIN" ? "/auth/register/admin" : "/auth/register/user";

            await API.post(endpoint, { ...values, role });

            toast.success(
              "Registration successful! A link has been sent to your email to verify your email"
            );

            setTimeout(() => {
              router.push("/auth/login");
            }, 1500);
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Registration failed.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Admin only fields */}
            {role === "ADMIN" && (
              <>
                {/* Company Name */}
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4] transition disabled:opacity-50">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Company Name"
                    disabled={loading}
                    className="flex-grow outline-none bg-white"
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-sm text-red-600"
                />

                {/* Phone */}
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4] transition disabled:opacity-50">
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    disabled={loading}
                    className="flex-grow outline-none bg-white"
                  />
                </div>
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="text-sm text-red-600"
                />
              </>
            )}

            {/* Email */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4] transition disabled:opacity-50">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                disabled={loading}
                className="flex-grow outline-none bg-white"
              />
            </div>
            <ErrorMessage
              name="email"
              component="p"
              className="text-sm text-red-600"
            />

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4] transition disabled:opacity-50">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                disabled={loading}
                className="flex-grow outline-none bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-[#6096B4]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="p"
              className="text-sm text-red-600"
            />

            {/* Confirm Password */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4] transition disabled:opacity-50">
              <Field
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                disabled={loading}
                className="flex-grow outline-none bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 text-gray-500 hover:text-[#6096B4]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="p"
              className="text-sm text-red-600"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`w-full bg-[#6096B4] text-white py-2 rounded hover:bg-[#4a7b98] transition-all flex justify-center items-center ${
                loading ? "animate-pulse cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Divider and Google */}
      {role === "USER" && (
        <>
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or sign up with</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <div className="grid grid-cols-1">
            <button
              disabled={loading}
              onClick={handleGoogleRegister}
              className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <FaGoogle className="mr-2" /> Google
            </button>
          </div>
        </>
      )}

      {/* Redirect to login */}
      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#6096B4] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
