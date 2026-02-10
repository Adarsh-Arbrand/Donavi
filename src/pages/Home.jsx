import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // For add to cart
import { products } from "../data/products"; // Import products
import Hero from "../components/Hero.jsx"; // Your existing Hero component

const Home = () => {
  const { addToCart } = useCart();

  // Filter products for sections
  const newArrivals = products.filter((product) => product.category === "New In").slice(0, 4); // Top 4 new products
  const bestSellers = products
    .filter((product) => product.reviews.some((review) => review.rating >= 4)) // High-rated products
    .slice(0, 4); // Top 4

  // Categories for showcase
  const categories = [
    { name: "Dresses", image: "/images/banner-slide-1.jpeg", link: "/shop/dresses" },
    { name: "Tops & Shirts", image: "/images/banner-slide-2.jpeg", link: "/shop/tops-shirts" },
    { name: "Co-Ords", image: "/images/banner-slide-3.jpeg", link: "/shop/co-ords" },
    { name: "New In", image: "/images/banner-slide-1.jpeg", link: "/shop/new-in" },
  ];

  return (
    <main className="bg-gray-50">
      {/* 🔹 Hero Section */}
      <Hero />

      {/* 🔹 Categories Showcase */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} to={cat.link} className="group">
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 New Arrivals */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">New Arrivals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0] || "/images/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-sm mb-2 hover:text-red-500">{product.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-red-500 font-semibold">₹{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="line-through text-gray-400">₹{product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full bg-red-500 text-white py-2 text-sm rounded hover:bg-red-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/shop/new-in" className="bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition">
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 Best Sellers */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0] || "/images/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-sm mb-2 hover:text-red-500">{product.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-red-500 font-semibold">₹{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="line-through text-gray-400">₹{product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full bg-red-500 text-white py-2 text-sm rounded hover:bg-red-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/shop" className="bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition">
              Shop All
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 Promotions/Banners */}
      <section className="py-16 px-6 bg-red-500 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
          <p className="text-lg mb-6">Get up to 60% off on all girls' clothing. Plus, enjoy GST-inclusive pricing for hassle-free shopping in India.</p>
          <Link to="/shop" className="bg-white text-red-500 px-8 py-4 rounded font-semibold hover:bg-gray-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* 🔹 Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-sm mb-4">"Amazing quality and fast delivery! My daughter loves her new dresses."</p>
              <p className="font-semibold">- Priya S., Mumbai</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-sm mb-4">"Great prices and easy checkout. Will shop again!"</p>
              <p className="font-semibold">- Anjali R., Delhi</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <p className="text-sm mb-4">"Perfect for Indian festivals. Highly recommend DONAVI.IN."</p>
              <p className="font-semibold">- Kavita M., Bangalore</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;