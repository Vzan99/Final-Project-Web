"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import DesktopNav from "./desktopNav";
import MobileNav from "./mobileNav";
import API from "@/lib/axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowNavbar(false);
      setIsOpen(false);
    } else {
      setShowNavbar(true);
    }
    lastScrollY.current = currentScrollY;
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      dispatch(logout());
      setIsOpen(false);
      setProfileOpen(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white shadow fixed top-0 left-0 w-full z-50 text-black transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-[#6096B4]">
            QuickDev
          </Link>
          <DesktopNav
            user={user}
            loading={loading}
            onLogout={handleLogout}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
          />
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

      <div ref={menuRef}>
        <MobileNav
          user={user}
          isOpen={isOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          onLogout={handleLogout}
          onClose={handleClose}
        />
      </div>
    </nav>
  );
}
