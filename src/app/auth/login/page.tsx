"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/schemas/auth/loginSchema";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import LoginPageSkeleton from "@/components/loadingSkeleton/loginPageSkeleton";
import GuestRoute from "@/components/guestRoute";
import Spinner from "@/components/loadingSkeleton/spinner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh === "true") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("refresh");

      window.location.replace(newUrl.toString());
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) toast.error(`Google login failed: ${error.message}`);
  };

  if (loading) {
    return <LoginPageSkeleton />;
  }

  return (
    <GuestRoute fallback={<Spinner />}>
      <main className="flex flex-col md:flex-row justify-center items-start text-black bg-white pt-16 pb-12 px-4 md:px-8">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 pr-8">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-[#6096B4]">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Sign in to access your job seeker or company dashboard.
            </p>
            <img
              src="/icon_login.png"
              alt="Login Illustration"
              className="w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await API.post("/auth/login", values);
                toast.success("Login successful!");
                await dispatch(fetchUser());

                const lastVisited = localStorage.getItem("lastVisited");
                if (lastVisited && lastVisited !== "/auth/login") {
                  localStorage.removeItem("lastVisited");
                  router.push(lastVisited);
                } else {
                  router.push("/home");
                }
              } catch (err: any) {
                toast.error(err?.response?.data?.message || "Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {/* Inside <Formik> render function */}
            {({ isSubmitting }) => (
              <Form className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-black mb-6">
                  Login to Your Account
                </h2>

                {/* Email */}
                <div className="mb-4">
                  <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#6096B4]">
                      <Field
                        name="email"
                        type="email"
                        placeholder="Email"
                        disabled={loading}
                        className="flex-grow outline-none bg-white"
                      />
                    </div>
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div
                    className={`flex items-center border border-gray-300 rounded-lg px-3 py-2 ${
                      loading
                        ? "animate-pulse"
                        : "focus-within:ring-2 focus-within:ring-[#6096B4]"
                    }`}
                  >
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      disabled={loading}
                      className="flex-grow outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="ml-2 text-gray-500 hover:text-[#6096B4] focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                  <div className="text-right mt-1">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-[#6096B4] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full bg-[#6096B4] text-white py-2 rounded hover:bg-[#4a7b98] transition-all flex justify-center items-center ${
                    loading ? "animate-pulse cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-gray-300" />
                  <span className="mx-2 text-gray-500 text-sm">
                    or login with
                  </span>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                {/* Google Login */}
                <div className="grid grid-cols-1">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <FaGoogle className="mr-2" /> Google
                  </button>
                </div>

                {/* Footer */}
                <p className="text-sm text-center text-gray-600 mt-6">
                  Don’t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-[#6096B4] hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </GuestRoute>
  );
}
