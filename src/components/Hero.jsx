import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

const slides = [
  "/images/banner-slide-1.png",
  "/images/banner-slide-2.jpeg",
  "/images/banner-slide-3.jpeg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setIndex((index - 1 + slides.length) % slides.length);
  const next = () =>
    setIndex((index + 1) % slides.length);

  const nextIndex = (i) => (i + 1) % slides.length;

  return (
    <section className="m-2 flex items-center">
      <div className="max-w-[1400px] w-full mx-auto bg-[#f5f5f5] rounded-[32px] p-8">

        {/* GRID: DESKTOP FIRST LOGIC */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.5fr_0.6fr] gap-8 items-center">

          {/* 1️⃣ TEXT (LEFT ON DESKTOP, BOTTOM ON MOBILE) */}
          <div className="order-2 lg:order-1">
            <p className="text-[11px] tracking-[0.35em] text-pink-500 mb-4">
              Perfect for Summer Evenings
            </p>

            <h1 className="text-[32px] lg:text-[46px] leading-tight font-extrabold mb-5">
              Casual and Stylish <br /> for All Seasons
            </h1>

            <p className="text-sm mb-6">
              Starting From{" "}
              <span className="text-red-500 font-semibold text-lg">$129</span>
            </p>

            <button className="inline-flex items-center gap-3 border border-black rounded-full px-6 py-3 text-sm font-medium hover:bg-black hover:text-white transition">
              SHOP NOW <FiArrowRight />
            </button>
          </div>

          {/* 2️⃣ MAIN IMAGE (CENTER ON DESKTOP, TOP ON MOBILE) */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative bg-white rounded-[28px] overflow-hidden h-[320px] sm:h-[380px] lg:h-[520px]">
              <img
                key={index}
                src={slides[index]}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover animate-fadeSlide"
              />

              {/* MOBILE ARROWS */}
              <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-white rounded-full shadow px-5 py-2 z-10">
                <button onClick={prev}>
                  <FiChevronLeft />
                </button>
                <button onClick={next}>
                  <FiChevronRight />
                </button>
              </div>

              {/* DESKTOP ARROWS */}
              <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow flex-col overflow-hidden z-10">
                <button onClick={prev} className="p-3 hover:bg-gray-100">
                  <FiChevronUp />
                </button>
                <button onClick={next} className="p-3 hover:bg-gray-100">
                  <FiChevronDown />
                </button>
              </div>
            </div>
          </div>

          {/* 3️⃣ PREVIEW IMAGES (RIGHT, DESKTOP ONLY) */}
          <div className="hidden lg:flex flex-col gap-6 order-3">
            <div className="bg-white rounded-[24px] overflow-hidden h-[240px]">
              <img
                src={slides[nextIndex(index)]}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white rounded-[24px] overflow-hidden h-[240px]">
              <img
                src={slides[nextIndex(nextIndex(index))]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
