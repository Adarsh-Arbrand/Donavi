import React from 'react';

const HeroBanner = () => (
  <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520962913005-63b1db2e2ee5')" }}>
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start p-10 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Limited Sale Up To 60% Off</h1>
      <p className="text-lg md:text-2xl mb-6">Discover the latest in fashion trends</p>
      <button className="bg-white text-black px-6 py-3 font-semibold rounded hover:bg-gray-200 transition">Shop Now</button>
    </div>
  </section>
);

export default HeroBanner;
