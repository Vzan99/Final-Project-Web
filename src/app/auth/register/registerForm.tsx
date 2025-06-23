"use client";

import { useState } from "react";
import API from "@/lib/axios";
import { IAuthRegister } from "@/types/auth";
import { FaGoogle, FaFacebookF, FaGithub, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

export default function RegisterForm() {
  const [form, setForm] = useState<IAuthRegister>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const endpoint =
        form.role === "ADMIN" ? "/auth/register/admin" : "/auth/register/user";

      await API.post(endpoint, form);
      setSuccess("Registration successful!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md transition-all duration-300 ease-in-out text-black">
      <h2 className="text-2xl font-bold text-[#333] mb-1 text-center">
        Register as {form.role === "ADMIN" ? "Company" : "Job Seeker"}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Join Precise and start your journey today.
      </p>

      {/* Role Toggle */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          type="button"
          onClick={() => setForm({ ...form, role: "USER" })}
          className={`px-4 py-2 rounded-full border text-sm transition ${
            form.role === "USER"
              ? "bg-[#6096B4] text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Job Seeker
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, role: "ADMIN" })}
          className={`px-4 py-2 rounded-full border text-sm transition ${
            form.role === "ADMIN"
              ? "bg-[#6096B4] text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Company
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.role === "ADMIN" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded transition"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded transition"
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded transition"
        />
        <button
          type="submit"
          className="w-full bg-[#6096B4] text-white py-2 rounded hover:bg-[#4a7b98] transition-all"
        >
          Sign up
        </button>
      </form>

      {/* Error / Success */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mt-4 text-center">{success}</p>}

      {/* Divider and Social Register - only for Job Seeker */}
      {form.role === "USER" && (
        <>
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or sign up with</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="grid grid-cols-1">
            <button className="flex items-center justify-center border border-gray-300 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition">
              <FaGoogle className="mr-2" /> Google
            </button>
          </div>
        </>
      )}

      {/* Sign in redirect */}
      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#6096B4] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
