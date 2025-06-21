"use client";

import { useState } from "react";
import API from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebookF, FaGithub, FaXTwitter } from "react-icons/fa6";
import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchUser } from "@/lib/redux/features/authSlice";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      toast.success("Login successful!");

      await dispatch(fetchUser());

      router.push("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row justify-center items-start text-black bg-white pt-16 pb-12 px-4 md:px-8">
      {/* Left Section (Desktop only) */}
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

      {/* Right Section (Login Card) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Login to Your Account
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6096B4] focus:border-[#6096B4]"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6096B4] focus:border-[#6096B4]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-[#6096B4] focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6096B4] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#4d7a96] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or login with</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition">
              <FaFacebookF className="mr-2" /> Facebook
            </button>
            <button className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition">
              <FaXTwitter className="mr-2" /> X
            </button>
            <button className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition">
              <FaGithub className="mr-2" /> GitHub
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
        </form>
      </div>
    </main>
  );
}
