import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiHeart,
} from "react-icons/fi";
import RelatedProductCard from "../components/RelatedProductCard";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const { addToCart } = useCart();

  if (!product) {
    return (
      <main className="bg-white">
        <section className="bg-[#fff3f3] rounded-[30px] mx-6 mt-6 py-14 text-center">
          <h1 className="text-2xl font-semibold">Product Not Found</h1>
          <p className="text-sm mt-2 text-gray-500">The product you're looking for doesn't exist.</p>
        </section>
      </main>
    );
  }

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0] || "S");

  // 👈 Add state for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 👈 Optional: Auto-cycle images every 3 seconds (remove if you don't want this)
  useEffect(() => {
    if (product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [product.images]);

  // 👈 Get related products (exclude current, show up to 4)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  // 👈 Helper functions for arrows
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % product.images.length
    );
  };

  return (
    <main className="bg-white">
      {/* ===== BREADCRUMB / HEADER ===== */}
      <section className="bg-[#fff3f3] rounded-[30px] mx-6 mt-6 py-14 text-center">
        <h1 className="text-2xl font-semibold">Shop Details</h1>
        <p className="text-sm mt-2 text-gray-500">
          Home &nbsp;›&nbsp; Shop &nbsp;›&nbsp; Shop Details
        </p>
      </section>

      {/* ===== PRODUCT MAIN ===== */}
      <section className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* IMAGE GALLERY */}
        <div className="relative bg-[#f7f7f7] rounded-[24px] p-8">
          {/* MAIN IMAGE */}
          <img
            src={product.images?.[currentImageIndex] || product.images?.[0] || "/images/placeholder.jpg"} // 👈 Use current image
            alt={product.title}
            className="w-full object-contain rounded-xl"
          />

          {/* SLIDER ARROWS (only show if multiple images) */}
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={goToPreviousImage} // 👈 Functional left arrow
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gray-100"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={goToNextImage} // 👈 Functional right arrow
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gray-100"
              >
                <FiChevronRight />
              </button>
            </>
          )}

          {/* THUMBNAILS (below main image, only show if multiple images) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.title} ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)} // 👈 Click to change image
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${index === currentImageIndex ? "border-red-500" : "border-gray-300"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div>
          {/* RATING */}
          <div className="flex items-center gap-2 text-[13px] text-orange-400">
            ★★★★★
            <span className="text-gray-500">({product.reviews?.length || 0} Customer Reviews)</span>
          </div>

          {/* PRICE */}
          <h2 className="text-2xl font-semibold mt-3 text-red-500">
            {product.price}
          </h2>

          {/* TITLE */}
          <h3 className="font-semibold mt-2">
            {product.title}
          </h3>

          {/* SHORT DESC */}
          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            {product.shortDescription}
          </p>

          <hr className="my-10" />

          {/* SIZE */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium w-16">Size</span>
            {product.sizes?.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`border px-3 py-1 rounded text-xs
                  ${size === s
                    ? "bg-red-500 text-white border-red-500"
                    : "border-gray-300"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* COLOR */}
          <div className="flex items-center gap-4 text-sm mt-5">
            <span className="font-medium w-16">Color</span>
            <div className="flex gap-3">
              {product.colors?.map((color) => (
                <span
                  key={color}
                  className={`w-3 h-3 rounded-full bg-${color}-500`}
                ></span>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mt-8">
            <span className="font-medium w-16 text-sm">Quantity</span>
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2"
              >
                <FiMinus />
              </button>
              <span className="px-5 text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-10 items-center">
            <button
              onClick={() => {
                console.log("Adding to cart:", product, qty); // 👈 Debug: Check if called
                addToCart(product, qty);
                console.log("Cart updated"); // 👈 Debug: Check if function runs
              }}
              className="bg-gradient-to-r from-[#ff5f6d] to-[#ffc371] text-white px-10 py-3 rounded-full font-medium text-sm"
            >
              ADD TO CART
            </button>

            <button className="border px-7 py-3 rounded-full flex items-center gap-2 text-sm">
              <FiHeart /> ADD TO WISHLIST
            </button>

            {/* SOCIAL ICON PLACEHOLDER */}
            <div className="flex gap-4 text-gray-500 text-sm ml-2">
              <span>f</span>
              <span>t</span>
              <span>in</span>
              <span>⦿</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESCRIPTION ===== */}
      <section className="max-w-6xl mx-auto px-6 mt-20">
        <h3 className="font-semibold text-lg mb-6">Item Description</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {product.description}
        </p>
      </section>

      <hr className="my-20" />

      {/* ===== REVIEWS ===== */}
      <section className="max-w-6xl mx-auto px-6">
        <h3 className="font-semibold text-lg mb-10">{product.reviews?.length || 0} Reviews</h3>

        {product.reviews?.map((review, index) => (
          <div key={index} className="flex gap-6 mb-10">
            <img
              src="/images/user.jpg"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{review.name}</h4>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
                <div className="text-orange-400 text-sm">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-3">{review.comment}</p>

              <button className="mt-3 text-xs bg-red-500 text-white px-4 py-1 rounded-full">
                Reply
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ===== RELATED PRODUCTS ===== */}
      <section className="max-w-6xl mx-auto px-6 mt-20 mb-24">
        <h3 className="font-semibold text-lg mb-6">Related Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>

      {/* ===== WRITE REVIEW ===== */}
      <section className="max-w-6xl mx-auto px-6 mt-20 mb-24">
        <h3 className="font-semibold text-lg mb-2">Write A Review</h3>
        <p className="text-sm text-gray-500 mb-6">
          Your email address will not be published.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="border p-4 rounded text-sm"
            placeholder="Your Name"
          />
          <input
            className="border p-4 rounded text-sm"
            placeholder="Your Email"
          />
        </div>

        <textarea
          className="border p-4 rounded w-full mt-6 h-44 text-sm"
          placeholder="Your Review"
        ></textarea>

        <button className="mt-8 bg-gradient-to-r from-[#ff5f6d] to-[#ffc371] text-white px-10 py-3 rounded-full text-sm font-medium">
          POST REVIEW →
        </button>
      </section>
    </main>
  );
}