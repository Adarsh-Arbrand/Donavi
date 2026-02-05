import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false); // login/register modal
  const [authTab, setAuthTab] = useState("register"); // "login" or "register"

  const categories = [
    "New In",
    "Top Trending",
    "Dresses",
    "Co-Ords",
    "Tops & Shirts",
    "Shop All",
    "Moods & Edits",
    "SELFCARE",
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      {/* 🔹 Top Bar */}
      <div className="flex justify-between items-center text-xs px-6 py-1 bg-gray-50 text-gray-700">
        <Link to="/track-order" className="hover:underline">
          Track My Order
        </Link>
        <div className="flex items-center gap-3">
          <FaFacebookF className="cursor-pointer hover:text-black" />
          <FaTwitter className="cursor-pointer hover:text-black" />
          <FaInstagram className="cursor-pointer hover:text-black" />
          <FaPinterest className="cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* 🔹 Announcement Bar */}
      <div className="bg-white text-center text-sm font-medium py-2 border-b">
        Limited Sale upto{" "}
        <span className="text-red-600 font-semibold">60% Off</span>
      </div>

      {/* 🔹 Main Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 lg:py-3">
        {/* Left - Hamburger (mobile only) */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Center - Logo */}
        <Link
          to="/"
          className="text-2xl lg:text-3xl font-extrabold tracking-wide mx-auto lg:mx-0"
        >
          DONAVI.IN
        </Link>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)}>
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 hover:text-black" />
          </button>
          <button onClick={() => setIsAuthOpen(true)}>
            <UserIcon className="h-6 w-6 text-gray-700 hover:text-black" />
          </button>
          <Link to="/wishlist" className="relative">
            <HeartIcon className="h-6 w-6 text-gray-700 hover:text-black" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
              0
            </span>
          </Link>
          <Link to="/Cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-black" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
              0
            </span>
          </Link>
        </div>
      </nav>

      {/* 🔹 Desktop Categories */}
      <div className="hidden lg:flex justify-center gap-6 py-2 text-sm font-medium border-t">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:text-gray-900"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* 🔹 Mobile Menu (slide-in) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col gap-4">
            <button className="self-end" onClick={() => setIsMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-pink-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Fullscreen Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative w-11/12 max-w-2xl">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full border-b-2 border-gray-400 focus:border-black px-4 py-3 outline-none text-lg bg-transparent"
              autoFocus
            />
            <button
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-black"
              onClick={() => setIsSearchOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Login/Register Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white w-11/12 max-w-md p-6 rounded shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setIsAuthOpen(false)}
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">
              {authTab === "register" ? "Register" : "Login"}
            </h2>

            {/* Form */}
            <form className="space-y-4">
              {authTab === "register" && (
                <>
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-full border px-3 py-2 text-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-full border px-3 py-2 text-sm outline-none"
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Email *"
                className="w-full border px-3 py-2 text-sm outline-none"
              />
              <input
                type="password"
                placeholder="Password *"
                className="w-full border px-3 py-2 text-sm outline-none"
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 font-medium"
              >
                {authTab === "register" ? "Register" : "Login"}
              </button>
            </form>

            {/* Switch between login/register */}
            <div className="flex justify-between items-center mt-4 text-sm">
              {authTab === "register" ? (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthTab("login")}
                    className="underline"
                  >
                    Log in here
                  </button>
                </p>
              ) : (
                <p>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setAuthTab("register")}
                    className="underline"
                  >
                    Register here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
