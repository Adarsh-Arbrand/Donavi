import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; 
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout"; 
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin"; 

function App() {
  const [user, setUser] = useState(null); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("App: user =", currentUser); 
    });
    return unsubscribe; 
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar user={user} />
        <main className="min-h-screen">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout user={user} />} />
            <Route path="/shop/:category?" element={<Shop />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/admin" element={<Admin user={user} />} /> 
          </Routes>
        </main>
        <BottomNav user={user} /> 
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;