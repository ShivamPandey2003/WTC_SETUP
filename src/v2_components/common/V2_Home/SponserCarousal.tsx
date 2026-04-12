import { memo, useEffect, useState } from "react";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  slides: {
    id: string;
    full_name: string;
    url: string;
    logo: string;
    category_name: string;
  }[];
  intervalTime?: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  max: number;
}

const SponserCarousal = ({
  slides,
  intervalTime = 5000,
  setPage,
  page,
  max,
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

  useEffect(() => {
    if (currentSlide >= slides.length - 2) {
      if (max !== page) {
        setPage((pre) => pre + 1);
      }
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 500);
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden w-full h-[28vh] transition-shadow shadow-sm`}
    >
      {slides.map((slide, index) =>
        index === currentSlide ? (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700"
          >
            <a href={slide.url} target="_blank" rel="noopener noreferrer">
              <div className="relative w-full h-full overflow-hidden bg-white">
                <img
                  src={slide.logo ? `${slide.logo}` : ExPlaceholderImg}
                  alt=""
                  className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain object-center"
                  width={200}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </a>
          </div>
        ) : null,
      )}
      <button
        disabled={currentSlide === 0}
        className="group-hover:opacity-70 rounded-full absolute p-2 z-[999] top-[40%] transition-transform duration-300 hover:scale-120 left-4 hover:opacity-100 opacity-0 disabled:opacity-50 shadow bg-white"
        onClick={() => goToSlide(currentSlide - 1)}
      >
        <FaChevronLeft className="text-primary" size={24} />
      </button>
      <button
        disabled={currentSlide === slides.length - 1}
        className="group-hover:opacity-70 rounded-full absolute p-2 z-[999] top-[40%] right-4 transition-transform duration-300 hover:scale-120 hover:opacity-100 opacity-0 disabled:opacity-50 shadow bg-white"
        onClick={() => goToSlide(currentSlide + 1)}
      >
        <FaChevronRight className="text-primary" size={24} />
      </button>
    </div>
  );
};

export default memo(SponserCarousal);
