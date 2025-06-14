"use client";

import { useState } from "react";
import API from "@/lib/axios";
import { IAuthRegister } from "@/types/auth";

export default function RegisterForm() {
  const [form, setForm] = useState<IAuthRegister>({
    name: "",
    email: "",
    password: "",
    role: "USER",
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Register as {form.role === "ADMIN" ? "Company" : "Job Seeker"}
      </h2>

      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setForm({ ...form, role: "USER" })}
          className={`px-4 py-2 rounded ${
            form.role === "USER" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => setForm({ ...form, role: "ADMIN" })}
          className={`px-4 py-2 rounded ${
            form.role === "ADMIN" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Company
        </button>
      </div>

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
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone || ""}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
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
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register as {form.role === "ADMIN" ? "Company" : "User"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
    </div>
  );
}
