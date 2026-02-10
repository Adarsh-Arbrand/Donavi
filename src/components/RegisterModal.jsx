import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
      onClose(); // Close modal on success
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
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

        <h2 className="text-2xl font-semibold mb-6">Register</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-black"
          />
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

          {/* Footer (button + link side by side) */}
          <div className="flex items-center justify-between mt-6 border-t pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white w-1/2 py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
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