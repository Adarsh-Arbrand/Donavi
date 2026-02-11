import { useState, useEffect } from "react"; 
import { useCart } from "../context/CartContext"; 
import { Link, useNavigate } from "react-router-dom"; 
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../firebase"; 
import LoginModal from "../components/LoginModal"; 
import RegisterModal from "../components/RegisterModal"; 

export default function Checkout({ user }) { 
  const { cartItems, subtotal, gst, shipping, total, clearCart } = useCart(); 
  const [payment, setPayment] = useState("cod"); 
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "India", 
    address: "",
    address2: "",
    city: "",
    state: "Delhi", 
    pin: "", 
    phone: "",
    email: "",
    notes: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false); // 👈 For success message
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 👈 Add for login modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // 👈 Add for register modal
  const [loading, setLoading] = useState(true); // 👈 Add loading state
  const navigate = useNavigate(); // 👈 For redirect after order

  // 👈 Wait for user auth state to load, with timeout fallback
  useEffect(() => {
    console.log("Checkout: user prop =", user); // 👈 Debug log for user prop
    if (user !== undefined) { // 👈 Fixed: Check for undefined
      setLoading(false);
    }
    // Fallback: If auth doesn't load in 3 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Checkout: Loading timeout, forcing stop");
    }, 3000);
    return () => clearTimeout(timer);
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle order placement with payment and Firestore save
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    // Basic validation (expand as needed)
    if (!billingDetails.firstName || !billingDetails.email) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      if (payment === "cod") {
        // Simulate COD success
        alert("Order placed successfully with Cash on Delivery!");
      } else {
        // Integrate Razorpay for other payments
        const options = {
          key: "rzp_live_SEuOQtC4rXNuWx",
          amount: total * 100, // Amount in paisa (₹1 = 100 paisa)
          currency: "INR",
          name: "DONAVI.IN",
          description: "Order Payment",
          handler: function (response) {
            // Payment success
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          },
          prefill: {
            name: billingDetails.firstName + " " + billingDetails.lastName,
            email: billingDetails.email,
            contact: billingDetails.phone,
          },
          theme: {
            color: "#dc2626", // Red theme
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      // Save order to Firestore
      const orderData = {
        userId: user.uid,
        orderId: `ORD-${Date.now()}`, // Generate unique order ID
        items: cartItems,
        subtotal,
        gst,
        shipping,
        total,
        paymentMethod: payment,
        billingDetails,
        status: "Placed", // Can update to "Shipped", etc., later
        createdAt: new Date(),
      };
      await addDoc(collection(db, "orders"), orderData);

      clearCart();
      setOrderPlaced(true);
      navigate("/profile"); // 👈 Redirect to profile to show order details
    } catch (error) {
      alert(`Order failed: ${error.message}`);
    }
  };

  // If order is placed, show success (or redirect)
  if (orderPlaced) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Thank you for your purchase. We'll send you a confirmation email soon.</p>
        <Link to="/" className="bg-red-500 text-white px-6 py-3 rounded text-sm font-medium">
          Continue Shopping
        </Link>
      </main>
    );
  }

  // If loading auth state, show loading
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Please Log In to Checkout</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to place an order.</p>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-red-500 text-white px-6 py-3 rounded text-sm font-medium"
        >
          Log In
        </button>

        {/* 🔹 Login Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />

        {/* 🔹 Register Modal */}
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* COUPON */}
      <div className="border p-4 text-sm mb-4">
        Have a coupon?{" "}
        <span className="text-red-500 cursor-pointer">Click here to enter your code</span>
      </div>

      {/* FREE SHIPPING BAR (Dynamic, INR) */}
      <div className="border p-6 mb-10">
        <p className="text-sm mb-3">
          Add <span className="text-red-500 font-medium">₹{Math.max(0, 2000 - subtotal).toFixed(2)}</span> to cart
          and get free shipping!
        </p>
        <div className="w-full h-2 bg-gray-100 rounded">
          <div className="h-2 bg-red-500 rounded" style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* BILLING DETAILS */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-6">Billing details</h2>
          <form onSubmit={handlePlaceOrder}> {/* 👈 Wrap in form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="firstName"
                value={billingDetails.firstName}
                onChange={handleInputChange}
                className="border p-3 text-sm"
                placeholder="First name *"
                required
              />
              <input
                name="lastName"
                value={billingDetails.lastName}
                onChange={handleInputChange}
                className="border p-3 text-sm"
                placeholder="Last name *"
                required
              />
            </div>

            <input
              name="company"
              value={billingDetails.company}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
              placeholder="Company name (optional)"
            />

            <select
              name="country"
              value={billingDetails.country}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
            >
              <option>India</option> {/* 👈 Only India */}
            </select>

            <input
              name="address"
              value={billingDetails.address}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
              placeholder="Street address *"
              required
            />

            <input
              name="address2"
              value={billingDetails.address2}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-3 w-full"
              placeholder="Apartment, suite, unit, etc. (optional)"
            />

            <input
              name="city"
              value={billingDetails.city}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
              placeholder="Town / City *"
              required
            />

            <select
              name="state"
              value={billingDetails.state}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
            >
              <option>Delhi</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>Tamil Nadu</option>
              <option>West Bengal</option>
              <option>Gujarat</option>
              <option>Rajasthan</option>
              <option>Uttar Pradesh</option>
              <option>Punjab</option>
              <option>Kerala</option>
              {/* Add more Indian states as needed */}
            </select>

            <input
              name="pin"
              value={billingDetails.pin}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
              placeholder="PIN Code *"
              required
            />

            <input
              name="phone"
              value={billingDetails.phone}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
              placeholder="Phone *"
              required
            />

            <input
              name="email"
              value={billingDetails.email}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full"
              placeholder="Email address *"
              type="email"
              required
            />

            <div className="flex items-center gap-2 text-sm mt-6">
              <input type="checkbox" />
              <span>Create an account?</span>
            </div>

            <div className="flex items-center gap-2 text-sm mt-3">
              <input type="checkbox" />
              <span>Ship to a different address?</span>
            </div>

            <textarea
              name="notes"
              value={billingDetails.notes}
              onChange={handleInputChange}
              className="border p-3 text-sm mt-6 w-full h-32"
              placeholder="Order notes (optional)"
            ></textarea>
          </form>
        </div>

        {/* ORDER SUMMARY (Dynamic, INR, GST) */}
        <div className="border p-8 h-fit">
          <h3 className="font-semibold mb-6">Your order</h3>

          <div className="flex justify-between text-sm border-b pb-3 mb-3">
            <span>Product</span>
            <span>Subtotal</span>
          </div>

          {/* Dynamic Cart Items */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-3">
              <span>{item.title} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between text-sm border-b pb-3 mb-3">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm border-b pb-3 mb-3">
            <span>GST (18%)</span> {/* 👈 Added GST */}
            <span>₹{gst.toFixed(2)}</span>
          </div>

          {/* SHIPPING */}
          <div className="text-sm border-b pb-4 mb-4">
            <p className="mb-3">Shipping</p>
            <label className="flex justify-between items-center mb-2">
              <span className="flex items-center gap-2">
                <input type="radio" checked readOnly />
                Standard
              </span>
              <span>₹{shipping.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2 mb-2">
              <input type="radio" />
              Express (₹200)
            </label>
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center mb-6">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold">₹{total.toFixed(2)}</span>
          </div>

          {/* PAYMENT (Indian options) */}
          <div className="text-sm mb-4">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={payment === "upi"}
                onChange={() => setPayment("upi")}
              />
              UPI
            </label>
            <label className="flex items-center gap-2 mt-3">
              <input
                type="radio"
                checked={payment === "netbanking"}
                onChange={() => setPayment("netbanking")}
              />
              Net Banking
            </label>
            <label className="flex items-center gap-2 mt-3">
              <input
                type="radio"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center gap-2 mt-3">
              <input
                type="radio"
                checked={payment === "cod"}
                onChange={() => setPayment("cod")}
              />
              Cash on Delivery
            </label>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our <span className="text-red-500">privacy policy</span>.
          </p>

          <div className="flex items-center gap-2 text-xs mb-6">
            <input type="checkbox" required />
            <span>
              I have read and agree to the website{" "}
              <span className="text-red-500">terms and conditions</span>
            </span>
          </div>

          <button
            type="submit"
            onClick={handlePlaceOrder}
            className="w-full bg-red-500 text-white py-4 text-sm font-medium"
          >
            Place order
          </button>
        </div>
      </div>
    </main>
  );
}