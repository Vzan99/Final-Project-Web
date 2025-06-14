"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      // Scrolling down
      setShowNavbar(false);
      setIsOpen(false); // close menu when scrolling
    } else {
      // Scrolling up
      setShowNavbar(true);
    }

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`bg-white shadow fixed top-0 left-0 w-full z-50 text-black transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / App Name */}
          <Link href="/" className="text-2xl font-bold text-[#6096B4]">
            QuickDev
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="hover:text-[#497187]">
              Home
            </Link>
            <Link href="/jobs" className="hover:text-[#497187]">
              Jobs
            </Link>
            <Link href="/companies" className="hover:text-[#497187]">
              Companies
            </Link>

            <div className="ml-4 space-x-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#497187] transition"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md z-[9998] overflow-hidden
  transition-all duration-500 ease-in-out
  px-4 space-y-2 md:hidden
  ${
    isOpen
      ? "max-h-96 opacity-100 translate-y-0 pb-4"
      : "max-h-0 opacity-0 -translate-y-2 pb-0"
  }
`}
      >
        <Link
          href="/"
          className="block hover:text-[#497187]"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/jobs"
          className="block hover:text-[#497187]"
          onClick={() => setIsOpen(false)}
        >
          Jobs
        </Link>
        <Link
          href="/companies"
          className="block hover:text-[#497187]"
          onClick={() => setIsOpen(false)}
        >
          Companies
        </Link>
        <Link
          href="/auth/login"
          className="block text-[#6096B4] border border-[#497187] rounded px-4 py-2 hover:bg-blue-100"
          onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="block bg-[#6096B4] text-white rounded px-4 py-2 hover:bg-[#497187]"
          onClick={() => setIsOpen(false)}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
