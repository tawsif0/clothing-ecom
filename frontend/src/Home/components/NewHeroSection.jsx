import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center bg-zinc-900">
      {/* Render slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-10"
        >
          {/* Background Image with Auto Zoom Panning */}
          <motion.div
            key={`hero-pan-${activeIndex}`}
            initial={{ scale: 1.12 }}
            animate={{
              scale: [1.12, 1.04, 1.12],
            }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="absolute inset-0 animate-zoom-in"
          >
            <img
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center"
              src={currentSlide.imageUrl}
            />
          </motion.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 hero-gradient z-10"></div>

          {/* Content Container */}
          <div className="relative z-20 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-left"
            >
              <p className="font-label-md text-label-md text-white mb-4 uppercase tracking-[0.2em]">
                {currentSlide.kicker}
              </p>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8 leading-tight">
                {currentSlide.title}
              </h1>
              {currentSlide.description && (
                <div
                  className="text-white font-body-md text-sm md:text-base max-w-lg mb-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentSlide.description }}
                />
              )}
              {currentSlide.buttonLabel && (
                <a
                  className="inline-block bg-primary text-on-primary font-label-md text-label-md px-10 py-5 rounded-lg border border-secondary transition-all duration-300 shadow-lg shadow-primary/10"
                  href={currentSlide.buttonLink || "#"}
                >
                  {currentSlide.buttonLabel}
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Buttons & Dots in Red Circle Area */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-zinc-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Previous Slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Indicator Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Next Slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default NewHeroSection;
