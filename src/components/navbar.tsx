"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/authSlice";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      localStorage.clear();
      dispatch(logout());
      setIsOpen(false);
      setProfileOpen(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // mobile menu close
      if (isOpen && menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
      // profile dropdown close
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    };

    if (isOpen || profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, profileOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showNavbar && profileOpen) setProfileOpen(false);
  }, [showNavbar, profileOpen]);

  const handleProtectedNavigation = (url: string) => {
    if (!user) {
      localStorage.setItem(
        "lastVisited",
        window.location.pathname + window.location.search
      );
      router.push("/auth/login");
    } else {
      router.push(url);
    }
    // Close menus
    setIsOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav
      className={`bg-white shadow fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-[#6096B4]">
            Precise
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-[#497187]">
              Home
            </Link>
            <Link href="/jobs" className="hover:text-[#497187]">
              Jobs
            </Link>
            <Link href="/companies" className="hover:text-[#497187]">
              Companies
            </Link>

            {loading ? (
              <div className="ml-4 w-24 h-9 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition flex items-center gap-1"
                >
                  {user.role === "USER" && "Profile"}
                  {user.role === "ADMIN" && "Admin"}
                  {user.role === "DEVELOPER" && "Developer"}
                  {profileOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50 p-1 transition-opacity duration-200 ${
                    profileOpen ? "block" : "hidden"
                  }`}
                >
                  {user.role === "USER" && (
                    <>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/profile/user")
                        }
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/jobs/saved")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Saved Jobs
                      </button>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/jobs/applied")
                        }
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Applied Jobs
                      </button>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/subscription")
                        }
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Subscription
                      </button>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/assessments")
                        }
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Skill Assessments
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/settings")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Settings
                      </button>
                    </>
                  )}
                  {user.role === "ADMIN" && (
                    <>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/profile/admin")
                        }
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/dashboard")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/settings")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Settings
                      </button>
                    </>
                  )}
                  {user.role === "DEVELOPER" && (
                    <button
                      onClick={() => handleProtectedNavigation("/developer")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="ml-4 space-x-2">
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "lastVisited",
                      window.location.pathname + window.location.search
                    );
                    router.push("/auth/login");
                  }}
                  className="px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/auth/register");
                  }}
                  className="px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#497187] transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white border-t shadow-sm px-4 pt-2 pb-4 space-y-2"
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

          {user ? (
            <>
              <div ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="w-full text-left px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition flex items-center justify-between"
                >
                  <span>
                    {user.role === "USER" && "Profile"}
                    {user.role === "ADMIN" && "Admin"}
                    {user.role === "DEVELOPER" && "Developer"}
                  </span>
                  {profileOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                <div
                  className={`${
                    profileOpen ? "block" : "hidden"
                  } mt-2 pl-4 border-l space-y-1`}
                >
                  {user.role === "USER" && (
                    <>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/profile/user")
                        }
                        className="block text-sm hover:text-[#497187]"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/jobs/saved")}
                        className="block text-sm hover:text-[#497187]"
                      >
                        Saved Jobs
                      </button>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/jobs/applied")
                        }
                        className="block text-sm hover:text-[#497187]"
                      >
                        Applied Jobs
                      </button>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/subscription")
                        }
                        className="block text-sm hover:text-[#497187]"
                      >
                        Subscription
                      </button>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/assessments")
                        }
                        className="block text-sm hover:text-[#497187]"
                      >
                        Skill Assessments
                      </button>

                      <button
                        onClick={() => handleProtectedNavigation("/settings")}
                        className="block text-sm hover:text-[#497187]"
                      >
                        Settings
                      </button>
                    </>
                  )}
                  {user.role === "ADMIN" && (
                    <>
                      <button
                        onClick={() =>
                          handleProtectedNavigation("/profile/admin")
                        }
                        className="block text-sm hover:text-[#497187]"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/dashboard")}
                        className="block text-sm hover:text-[#497187]"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleProtectedNavigation("/settings")}
                        className="block text-sm hover:text-[#497187]"
                      >
                        Settings
                      </button>
                    </>
                  )}
                  {user.role === "DEVELOPER" && (
                    <button
                      onClick={() => handleProtectedNavigation("/developer")}
                      className="block text-sm hover:text-[#497187]"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-left text-sm text-red-600 hover:text-red-700 w-full"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "lastVisited",
                    window.location.pathname + window.location.search
                  );
                  setIsOpen(false);
                  router.push("/auth/login");
                }}
                className="block w-full px-4 py-2 border border-[#6096B4] rounded text-[#6096B4] hover:bg-blue-100 transition text-left"
              >
                Login
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/auth/register");
                }}
                className="block w-full px-4 py-2 bg-[#6096B4] text-white rounded hover:bg-[#497187] transition text-left"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
