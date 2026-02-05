// src/components/ProductCard.jsx
import React, { useState } from 'react';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="group relative border rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
        <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold">{product.title}</h3>
          <p className="text-gray-700 mt-1">₹{product.price}</p>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => setOpen(true)} className="bg-white p-2 rounded shadow hover:bg-gray-100">
            Quick View
          </button>
        </div>
      </div>
      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ProductCard;
