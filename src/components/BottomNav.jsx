import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const BottomNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* 🔹 Bottom Navigation (Mobile only) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 z-50 lg:hidden">
        <Link to="/shop" className="flex flex-col items-center text-xs">
          <Squares2X2Icon className="h-6 w-6 text-gray-700" />
          <span>Shop</span>
        </Link>

        <Link to="/wishlist" className="flex flex-col items-center text-xs relative">
          <HeartIcon className="h-6 w-6 text-gray-700" />
          <span>Wishlist</span>
          <span className="absolute top-0 right-3 bg-pink-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </Link>

        <Link to="/cart" className="flex flex-col items-center text-xs relative">
          <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
          <span>Cart</span>
          <span className="absolute top-0 right-3 bg-pink-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </Link>

        <button className="flex flex-col items-center text-xs">
          <UserIcon className="h-6 w-6 text-gray-700" />
          <span>LogIn</span>
        </button>

        <button
          className="flex flex-col items-center text-xs"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Bars3Icon className="h-6 w-6 text-gray-700" />
          <span>Menu</span>
        </button>
      </div>

      {/* 🔹 Example Slide Menu (toggle when clicking Menu) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-md rounded-t-lg">
            <button
              className="w-full text-center py-2 border-b"
              onClick={() => setIsMenuOpen(false)}
            >
              Close Menu
            </button>
            <Link
              to="/new-in"
              className="block py-2 border-b hover:text-pink-600"
              onClick={() => setIsMenuOpen(false)}
            >
              New In
            </Link>
            <Link
              to="/dresses"
              className="block py-2 border-b hover:text-pink-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Dresses
            </Link>
            <Link
              to="/selfcare"
              className="block py-2 hover:text-pink-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Self Care
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
