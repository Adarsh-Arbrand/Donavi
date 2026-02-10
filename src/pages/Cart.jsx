// src/pages/Cart.jsx
import { useState } from "react";
import { FiX, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext"; // 👈 Import useCart
import { Link } from "react-router-dom"; // For navigation

export default function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    gst, // 👈 Added GST
    shipping,
    total,
    progress,
    freeShippingGoal,
  } = useCart(); // 👈 Destructure gst

  const [coupon, setCoupon] = useState(""); // For coupon input

  // If cart is empty, show a message
  if (cartItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <Link
          to="/"
          className="bg-red-500 text-white px-6 py-3 rounded text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* FREE SHIPPING BAR (INR, ₹2000 goal) */}
      <div className="border rounded-md p-6 mb-12">
        <p className="text-sm mb-3">
          Add <span className="text-red-500 font-medium">₹{Math.max(0, freeShippingGoal - subtotal).toFixed(2)}</span> to cart
          and get free shipping!
        </p>
        <div className="w-full h-2 bg-gray-100 rounded">
          <div className="h-2 bg-red-500 rounded" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* CART TABLE */}
        <div className="lg:col-span-2">
          {/* HEADER */}
          <div className="grid grid-cols-5 text-sm text-gray-400 border-b pb-4">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
          </div>

          {/* ROWS (Dynamic based on cartItems, INR) */}
          {cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-5 items-center py-6 border-b">
              {/* PRODUCT */}
              <div className="flex items-center gap-4 col-span-1">
                <button
                  onClick={() => removeFromCart(item.id)} // 👈 Remove item
                  className="text-red-500"
                >
                  <FiX />
                </button>
                <img
                  src={item.images?.[0] || "/images/placeholder.jpg"} // Use first image
                  alt={item.title}
                  className="w-16 h-20 object-cover"
                />
                <span className="text-sm font-medium">{item.title}</span>
              </div>

              {/* PRICE (INR) */}
              <div className="text-sm">₹{item.price.toFixed(2)}</div>

              {/* QUANTITY */}
              <div className="flex items-center border w-max">
                <button
                  className="px-3 py-2"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} // 👈 Decrease quantity
                >
                  <FiMinus />
                </button>
                <span className="px-4 text-sm">{item.quantity}</span>
                <button
                  className="px-3 py-2"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} // 👈 Increase quantity
                >
                  <FiPlus />
                </button>
              </div>

              {/* SUBTOTAL (INR) */}
              <div className="text-sm">₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}

          {/* COUPON */}
          <div className="flex flex-wrap gap-4 mt-8">
            <input
              type="text"
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)} // 👈 Handle coupon input
              className="border px-4 py-3 w-64 text-sm"
            />
            <button
              onClick={() => alert(`Coupon "${coupon}" applied!`)} // 👈 Basic coupon apply (expand as needed)
              className="border px-6 py-3 text-sm"
            >
              Apply coupon
            </button>

            <button
              onClick={() => alert("Cart updated!")} // 👈 Basic update (you can add logic here)
              className="ml-auto bg-red-400 text-white px-6 py-3 text-sm rounded"
            >
              Update cart
            </button>
          </div>
        </div>

        {/* CART TOTALS (INR, GST, Indian Shipping) */}
        <div className="border rounded-md p-8 h-fit">
          <h3 className="font-semibold mb-6">Cart totals</h3>

          <div className="flex justify-between text-sm border-b pb-4 mb-4">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm border-b pb-4 mb-4">
            <span>GST (18%)</span> {/* 👈 Added GST row */}
            <span>₹{gst.toFixed(2)}</span>
          </div>

          {/* SHIPPING (Indian options) */}
          <div className="text-sm border-b pb-4 mb-4">
            <p className="mb-3">Shipping</p>

            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2">
                <input type="radio" checked readOnly />
                Standard:
              </label>
              <span>₹{shipping.toFixed(2)}</span>
            </div>

            <label className="flex items-center gap-2 mb-2">
              <input type="radio" />
              Express (₹200)
            </label>

            <p className="text-xs text-gray-500">Shipping within India.</p>

            <button className="text-red-500 text-xs mt-2">Change address</button>
          </div>

          {/* TOTAL (INR) */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold">₹{total.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button className="w-full bg-red-500 text-white py-4 text-sm font-medium">
              Proceed to checkout
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}