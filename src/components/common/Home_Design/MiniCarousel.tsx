import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "The Future Of",
    subtitle: "Innovation",
    description: "The next generation of technology awaits",
    buttonText: "Read more",
    image:
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200",
    color: "from-emerald-600 to-emerald-800",
  },
  {
    id: 2,
    title: "World Tunnel",
    subtitle: "Congress 2026",
    description: "We Welcome You All To Montreal",
    buttonText: "More info",
    image:
      "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
    color: "from-slate-600 to-slate-800",
  },
  {
    id: 3,
    title: "Global Summit",
    subtitle: "2026",
    description: "Join us for the event of the year",
    buttonText: "Learn more",
    image:
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200",
    color: "from-blue-600 to-blue-800",
  },
];

export default function MiniSmallCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-[350px] h-[130px] rounded-xl overflow-hidden shadow-md">
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <React.Fragment key={i}>
            <img
              key={i}
              src={slide.image}
              alt={slide.title}
              className={cn(
                `absolute inset-0 w-full h-full object-cover transition-opacity duration-500`,
                i === index ? "opacity-100" : "opacity-0"
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 left-0 inset-0 bg-black/50 text-white text-xs px-2 py-0.5 rounded",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="relative h-full flex items-center">
                <div className="flex-1 px-4 sm:px-6">
                  <h2 className="text-white text-xl sm:text-lg font-bold mb-2 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <h3 className="text-white text-lg sm:text-sm font-bold mb-2 drop-shadow-lg">
                    {slide.subtitle}
                  </h3>
                  <p className="text-white text-base sm:text-xs mb-2 drop-shadow-md">
                    {slide.description}
                  </p>
                  <button className="px-1 sm:px-2 py-1 sm:py-1 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-1 right-1 flex gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 w-1.5 rounded-full transition-all 
              ${i === index ? "bg-white" : "bg-white/50"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
