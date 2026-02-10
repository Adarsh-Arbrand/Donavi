import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // 👈 Add db import
import { collection, query, where, getDocs } from "firebase/firestore"; // 👈 Add Firestore imports

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  // Fetch orders on load
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(userOrders);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      alert(`Logout failed: ${error.message}`);
    }
  };

  const handleEditSave = () => {
    // Save profile data to Firestore (placeholder - implement as needed)
    alert("Profile updated!");
    setEditing(false);
  };

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile</h2>
        <button onClick={() => navigate("/")} className="bg-red-500 text-white px-6 py-3 rounded">
          Go to Home
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-2"><strong>User ID:</strong> {user.uid}</p>
        <p className="mb-4"><strong>Account Created:</strong> {user.metadata.creationTime}</p>

        {/* Edit Profile */}
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              className="border p-2 w-full"
            />
            <textarea
              placeholder="Address"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className="border p-2 w-full"
            />
            <button onClick={handleEditSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        )}

        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
          Logout
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-b pb-4 mb-4">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
              <details>
                <summary className="cursor-pointer text-blue-500">View Details</summary>
                <ul className="mt-2">
                  {order.items.map((item, index) => (
                    <li key={index}>{item.title} × {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}</li>
                  ))}
                </ul>
                <p><strong>Billing:</strong> {order.billingDetails.firstName} {order.billingDetails.lastName}, {order.billingDetails.address}</p>
              </details>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Profile;