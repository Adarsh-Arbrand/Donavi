import React, { useState, useEffect } from 'react';

const slides = [
  { image: '/assets/images/hero1.jpg', title: 'Limited Sale Up To 60% Off', subtitle: 'Discover the latest in fashion trends' },
  { image: '/assets/images/hero2.jpg', title: 'New Arrivals', subtitle: 'Shop the latest collection' },
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start p-10 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{slide.title}</h1>
            <p className="text-lg md:text-2xl mb-4">{slide.subtitle}</p>
            <button className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition">Shop Now</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
