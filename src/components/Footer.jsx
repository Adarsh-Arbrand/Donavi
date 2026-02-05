import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 text-sm border-t">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* 🔹 Logo & Brand Info */}
        <div>
          <h2 className="text-4xl font-extrabold mb-4">DONAVI</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Donavi is a fast fashion brand, endeavor to create and bring
            high-end fashion, latest runway trends, thoughtful & acceptable
            designs to the world.
          </p>
          <p className="mb-1">Address: Million Trades</p>
          <p className="mb-1">A-207, Ground Floor, Sec-69,</p>
          <p className="mb-1">Noida, Uttar Pradesh, India</p>
          <p className="mb-1">
            Email: <span className="font-semibold">info[@]donavi.in</span>
          </p>
          <p className="mb-4">
            Phone: <span className="font-semibold">+91-9999-233-555</span>
          </p>
          <Link
            to="/track-order"
            className="font-semibold border-b-2 border-black pb-0.5"
          >
            Track Your Order ↗
          </Link>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6 text-lg">
            <FaFacebookF className="cursor-pointer hover:text-black" />
            <FaTwitter className="cursor-pointer hover:text-black" />
            <FaInstagram className="cursor-pointer hover:text-black" />
            <FaPinterest className="cursor-pointer hover:text-black" />
          </div>
        </div>

        {/* 🔹 Self Care */}
        <div>
          <h3 className="font-semibold text-base mb-4">Self Care</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/track-order">Track Your Order</Link></li>
            <li><Link to="/exchange-order">Exchange My Order</Link></li>
            <li><Link to="/return-policy">Return, Exchange & Refund Policy</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* 🔹 Important Information */}
        <div>
          <h3 className="font-semibold text-base mb-4">Important Information</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        {/* 🔹 Newsletter Signup */}
        <div>
          <h3 className="font-semibold text-base mb-4">Sign Up for Email</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Sign up to get first dibs on new arrivals, sales,
            exclusive content, events and more!
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 border px-3 py-2 outline-none text-sm"
            />
            <button className="bg-black text-white px-4 font-semibold">
              Subscribe
            </button>
          </div>
          {/* Currency Selector */}
          <div className="mt-6">
            <select className="border px-3 py-2 text-sm">
              <option value="INR">🇮🇳 INR</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 Bottom Bar */}
      <div className="border-t px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>©2025 Donavi. All rights reserved.</p>

        {/* Payment Logos  */}
        <div className="flex gap-3 mt-3 md:mt-0">
          <img src="/assets/payments/visa.svg" alt="Visa" className="h-6 w-auto" />
          <img src="/assets/payments/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
          <img src="/assets/payments/gpay.svg" alt="Google Pay" className="h-6 w-auto" />
          <img src="/assets/payments/amazonpay.svg" alt="Amazon Pay" className="h-6 w-auto" />
          <img src="/assets/payments/upi.svg" alt="UPI" className="h-6 w-auto" />
        </div>
      </div>

      {/* 🔹 Developer Section */}
      <div className="border-t px-6 py-3 text-center text-xs text-gray-500 bg-gray-50">
        Developed with ❤️ by{" "}
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="font-semibold hover:underline"
        >
          Adarsh Ar
        </a>
      </div>
    </footer>
  );
};

export default Footer;
