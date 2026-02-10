// src/pages/Shop.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products"; // Import products
import { useCart } from "../context/CartContext"; // For add to cart
import { FiHeart, FiShoppingBag } from "react-icons/fi";

export default function Shop() {
  const { category } = useParams(); // Get category from URL (e.g., "New-In")
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "Shop All");

  // Categories from Navbar
  const categories = [
    "Shop All",
    "New In",
    "Top Trending",
    "Dresses",
    "Co-Ords",
    "Tops & Shirts",
    "Moods & Edits",
    "SELFCARE",
  ];

  // Filter products on category or search change
  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "Shop All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{selectedCategory}</h1>
        <p className="text-gray-600">Discover the latest trends and styles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR (Filters) */}
        <div className="lg:col-span-1">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border px-4 py-2 text-sm"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded ${
                      selectedCategory === cat ? "bg-red-500 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="group border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                  {/* IMAGE */}
                  <div className="relative bg-gray-100">
                    <img
                      src={product.images?.[0] || "/images/placeholder.jpg"}
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition"
                    />
                    {/* DISCOUNT BADGE */}
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                    {/* HOVER ICONS */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button className="bg-white p-2 rounded-full shadow">
                        <FiHeart className="text-gray-700" />
                      </button>
                      <button className="bg-white p-2 rounded-full shadow">
                        <FiShoppingBag className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-sm mb-2 hover:text-red-500">{product.title}</h3>
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-red-500 font-semibold">₹{product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="line-through text-gray-400">₹{product.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product, 1)} // Add 1 quantity
                      className="mt-3 w-full bg-red-500 text-white py-2 text-sm rounded hover:bg-red-600 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}