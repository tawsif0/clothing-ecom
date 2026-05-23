import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const NewHeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const getFullImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null;
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:")
    ) {
      return imagePath;
    }
    if (imagePath.startsWith("/")) {
      return baseUrl ? `${baseUrl}${imagePath}` : imagePath;
    }
    return baseUrl
      ? `${baseUrl}/uploads/banners/${imagePath}`
      : `/uploads/banners/${imagePath}`;
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${baseUrl}/banners`);
        let bannersData = [];
        if (response.data?.success) {
          bannersData = response.data.banners || [];
        } else if (Array.isArray(response.data)) {
          bannersData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          bannersData = response.data.data;
        }

        // Filter for hero/home banners if specified
        const heroSlides = bannersData
          .filter((banner) => !banner.type || banner.type === "hero" || banner.page === "home")
          .map((banner) => ({
            _id: banner._id,
            title: banner.title || "Timeless Elegance in Emerald",
            kicker: banner.kicker || "New Season Arrival",
            description: banner.description || "",
            buttonLabel: banner.buttonLabel || "Discover the Collection",
            buttonLink: banner.buttonLink || "/shop",
            imageUrl: getFullImageUrl(banner.image || banner.thumb) || "https://lh3.googleusercontent.com/aida-public/AB6AXuDelb_hOMM04YCPTmCTO9mb3VGdF2N4ZXCqH-TxHXfw6Kc3eY1D1SdUwqdMynCzDBOGMFccO2pp0Ihoszo-Ntct_FU9igMFnPg6csRX5G2ueJNKcYoIw8NhV-ycetUQuM5G806MoQk9dKnG__RcTGVMSBFO0ySLMZ9_KrWN30j4tZEhkdxBwvyMPiJ1OGdVWVLohJJN2AGau-usUL9psdAxJ-uHY9QOo18nY_Pj_yXKX7s2txdDMUzW-DROnmlFOncdt2eHlXm-8w"
          }));

        if (heroSlides.length > 0) {
          setSlides(heroSlides);
        } else {
          // Fallback slide
          setSlides([
            {
              title: "Timeless Elegance in Emerald",
              kicker: "New Season Arrival",
              description: "Experience premium modest wear designed with luxurious fabrics, elegant silhouettes, and unparalleled craftsmanship.",
              buttonLabel: "Discover the Collection",
              buttonLink: "/shop",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDelb_hOMM04YCPTmCTO9mb3VGdF2N4ZXCqH-TxHXfw6Kc3eY1D1SdUwqdMynCzDBOGMFccO2pp0Ihoszo-Ntct_FU9igMFnPg6csRX5G2ueJNKcYoIw8NhV-ycetUQuM5G806MoQk9dKnG__RcTGVMSBFO0ySLMZ9_KrWN30j4tZEhkdxBwvyMPiJ1OGdVWVLohJJN2AGau-usUL9psdAxJ-uHY9QOo18nY_Pj_yXKX7s2txdDMUzW-DROnmlFOncdt2eHlXm-8w"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch hero sliders:", error);
        // Fallback slide on error
        setSlides([
          {
            title: "Timeless Elegance in Emerald",
            kicker: "New Season Arrival",
            description: "Experience premium modest wear designed with luxurious fabrics, elegant silhouettes, and unparalleled craftsmanship.",
            buttonLabel: "Discover the Collection",
            buttonLink: "/shop",
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDelb_hOMM04YCPTmCTO9mb3VGdF2N4ZXCqH-TxHXfw6Kc3eY1D1SdUwqdMynCzDBOGMFccO2pp0Ihoszo-Ntct_FU9igMFnPg6csRX5G2ueJNKcYoIw8NhV-ycetUQuM5G806MoQk9dKnG__RcTGVMSBFO0ySLMZ9_KrWN30j4tZEhkdxBwvyMPiJ1OGdVWVLohJJN2AGau-usUL9psdAxJ-uHY9QOo18nY_Pj_yXKX7s2txdDMUzW-DROnmlFOncdt2eHlXm-8w"
          }
        ]);
      }
    };

    fetchBanners();
  }, [getFullImageUrl]);

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center bg-zinc-950">
        <div className="w-12 h-12 border-2 border-white/20 border-t-2 border-t-white rounded-full animate-spin mx-auto"></div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center bg-zinc-900">
      {/* Render slides */}
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide._id || index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              src={slide.imageUrl}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 hero-gradient"></div>

            {/* Content Container */}
            <div className="relative z-20 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full h-full flex items-center">
              <div className="max-w-2xl text-left">
                <p className="font-label-md text-label-md text-white mb-4 uppercase tracking-[0.2em] transition-transform duration-700 delay-100 translate-y-0">
                  {slide.kicker}
                </p>
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8 leading-tight transition-transform duration-700 delay-200 translate-y-0">
                  {slide.title}
                </h1>
                {slide.description && (
                  <div
                    className="text-white font-body-md text-sm md:text-base max-w-lg mb-8 leading-relaxed transition-transform duration-700 delay-300 translate-y-0"
                    dangerouslySetInnerHTML={{ __html: slide.description }}
                  />
                )}
                {slide.buttonLabel && (
                  <a
                    className="inline-block bg-primary text-on-primary font-label-md text-label-md px-10 py-5 rounded-lg border border-secondary transition-all duration-300 shadow-lg shadow-primary/10 transition-transform duration-700 delay-400 translate-y-0"
                    href={slide.buttonLink || "#"}
                  >
                    {slide.buttonLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Buttons */}
      {slides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-30 p-2.5 rounded-full bg-white/40 hover:bg-white/70 text-primary transition-all duration-300 backdrop-blur-sm shadow-md"
            aria-label="Previous Slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 z-30 p-2.5 rounded-full bg-white/40 hover:bg-white/70 text-primary transition-all duration-300 backdrop-blur-sm shadow-md"
            aria-label="Next Slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default NewHeroSection;
