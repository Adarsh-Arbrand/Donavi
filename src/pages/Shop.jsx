// src/pages/Shop.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { products } from "../data/products"; // Import products
import { useCart } from "../context/CartContext"; // For add to cart
import { FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";

export default function Shop() {
  const { category } = useParams(); // Get category slug from URL (e.g., "new-in")
  const navigate = useNavigate(); // For navigation
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Shop All"); // Default to "Shop All"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Categories with slugs for URL navigation
  const categories = [
    { name: "Shop All", slug: "" }, // Special case: /shop
    { name: "New In", slug: "new-in" },
    { name: "Top Trending", slug: "top-trending" },
    { name: "Dresses", slug: "dresses" },
    { name: "Co-Ords", slug: "co-ords" },
    { name: "Tops & Shirts", slug: "tops-shirts" },
    { name: "Moods & Edits", slug: "moods-edits" },
    { name: "SELFCARE", slug: "selfcare" },
  ];

  // Map slug to display name
  const categoryMap = categories.reduce((map, cat) => {
    map[cat.slug] = cat.name;
    return map;
  }, {});

  // Set selectedCategory from URL param on mount/change
  useEffect(() => {
    const displayName = categoryMap[category] || "Shop All"; // Default if slug not found
    setSelectedCategory(displayName);
  }, [category]);

  // Filter products on category or search change with loading
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
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
      setIsLoading(false);
    }, 300);
  }, [selectedCategory, searchTerm]);

  // Close sidebar on mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  // Handle category selection: Navigate to URL
  const handleCategorySelect = (cat) => {
    const targetSlug = categories.find((c) => c.name === cat)?.slug || "";
    navigate(targetSlug ? `/shop/${targetSlug}` : "/shop"); // Navigate to /shop for "Shop All"
    closeSidebar();
  };

  // ESC key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{selectedCategory}</h1>
        <p className="text-gray-600">Discover the latest trends and styles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR (Filters) - Collapsible on Mobile */}
        <div className={`lg:col-span-1 lg:block ${isSidebarOpen ? 'block' : 'hidden'} lg:relative fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg p-5 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0`}>
          {/* Close Button for Mobile */}
          <button
            className="lg:hidden self-end mb-4 hover:scale-110 transition-transform duration-200"
            onClick={closeSidebar}
            aria-label="Close filters"
          >
            <FiX className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border px-4 py-2 text-sm focus:border-red-500 transition-colors duration-200"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-all duration-200 ${
                      selectedCategory === cat.name
                        ? "bg-red-500 text-white"
                        : "hover:bg-gray-100 hover:text-red-500"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Backdrop for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={closeSidebar}
          />
        )}

        {/* PRODUCT GRID */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Toggle Button */}
          <button
            className="lg:hidden mb-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open filters"
          >
            <FiMenu className="h-5 w-5" />
            Filters
          </button>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group border rounded-lg overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* IMAGE */}
                    <div className="relative bg-gray-100 overflow-hidden">
                      <img
                        src={product.images?.[0] || "/images/placeholder.jpg"}
                        alt={product.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* DISCOUNT BADGE */}
                      {product.discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded animate-pulse">
                          {product.discount}% OFF
                        </span>
                      )}
                      {/* HOVER ICONS */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform duration-200">
                          <FiHeart className="text-gray-700 hover:text-red-500" />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform duration-200">
                          <FiShoppingBag className="text-gray-700 hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-sm mb-2 hover:text-red-500 transition-colors duration-200">{product.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-500 font-semibold">₹{product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                          <span className="line-through text-gray-400">₹{product.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="mt-3 w-full bg-red-500 text-white py-2 text-sm rounded hover:bg-red-600 hover:scale-105 transition-all duration-200"
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
          )}
        </div>
      </div>

      {/* Custom CSS for Fade-in Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}