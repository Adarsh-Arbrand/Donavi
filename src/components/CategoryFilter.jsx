import React from 'react';

const categories = ["New In", "Top Trending", "Dresses", "Co-Ords", "Tops", "Bottoms"];

const CategoryFilter = ({ onSelect }) => (
  <div className="flex gap-4 justify-center my-6 flex-wrap">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className="border px-4 py-2 rounded hover:bg-gray-100 transition"
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
