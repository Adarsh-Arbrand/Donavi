import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import {
  UserIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Admin = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, type: "", data: null });
  const [editData, setEditData] = useState({ status: "" });
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(notifications => notifications.filter(n => n.id !== id));
    }, 3000);
  };

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().isAdmin) {
          setIsAdmin(true);
          fetchData();
        } else {
          addNotification("Access denied. Admin privileges required.", "error");
          navigate("/");
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    };
    checkAdmin();
  }, [user, navigate]);

  // Fetch orders and users
  const fetchData = async () => {
    try {
      // Fetch all orders
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);

      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      addNotification(`Failed to fetch data: ${error.message}`, "error");
    }
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!editData.status) {
      addNotification("Please select a status.", "error");
      return;
    }
    try {
      const docRef = doc(db, "orders", editModal.data.id);
      await updateDoc(docRef, { status: editData.status });
      setOrders(orders.map(order =>
        order.id === editModal.data.id ? { ...order, status: editData.status } : order
      ));
      addNotification("Order status updated successfully.");
      setEditModal({ open: false, type: "", data: null });
      setEditData({ status: "" });
    } catch (error) {
      addNotification(`Failed to update status: ${error.message}`, "error");
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

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-4">You do not have admin privileges.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors duration-200"
        >
          Go to Home
        </button>
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor orders, users, and site analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-8">
          {[
            { id: "orders", label: "Orders", icon: ShoppingBagIcon },
            { id: "users", label: "Users", icon: UserIcon },
            { id: "analytics", label: "Analytics", icon: ChartBarIcon },
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
        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{order.orderId}</td>
                      <td className="p-2">{order.billingDetails?.firstName} {order.billingDetails?.lastName}</td>
                      <td className="p-2">₹{order.total.toFixed(2)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-2">{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</td>
                      <td className="p-2">
                        <button
                          onClick={() => setEditModal({ open: true, type: "order", data: order })}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Orders</th>
                    <th className="text-left p-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => {
                    const userOrders = orders.filter(order => order.userId === userData.id);
                    return (
                      <tr key={userData.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{userData.firstName} {userData.lastName}</td>
                        <td className="p-2">{userData.email || "N/A"}</td>
                        <td className="p-2">{userData.phone || "N/A"}</td>
                        <td className="p-2">{userOrders.length}</td>
                        <td className="p-2">{userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Site Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Total Orders</h3>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Total Users</h3>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Total Revenue</h3>
                <p className="text-2xl font-bold">₹{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.open && editModal.type === "order" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="border p-2 w-full mb-4"
              >
                <option value="">Select Status</option>
                <option value="Placed">Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditModal({ open: false, type: "", data: null })}
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

export default Admin;