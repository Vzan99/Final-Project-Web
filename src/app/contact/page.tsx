"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate sending message or API call here
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row justify-center items-start text-black bg-white pt-16 pb-12 px-4 md:px-8">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 pr-8">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-[#6096B4]">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Have questions, suggestions, or partnership ideas? We’d love to hear
            from you.
          </p>
          <img
            src="/contact_photo.jpg"
            alt="Contact Illustration"
            className="w-full"
          />
        </div>
      </div>

      {/* Right Section - Contact Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6096B4] outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6096B4] outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-[#6096B4] outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#6096B4] text-white py-2 rounded hover:bg-[#4a7b98] transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </main>
  );
}
