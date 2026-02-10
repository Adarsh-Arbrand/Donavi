import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      onClose(); // Close modal on success
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

        <h2 className="text-2xl font-semibold mb-6">Log in</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />
          <input
            type="password"
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />

          <a
            href="#"
            className="text-sm text-gray-600 hover:underline block"
          >
            Forgot your password?
          </a>

          {/* Footer (button + link side by side) */}
          <div className="flex items-center justify-between mt-6 border-t pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white w-1/2 py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            <p
              className="text-sm text-gray-700 w-1/2 text-center cursor-pointer hover:text-black"
              onClick={onSwitchToRegister}
            >
              New customer? <span className="font-medium underline">Create your account</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;