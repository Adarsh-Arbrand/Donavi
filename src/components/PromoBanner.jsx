import React from 'react';

const PromoBanner = ({ image, title, subtitle }) => (
  <div className="relative h-64 md:h-80 my-6 bg-cover bg-center rounded" style={{ backgroundImage: `url(${image})` }}>
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
      <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
      <p className="text-lg md:text-2xl">{subtitle}</p>
    </div>
  </div>
);

export default PromoBanner;
