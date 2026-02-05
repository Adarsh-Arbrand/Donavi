import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav"; // 👈 Import BottomNav
import Home from "./pages/Home";
import Cart from "./pages/Cart";


function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cart" element={<Cart />} />
        </Routes>
      </main>
      
      {/* 👇 Bottom Nav for mobile */}
      <BottomNav />

      <Footer />
    </Router>
  );
}

export default App;
