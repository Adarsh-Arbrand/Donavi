import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
      <p className="text-gray-500 mb-6">Your order has been placed. You'll receive a confirmation email soon.</p>
      <Link to="/" className="bg-red-500 text-white px-6 py-3 rounded">
        Continue Shopping
      </Link>
    </main>
  );
};

export default OrderSuccess;