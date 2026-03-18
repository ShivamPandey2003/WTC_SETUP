import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import ExPlaceholderImg from '@/assets/Images/EXPlaceholder.jpg'

interface HeroCarouselProps {
  slides: Carusole[];
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  intervalTime?: number;
}

export default function HeroCarousel({
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

  const onClick = (id:string, type:number)=>{
    if(type === 1){
      navigation(`/exhibitors/${id}`)
    }else if (type === 3){
      navigation(`/speaker/${id}`)
    }else if (type === 2){
      navigation(`/programme`)
    }else{
      navigation(`/news/${id}`)
    }
  }

  //   const nextSlide = () => {
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //     setIsAutoPlaying(false);
  //   };

  //   const prevSlide = () => {
  //     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  //     setIsAutoPlaying(false);
  //   };

  return (
    <div
      className={cn(
        "relative w-full h-[350px] md:h-[530px] rounded-2xl overflow-hidden group",
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
              className={cn("w-full h-full bg-no-repeat bg-center", slide.type===1?"bg-contain":"bg-cover")}
              onClick={() => onClick(slide.id, slide.type)}
              style={{
                backgroundImage: slide.bg_img
                  ? `url(${slide.bg_img})`
                  : `url(${ExPlaceholderImg})`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex flex-col justify-end py-4 px-8 md:px-16">
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
                {slide.description && <p
                  className={cn(
                    "text-xl md:text-2xl text-white/90 mb-8 line-clamp-2",
                    descriptionClassName,
                  )}
                >
                  {slide.description}
                </p>}
                {slide.type === 1 && <p
                  className={cn(
                    "text-xl md:text-2xl text-white/90 mb-8 line-clamp-2",
                    descriptionClassName,
                  )}
                >
                  {"Diamond Sponsor"}
                </p>}
                {/* <button
                className={cn(
                  "bg-white/90 hover:bg-white text-slate-800 font-semibold px-8 py-3 rounded-full w-fit transition-colors duration-200",
                  buttonClassName,
                )}
              >
                {"More Info"}
              </button> */}
              </div>
            </div>
          </div>
        ) : null,
      )}

      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button> */}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
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
