import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

export default function MiniSmallCarousel({slides}:{slides: News[]}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const Title = (e: string[], last?: number) => {
    const mid = Math.ceil(e.length / 2);
    if (!last) {
      const firstHalf = e.slice(0, mid).join(" ");
      return firstHalf;
    } else {
      const secondHalf = e.slice(mid, last).join(" ");
      return secondHalf;
    }
  };

  return (
    <div className="relative w-full h-[210px] rounded-xl overflow-hidden shadow-md">
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <React.Fragment key={i}>
            <img
              key={i}
              src={slide.bg_img?slide.bg_img:'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200'}
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
              <div className="relative h-full flex items-end">
                <div className="flex-1 px-4 sm:px-6 pb-4">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 drop-shadow-lg">
                    {Title(slide.title.split(" "))}
                  </h2>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-2 drop-shadow-lg">
                    {Title(slide.title.split(" "), slide.title.split(" ").length)}
                  </h3>
                  <p className="text-white text-base sm:text-base mb-2 drop-shadow-md line-clamp-2">
                    {slide.description}
                  </p>
                  {/* <button className="px-1 sm:px-2 py-1 sm:py-1 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                    {"More Info"}
                  </button> */}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-1 left-1/2 flex gap-1">
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
