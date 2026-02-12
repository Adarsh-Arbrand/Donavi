import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
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
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

const Navbar = ({ user }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  // Close mobile menu on backdrop click or ESC
  const closeMenu = () => setIsMenuOpen(false);
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow">
        {/* Top Bar */}
        <div className="flex justify-between items-center text-xs px-6 py-1 bg-gray-50 text-gray-700 transition-all duration-300">
          <Link to="/track-order" className="hover:underline hover:text-red-500 transition-colors duration-200">
            Track My Order
          </Link>
          <div className="flex items-center gap-3">
            <FaFacebookF className="cursor-pointer hover:text-red-500 hover:scale-110 transition-all duration-200" />
            <FaTwitter className="cursor-pointer hover:text-red-500 hover:scale-110 transition-all duration-200" />
            <FaInstagram className="cursor-pointer hover:text-red-500 hover:scale-110 transition-all duration-200" />
            <FaPinterest className="cursor-pointer hover:text-red-500 hover:scale-110 transition-all duration-200" />
          </div>
        </div>

        {/* Announcement Bar with Fade-in Animation */}
        <div className="bg-white text-center text-sm font-medium py-2 border-b animate-fade-in">
          Limited Sale upto{" "}
          <span className="text-red-600 font-semibold">60% Off</span>
        </div>

        {/* Main Navbar */}
        <nav className="flex justify-between items-center px-6 py-4 lg:py-3">
          {/* Hamburger (Mobile) */}
          <button
            className="lg:hidden hover:scale-110 transition-transform duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl lg:text-3xl font-extrabold tracking-wide mx-auto lg:mx-0 hover:text-red-500 transition-colors duration-200"
          >
            DONAVI.IN
          </Link>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-4 flex-wrap">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:scale-110 transition-transform duration-200"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors duration-200" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="hover:scale-110 transition-transform duration-200">
                  <UserIcon className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors duration-200" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline hover:text-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hover:scale-110 transition-transform duration-200"
                aria-label="Login"
              >
                <UserIcon className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors duration-200" />
              </button>
            )}
            <Link to="/wishlist" className="relative hover:scale-110 transition-transform duration-200">
              <HeartIcon className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors duration-200" />
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
                0
              </span>
            </Link>
            <Link to="/Cart" className="relative hover:scale-110 transition-transform duration-200">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-red-500 transition-colors duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Desktop Categories */}
        <div className="hidden lg:flex justify-center gap-6 py-2 text-sm font-medium border-t">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-red-500 hover:underline transition-all duration-200"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Mobile Menu (Slide-in from Right with Backdrop) */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={closeMenu}
          >
            <div
              className="absolute top-0 right-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col gap-4 transform translate-x-0 transition-transform duration-300"
              onClick={(e) => e.stopPropagation()} // Prevent close on menu click
            >
              <button className="self-end hover:scale-110 transition-transform duration-200" onClick={closeMenu}>
                <XMarkIcon className="h-6 w-6" />
              </button>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-red-500 transition-colors duration-200"
                  onClick={closeMenu}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Search Modal with Fade/Scale Animation */}
        {isSearchOpen && (
          <div
            className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 opacity-0 scale-95 animate-fade-in"
            style={{ animation: "fadeInScale 0.3s ease-out forwards" }}
          >
            <div className="relative w-11/12 max-w-2xl">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-b-2 border-gray-400 focus:border-red-500 px-4 py-3 outline-none text-lg bg-transparent transition-colors duration-200"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-500 hover:scale-110 transition-all duration-200"
                  aria-label="Submit search"
                >
                  🔍
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Login/Register Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 flex justify-around items-center py-2">
        <Link to="/Cart" className="flex flex-col items-center hover:scale-110 transition-transform duration-200">
          <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-red-500" />
          {cartItemCount > 0 && (
            <span className="bg-pink-600 text-white text-xs rounded-full px-1 mt-1">
              {cartItemCount}
            </span>
          )}
        </Link>
        <Link to="/wishlist" className="flex flex-col items-center hover:scale-110 transition-transform duration-200">
          <HeartIcon className="h-6 w-6 text-gray-700 hover:text-red-500" />
          <span className="bg-pink-600 text-white text-xs rounded-full px-1 mt-1">0</span>
        </Link>
        {user ? (
          <Link to="/profile" className="flex flex-col items-center hover:scale-110 transition-transform duration-200">
            <UserIcon className="h-6 w-6 text-gray-700 hover:text-red-500" />
          </Link>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex flex-col items-center hover:scale-110 transition-transform duration-200"
          >
            <UserIcon className="h-6 w-6 text-gray-700 hover:text-red-500" />
          </button>
        )}
      </div>

      {/* Custom CSS for Fade-in Animation (Add to your global CSS if needed) */}
      <style jsx>{`
        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;