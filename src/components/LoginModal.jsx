import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]); // For toast notifications

  // Add notification function
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(notifications => notifications.filter(n => n.id !== id));
    }, 3000); // Auto-dismiss after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addNotification("Please fill in all fields.", "error");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addNotification("Login successful!");
      onClose(); // Close modal on success
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error); // For debugging
      let message = "Login failed. Please try again.";
      if (error.code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (error.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/user-disabled") {
        message = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Try again later.";
      }
      addNotification(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
              notif.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

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
    </>
  );
};

export default LoginModal;