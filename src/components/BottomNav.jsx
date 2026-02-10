import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 👈 Add for dynamic cart badge
import { signOut } from "firebase/auth"; // 👈 Add for logout
import { auth } from "../firebase"; // 👈 Add for Firebase auth
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import LoginModal from "../components/LoginModal"; // 👈 Add for login modal
import RegisterModal from "../components/RegisterModal"; // 👈 Add for register modal

const BottomNav = ({ user }) => { // 👈 Add user prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 👈 Add for login modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // 👈 Add for register modal

  const { cartItems } = useCart(); // 👈 Get cart items for dynamic badge
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0); // 👈 Calculate total quantity

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
    <>
      {/* 🔹 Bottom Navigation (Mobile only) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 z-50 lg:hidden">
        <Link to="/" className="flex flex-col items-center text-xs"> 
          <HomeIcon className="h-6 w-6 text-gray-700" /> 
          <span>Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center text-xs">
          <Squares2X2Icon className="h-6 w-6 text-gray-700" />
          <span>Shop</span>
        </Link>

        <Link to="/wishlist" className="flex flex-col items-center text-xs relative">
          <HeartIcon className="h-6 w-6 text-gray-700" />
          <span>Wishlist</span>
          <span className="absolute top-0 right-3 bg-pink-600 text-white text-xs rounded-full px-1">
            0 {/* 👈 Static for now; make dynamic later */}
          </span>
        </Link>

        <Link to="/Cart" className="flex flex-col items-center text-xs relative">
          <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
          <span>Cart</span>
          {cartItemCount > 0 && ( // 👈 Dynamic badge
            <span className="absolute top-0 right-3 bg-pink-600 text-white text-xs rounded-full px-1">
              {cartItemCount}
            </span>
          )}
        </Link>

        {user ? ( 
          <Link to="/profile" className="flex flex-col items-center text-xs">
            <UserIcon className="h-6 w-6 text-gray-700" />
            <span>Profile</span>
          </Link>
        ) : ( 
          <button
            className="flex flex-col items-center text-xs"
            onClick={() => setIsLoginOpen(true)}
          >
            <UserIcon className="h-6 w-6 text-gray-700" />
            <span>LogIn</span>
          </button>
        )}

      </div>

      {/* 🔹 Slide Menu (Updated with Categories) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-md rounded-t-lg">
            <button
              className="w-full text-center py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Close Menu
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className="block py-2 border-b hover:text-pink-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
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
    </>
  );
};

export default BottomNav;