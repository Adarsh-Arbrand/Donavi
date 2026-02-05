// src/components/ProductModal.jsx
import React from 'react';

const ProductModal = ({ product, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-3xl rounded shadow-lg overflow-hidden">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 font-bold">✕</button>
      <div className="flex flex-col md:flex-row">
        <img src={product.images[0]} alt={product.title} className="w-full md:w-1/2 h-96 object-cover" />
        <div className="p-6 flex-1">
          <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-4">₹{product.price}</p>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProductModal;
