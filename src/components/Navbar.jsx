import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for search navigation
import { useCart } from "../context/CartContext"; // 👈 Add this import
import { signOut } from "firebase/auth"; // 👈 Add this import for logout
import { auth } from "../firebase"; // 👈 Add this import for Firebase auth
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
import LoginModal from "../components/LoginModal"; // 👈 Add import for LoginModal
import RegisterModal from "../components/RegisterModal"; // 👈 Add import for RegisterModal

const Navbar = ({ user }) => { // 👈 Add user prop
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 👈 New state for login modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // 👈 New state for register modal
  const [searchTerm, setSearchTerm] = useState(""); // 👈 Added for functional search

  const { cartItems } = useCart(); // 👈 Get cart items
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0); // 👈 Calculate total quantity
  const navigate = useNavigate(); // 👈 For navigation on search

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

  // 👈 Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`); // Navigate to Shop with search param
    }
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  // 👈 Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      alert(`Logout failed: ${error.message}`);
    }
  };

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

        {/* Right - Icons (Hidden on Mobile to Avoid Duplication with BottomNav) */}
        <div className="hidden lg:flex items-center gap-2 lg:gap-4 flex-wrap"> {/* 👈 Hidden on mobile (lg:flex) */}
          <button onClick={() => setIsSearchOpen(true)}>
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 hover:text-black" />
          </button>
          
          {user ? ( 
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <UserIcon className="h-6 w-6 text-gray-700 hover:text-black" />
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
                Logout
              </button>
            </div>
          ) : ( 
            <button onClick={() => setIsLoginOpen(true)}>
              <UserIcon className="h-6 w-6 text-gray-700 hover:text-black" />
            </button>
          )}
          <Link to="/wishlist" className="relative">
            <HeartIcon className="h-6 w-6 text-gray-700 hover:text-black" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
              0 {/* 👈 Wishlist badge (static for now, can make dynamic later) */}
            </span>
          </Link>
          <Link to="/Cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-black" />
            {cartItemCount > 0 && ( // 👈 Only show badge if items exist
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
                {cartItemCount}
              </span>
            )}
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

      {/* 🔹 Fullscreen Search Modal (Now Functional) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative w-11/12 max-w-2xl">
            <form onSubmit={handleSearchSubmit}> {/* 👈 Added form with submit handler */}
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-b-2 border-gray-400 focus:border-black px-4 py-3 outline-none text-lg bg-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-black"
              >
                🔍 {/* Changed to search icon, or keep ✕ if preferred */}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      {/* 🔹 Register Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
};

export default Navbar;