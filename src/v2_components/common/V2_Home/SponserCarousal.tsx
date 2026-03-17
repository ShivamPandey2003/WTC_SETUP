import { useEffect, useState } from "react";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";
// import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  slides: {
    id: string;
    full_name: string;
    url: string;
    logo: string;
  }[];
  intervalTime?: number;
}

const SponserCarousal = ({
  slides,
  intervalTime = 5000,
}: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 500);
  };
  return (
    <div
      className={`relative rounded-2xl overflow-hidden w-full min-h-[260px] h-full md:h-[200px] border border-gray-300 bg-white`}
    >
      {slides.map((slide, index) =>
        index === currentSlide ? (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700 px-2"
          >
            <a href={slide.url} target="_blank" rel="noopener noreferrer">
              <div
                className="w-full h-full bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: slide.logo
                    ? `url(${slide.logo})`
                    : `url(${ExPlaceholderImg})`,
                }}
              >
                <div className="w-full h-full flex flex-col justify-end py-4 px-2 md:px-4">
                  <h2 className="text-base font-bold text-primary mb-1">
                    {slide.full_name}
                  </h2>
                  <h2 className="text-base font-bold text-primary mb-1">
                    Diamond Sponsor
                  </h2>
                </div>
              </div>
            </a>
          </div>
        ) : null,
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-gray-300 hover:bg-primary"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SponserCarousal;
