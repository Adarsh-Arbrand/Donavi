import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; // 👈 Add this import
import { auth } from "./firebase"; // 👈 Add this import
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout"; // 👈 Ensure this is imported
import Shop from "./pages/Shop";
import Profile from "./pages/Profile"
import OrderSuccess from "./pages/OrderSuccess"
function App() {
  const [user, setUser] = useState(null); // 👈 Add state for current user

  useEffect(() => {
    // 👈 Listen for auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user if logged in, null if logged out
      console.log("App: user =", currentUser); // 👈 Debug log
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar user={user} /> {/* 👈 Pass user to Navbar */}
        <main className="min-h-screen">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout user={user} />} />
            <Route path="/shop/:category?" element={<Shop />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </main>
        <BottomNav user={user} /> {/* 👈 Pass user to BottomNav */}
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;