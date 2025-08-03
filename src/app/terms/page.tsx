"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="bg-[#EEE9DA] text-[#171717] min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-[#BDCDD6]">
        <h1 className="text-3xl md:text-4xl font-bold text-[#6096B4] mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 mb-6">
          Welcome to Precise Job Board. By using our platform, you agree to the
          following terms and conditions. Please read them carefully.
        </p>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              1. User Agreement
            </h2>
            <p className="text-gray-700">
              By registering or using our site, you confirm that the information
              you provide is accurate and complete. You are responsible for all
              activity under your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              2. Privacy & Data
            </h2>
            <p className="text-gray-700">
              We are committed to protecting your privacy. Information you share
              with us is handled according to our Privacy Policy. We do not sell
              or rent your data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              3. Platform Usage
            </h2>
            <p className="text-gray-700">
              You agree not to misuse the platform by posting false jobs, spam,
              or any content that violates laws or our community guidelines.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              4. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All logos, designs, and content belong to Precise Job Board unless
              stated otherwise. Do not copy or distribute without permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              5. Account Termination
            </h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate accounts that violate
              our terms, engage in fraudulent behavior, or harm the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              6. Changes to Terms
            </h2>
            <p className="text-gray-700">
              Terms may be updated periodically. Continued use of the platform
              indicates your acceptance of those changes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              7. Contact Us
            </h2>
            <p className="text-gray-700">
              For any questions or concerns, please{" "}
              <Link href="/contact" className="text-[#6096B4] hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </section>

        <div className="mt-10 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Precise Job Board. All rights
          reserved.
        </div>
      </div>
    </main>
  );
}
