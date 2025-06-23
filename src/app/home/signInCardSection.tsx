"use client";

import Link from "next/link";

export default function SignInCardSection() {
  return (
    <section className="relative bg-[#EEE9DA] py-12 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative">
        {/* Left Card */}
        <div className="w-full md:w-1/2 z-10 md:-mr-20">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-center">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
              Find jobs faster with an account
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Save searches, apply faster, and get personalized job alerts.
            </p>

            {/* Sign in with Google */}
            <button className="bg-white border border-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition w-full flex items-center justify-center mb-4">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button>

            {/* OR separator */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-sm text-gray-500 font-medium">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Sign In Button */}
            <Link
              href="/auth/login"
              className="bg-[#6096B4] text-white font-medium px-6 py-2 rounded-lg shadow hover:bg-[#4d7a96] transition block w-full mb-4"
            >
              Sign In
            </Link>

            {/* Register Prompt */}
            <p className="text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#6096B4] font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative">
          <img
            src="/picture_home_page.jpg"
            alt="Job search illustration"
            className="w-full h-auto rounded-xl shadow object-cover"
          />
        </div>
      </div>
    </section>
  );
}
