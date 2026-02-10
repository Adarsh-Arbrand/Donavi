import { useState, useEffect } from "react"; // 👈 Add useEffect
import { FiHeart, FiEye, FiRepeat, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function RelatedProductCard({ product }) {
  // 👈 Add state for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 👈 Add effect for automatic image change (every 3 seconds)
  useEffect(() => {
    if (product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [product.images]);

  // Get the current image (fallback to first if array is empty)
  const currentImage = product.images?.[currentImageIndex] || product.images?.[0] || "/images/placeholder.jpg";

  return (
    <Link to={`/product/${product.id}`} className="group block">
      {/* IMAGE WRAPPER */}
      <div className="relative bg-[#f7f7f7] rounded-md overflow-hidden">
        {/* DISCOUNT BADGE */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-white text-green-600 text-xs font-medium px-2 py-1 rounded z-10">
            {product.discount}%
          </span>
        )}

        {/* IMAGE */}
        <img
          src={currentImage} // 👈 Use the current image from the slideshow
          alt={product.title}
          className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* HOVER ICONS */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
          <button className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-black hover:text-white transition">
            <FiHeart />
          </button>

          <button className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-black hover:text-white transition">
            <FiEye />
          </button>

          <button className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-black hover:text-white transition">
            <FiRepeat />
          </button>

          <button className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-black hover:text-white transition">
            <FiShoppingBag />
          </button>
        </div>

        {/* OPTIONAL: Image Indicators (Dots) */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-yellow-400">★</span>
          <span>1 review</span>
        </div>

        <h4 className="text-sm font-medium leading-snug line-clamp-2">
          {product.title}
        </h4>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="line-through text-gray-400">
            ${product.oldPrice.toFixed(2)}
          </span>
          <span className="font-semibold">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}