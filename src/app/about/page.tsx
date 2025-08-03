"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex flex-col md:flex-row justify-center items-start text-black bg-white pt-16 pb-12 px-4 md:px-8">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 pr-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-[#6096B4]">
            About Precise Job Board
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Your trusted platform connecting talented job seekers with
            opportunity-rich companies across Australia and beyond.
          </p>
          <img
            src="/about_photo.jpg"
            alt="About Illustration"
            className="w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-4">Who We Are</h2>
        <p className="text-gray-700 mb-4">
          Precise Job Board is a modern recruitment platform designed to
          streamline the hiring process for both employers and job seekers.
          Built with a focus on speed, usability, and smart matching, we bring
          precision to the hiring journey.
        </p>

        <h2 className="text-2xl font-bold text-black mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
          <li>Verified job postings and user accounts</li>
          <li>Role-based dashboards for users and companies</li>
          <li>Smart matching algorithm for faster applications</li>
          <li>Skill assessments and certification tracking</li>
          <li>Integrated interview scheduling and job tracking</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mb-4">Why Choose Us</h2>
        <p className="text-gray-700 mb-4">
          We believe in transparent hiring, fair opportunities, and efficient
          user experiences. Whether you're a first-time job seeker or a
          recruiting manager, Precise provides the tools you need to succeed.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block bg-[#6096B4] text-white py-2 px-4 rounded hover:bg-[#4a7b98] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
