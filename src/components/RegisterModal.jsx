import React from "react";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6">Register</h2>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="First name"
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />
          <input
            type="text"
            placeholder="Last name"
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />
          <input
            type="email"
            placeholder="Email *"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />
          <input
            type="password"
            placeholder="Password *"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />

          {/* Footer (button + link side by side) */}
          <div className="flex items-center justify-between mt-6 border-t pt-4">
            <button
              type="submit"
              className="bg-black text-white w-1/2 py-3 rounded font-medium hover:bg-gray-800"
            >
              Register
            </button>
            <p
              className="text-sm text-gray-700 w-1/2 text-center cursor-pointer hover:text-black"
              onClick={onSwitchToLogin}
            >
              Already have an account? <span className="font-medium underline">Log in here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
