import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
  color: string;
}

const slides: Slide[] = [
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
  }
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getSlideStyles = (index: number) => {
    const diff = index - currentIndex;
    const isActive = diff === 0;
    const isPrev =
      diff === -1 || (currentIndex === 0 && index === slides.length - 1);
    const isNext =
      diff === 1 || (currentIndex === slides.length - 1 && index === 0);

    if (isActive) {
      return {
        transform: "translateX(0%) scale(0.85)",
        opacity: 1,
        zIndex: 30,
      };
    } else if (isPrev) {
      return {
        transform: "translateX(-20%) scale(0.70)",
        opacity: 0.5,
        zIndex: 10,
      };
    } else if (isNext) {
      return {
        transform: "translateX(20%) scale(0.70)",
        opacity: 0.5,
        zIndex: 10,
      };
    } else {
      return {
        transform: "translateX(0%) scale(0.7)",
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 overflow-hidden mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[300px] mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          {slides.map((slide, index) => {
            const styles = getSlideStyles(index);
            const isActive = index === currentIndex;

            return (
              <div
                key={slide.id}
                className="absolute w-full max-w-6xl transition-all duration-500 ease-out"
                style={styles}
              >
                <div
                  className={`relative h-[350px] rounded-3xl overflow-hidden shadow-lg ${
                    !isActive ? "pointer-events-none" : ""
                  }`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                  </div>

                  <div className="relative h-full flex items-center">
                    <div className="flex-1 px-8 sm:px-12">
                      <h2 className="text-white text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
                        {slide.title}
                      </h2>
                      <h3 className="text-white text-2xl sm:text-4xl font-bold mb-6 drop-shadow-lg">
                        {slide.subtitle}
                      </h3>
                      <p className="text-white text-lg sm:text-xl mb-8 drop-shadow-md">
                        {slide.description}
                      </p>
                      <button className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <button
          onClick={goToPrevious}
          disabled={isAnimating}
          className="absolute -left-4 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={goToNext}
          disabled={isAnimating}
          className="absolute -right-4 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button> */}
      </div>

      <div className="flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
