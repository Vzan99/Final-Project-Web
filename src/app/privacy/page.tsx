"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#EEE9DA] text-[#171717] min-h-screen py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-[#BDCDD6]">
        <h1 className="text-3xl md:text-4xl font-bold text-[#6096B4] mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-6">
          At Precise Job Board, your privacy is important to us. This Privacy
          Policy outlines how we collect, use, store, and protect your personal
          information.
        </p>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              1. Information We Collect
            </h2>
            <p className="text-gray-700">
              We collect personal information such as your name, email, resume,
              work history, and other relevant data when you register or apply
              for jobs on our platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700">We use your data to:</p>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>Match you with relevant job opportunities</li>
              <li>Communicate important updates or requests</li>
              <li>Verify identity and eligibility</li>
              <li>Improve our platform and services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              3. Data Sharing
            </h2>
            <p className="text-gray-700">
              We do not sell your personal information. Your data may be shared
              only with verified employers or service providers necessary for
              platform functionality, and only with your consent or as legally
              required.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              4. Cookies & Tracking
            </h2>
            <p className="text-gray-700">
              We use cookies to improve your experience, remember your
              preferences, and analyze usage patterns. You can manage cookie
              settings in your browser.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              5. Data Security
            </h2>
            <p className="text-gray-700">
              We implement strict security measures to protect your data from
              unauthorized access, loss, or misuse.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              6. Your Rights
            </h2>
            <p className="text-gray-700">
              You may request to access, correct, or delete your personal data
              at any time. We respect your right to privacy and will handle all
              such requests promptly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              7. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We encourage
              you to review this page periodically. Continued use of the
              platform indicates your agreement to the latest terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#6096B4]">
              8. Contact Us
            </h2>
            <p className="text-gray-700">
              If you have questions about your privacy, please{" "}
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
