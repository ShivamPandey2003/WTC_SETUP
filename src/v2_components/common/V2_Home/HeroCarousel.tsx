import { cn } from "@/lib/utils";
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router";
import ExPlaceholderImg from "@/assets/Images/EXPlaceholder.jpg";

interface HeroCarouselProps {
  slides: Carusole[];
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  intervalTime?: number;
}

function HeroCarousel({
  className,
  slides,
  titleClassName,
  subtitleClassName,
  descriptionClassName,
  intervalTime = 5000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const navigation = useNavigate();

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, intervalTime]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 500);
  };

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

  const onClick = (id: string, type: number) => {
    if (type === 1) {
      navigation(`/exhibitors/${id}`);
    } else if (type === 3) {
      navigation(`/speaker/${id}`);
    } else if (type === 2) {
      navigation(`/programme`);
    } else {
      navigation(`/news/${id}`);
    }
  };
  return (
    <div
      className={cn(
        "relative w-full aspect-video rounded-2xl overflow-hidden group shadow-md",
        className,
      )}
    >
      {slides.map((slide, index) =>
        index === currentSlide ? (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={cn(
                "relative w-full h-full",
                slide.type === 1 && "bg-white",
              )}
              onClick={() => onClick(slide.id, slide.type)}
            >
              <img
                src={slide.bg_img ? `${slide.bg_img}` : ExPlaceholderImg}
                alt=""
                className={cn(
                  "absolute w-full h-full",
                  slide.type === 1
                    ? "object-contain inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
                    : "object-cover inset-0",
                )}
                width={1200}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />

              <div className={cn("absolute inset-0 bg-linear-to-t from-slate-900/40 to-slate-900/10 flex flex-col justify-end py-4 px-8 md:px-16",slide.type === 1 && "hidden")}>
                <h1
                  className={cn(
                    "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 capitalize",
                    titleClassName,
                  )}
                >
                  {Title(slide.title.split(" "))}
                </h1>
                <h2
                  className={cn(
                    "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4",
                    subtitleClassName,
                  )}
                >
                  {Title(slide.title.split(" "), slide.title.split(" ").length)}
                </h2>
                {slide.description && (
                  <p
                    className={cn(
                      "text-xl md:text-2xl text-white/90 mb-8 line-clamp-2",
                      descriptionClassName,
                    )}
                  >
                    {slide.description}
                  </p>
                )}
                <p
                  className={cn(
                    "text-xl md:text-2xl text-white/90 mb-8 line-clamp-2",
                    descriptionClassName,
                  )}
                >
                  {slide.category_name}
                </p>
              </div>
            </div>
          </div>
        ) : null,
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover:flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 border border-gray-300 cursor-pointer ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(HeroCarousel);
