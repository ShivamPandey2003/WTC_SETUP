import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "World Tunnel",
    subtitle: "Congress 2026",
    description: "We Welcome You All To Montreal",
    image:
      "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1600",
    buttonText: "More info",
  },
  {
    id: 2,
    title: "Innovation in",
    subtitle: "Tunneling",
    description: "Advancing Underground Infrastructure",
    image:
      "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1600",
    buttonText: "Learn more",
  },
  {
    id: 3,
    title: "Sustainable",
    subtitle: "Solutions",
    description: "Building the Future Underground",
    image:
      "https://images.pexels.com/photos/1103969/pexels-photo-1103969.jpeg?auto=compress&cs=tinysrgb&w=1600",
    buttonText: "Explore",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
      setCurrentSlide(index);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 500);
    };

  //   const nextSlide = () => {
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //     setIsAutoPlaying(false);
  //   };

  //   const prevSlide = () => {
  //     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  //     setIsAutoPlaying(false);
  //   };

  return (
    <div className="relative w-full h-[350px] md:h-[420px] rounded-2xl overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="w-full h-full bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex flex-col justify-end py-4 px-8 md:px-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                {slide.title}
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {slide.subtitle}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {slide.description}
              </p>
              <button className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-8 py-3 rounded-full w-fit transition-colors duration-200">
                {slide.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

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
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
