import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, addDoc } from "firebase/firestore";
import {
  UserIcon,
  ShoppingBagIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  HeartIcon,
  CogIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });
  const [returnModal, setReturnModal] = useState({ open: false, order: null });
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null });
  const [cancelReason, setCancelReason] = useState("");
  const [returnData, setReturnData] = useState({
    selectedItems: [],
    action: "return",
    reason: "",
    comments: "",
  });
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(notifications => notifications.filter(n => n.id !== id));
    }, 3000);
  };

  // Fetch orders and profile data on load
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(userOrders);

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            address: data.address || "",
            phone: data.phone || "",
          });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        addNotification(`Logout failed: ${error.message}`, "error");
      }
    }
  };

  const handleEditSave = async () => {
    if (!profileData.firstName || !profileData.lastName) {
      addNotification("First and last name are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, profileData, { merge: true });
      addNotification("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      addNotification(`Failed to update profile: ${error.message}`, "error");
    }
    setSaving(false);
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      addNotification("Please provide a reason for cancellation.", "error");
      return;
    }
    try {
      const orderDocRef = doc(db, "orders", cancelModal.orderId);
      await updateDoc(orderDocRef, { status: "Cancelled", cancelReason });
      setOrders(orders.map(order =>
        order.id === cancelModal.orderId ? { ...order, status: "Cancelled", cancelReason } : order
      ));
      addNotification("Order cancelled successfully.");
      setCancelModal({ open: false, orderId: null });
      setCancelReason("");
    } catch (error) {
      addNotification(`Failed to cancel order: ${error.message}`, "error");
    }
  };

  // Open return modal
  const openReturnModal = (order) => {
    setReturnModal({ open: true, order });
    setReturnData({ selectedItems: [], action: "return", reason: "", comments: "" });
  };

  // Handle return/replacement submission
  const handleReturnSubmit = async () => {
    if (returnData.selectedItems.length === 0) {
      addNotification("Please select at least one item.", "error");
      return;
    }
    if (!returnData.reason) {
      addNotification("Please select a reason.", "error");
      return;
    }
    try {
      const returnRequest = {
        orderId: returnModal.order.id,
        userId: user.uid,
        items: returnData.selectedItems,
        action: returnData.action,
        reason: returnData.reason,
        comments: returnData.comments,
        status: "Requested",
        createdAt: new Date(),
      };
      await addDoc(collection(db, "returns"), returnRequest);
      await updateDoc(doc(db, "orders", returnModal.order.id), { status: "Return Requested" });
      setOrders(orders.map(order =>
        order.id === returnModal.order.id ? { ...order, status: "Return Requested" } : order
      ));
      addNotification("Return/replacement request submitted successfully.");
      setReturnModal({ open: false, order: null });
    } catch (error) {
      addNotification(`Failed to submit request: ${error.message}`, "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Return Requested": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Please log in to view your profile</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors duration-200"
        >
          Go to Home
        </button>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </main>
    );
  }

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

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profileData.firstName || user.email.split("@")[0]}!</h1>
              <p className="text-gray-600">Manage your account and orders</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-8">
          {[
            { id: "profile", label: "Profile", icon: UserIcon },
            { id: "orders", label: "Orders", icon: ShoppingBagIcon },
            { id: "activity", label: "Activity", icon: HeartIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <UserIcon className="h-6 w-6" />
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Created</p>
                <p className="font-medium">{new Date(user.metadata.creationTime).toLocaleDateString()}</p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="border p-3 rounded focus:border-red-500 transition-colors"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="border p-3 rounded focus:border-red-500 transition-colors"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="border p-3 rounded w-full focus:border-red-500 transition-colors"
                />
                <textarea
                  placeholder="Address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="border p-3 rounded w-full focus:border-red-500 transition-colors"
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    disabled={saving}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckIcon className="h-5 w-5" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="font-medium">{profileData.firstName || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="font-medium">{profileData.lastName || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{profileData.phone || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{profileData.address || "Not set"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-2 ml-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBagIcon className="h-6 w-6" />
              Order History
            </h2>
            {orders.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No orders yet. Start shopping!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium">Order #{order.orderId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-red-500 mb-4">Total: ₹{order.total.toFixed(2)}</p>
                  <details className="mb-4">
                    <summary className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors">
                      View Details
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item.title} × {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm mt-2">
                      <strong>Billing:</strong> {order.billingDetails.firstName} {order.billingDetails.lastName}, {order.billingDetails.address}
                    </p>
                  </details>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2">
                      <TruckIcon className="h-5 w-5" />
                      Track Order
                    </button>
                    {(order.status === "Placed" || order.status === "Shipped") && (
                      <button
                        onClick={() => setCancelModal({ open: true, orderId: order.id })}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        Cancel Order
                      </button>
                    )}
                    {order.status === "Delivered" && (
                      <button
                        onClick={() => openReturnModal(order)}
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        <ArrowUturnLeftIcon className="h-5 w-5" />
                        Return/Replace
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <HeartIcon className="h-6 w-6" />
              Recent Activity
            </h2>
            <p className="text-gray-600 mb-4">Quick links to your favorites:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/wishlist")}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                                <HeartIcon className="h-6 w-6 text-red-500" />
                Wishlist
              </button>
              <button
                onClick={() => navigate("/Cart")}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ShoppingBagIcon className="h-6 w-6 text-red-500" />
                Cart
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <CogIcon className="h-6 w-6 text-red-500" />
                Browse Shop
              </button>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
              <p className="mb-4 text-gray-600">Please provide a reason for cancellation:</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="border p-3 w-full rounded focus:border-red-500 transition-colors"
                rows="3"
                placeholder="Enter reason..."
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCancelOrder}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => setCancelModal({ open: false, orderId: null })}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return/Replacement Modal */}
        {returnModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Request Return or Replacement</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Items</label>
                {returnModal.order.items.map((item, index) => (
                  <label key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={returnData.selectedItems.some(selected => selected.title === item.title)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReturnData({ ...returnData, selectedItems: [...returnData.selectedItems, item] });
                        } else {
                          setReturnData({ ...returnData, selectedItems: returnData.selectedItems.filter(i => i.title !== item.title) });
                        }
                      }}
                    />
                    {item.title} × {item.quantity}
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Action</label>
                <select
                  value={returnData.action}
                  onChange={(e) => setReturnData({ ...returnData, action: e.target.value })}
                  className="border p-2 w-full"
                >
                  <option value="return">Return for Refund</option>
                  <option value="replace">Replace Item</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Reason</label>
                <select
                  value={returnData.reason}
                  onChange={(e) => setReturnData({ ...returnData, reason: e.target.value })}
                  className="border p-2 w-full"
                >
                  <option value="">Select Reason</option>
                  <option value="defective">Defective</option>
                  <option value="wrong-size">Wrong Size</option>
                  <option value="not-as-described">Not as Described</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                <textarea
                  value={returnData.comments}
                  onChange={(e) => setReturnData({ ...returnData, comments: e.target.value })}
                  className="border p-2 w-full"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReturnSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setReturnModal({ open: false, order: null })}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Profile;