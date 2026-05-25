import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getBrandInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "BR";

const TrustedBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const groupRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${baseUrl}/brands/public`);
        const rows = Array.isArray(response.data?.brands)
          ? response.data.brands
          : [];
        
        // Filter only active brands
        const activeBrands = rows.filter(b => b.isActive !== false);
        setBrands(activeBrands);
      } catch (error) {
        console.error("Failed to fetch public brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brandName) => {
    navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
  };

  const fallbackBrands = [
    { name: "Carry Craft", icon: "token" },
    { name: "Gucci", icon: "diamond", border: true },
    { name: "Luna Jewel", icon: "brightness_7" },
    { name: "Muse Lane", icon: "auto_awesome" },
    { name: "Noor Attire", icon: "all_inclusive" },
    { name: "Stride Co", icon: "star" }
  ];

  const displayBrands = brands.length > 0 ? brands : fallbackBrands;

  const logoBrands = useMemo(() => {
    const seen = new Set();
    const unique = displayBrands
      .filter((brand) => brand.name)
      .filter((brand) => {
        const key = brand.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    if (!unique.length) return [];

    const repeated = [...unique];
    while (repeated.length < 10) {
      repeated.push(...unique);
    }

    return repeated.slice(0, Math.max(10, unique.length));
  }, [displayBrands]);

  useEffect(() => {
    if (!logoBrands.length) {
      setScrollDistance(0);
      return undefined;
    }

    const node = groupRef.current;
    if (!node) return undefined;

    const updateWidth = () => {
      const nextWidth = Math.ceil(node.getBoundingClientRect().width);
      setScrollDistance(nextWidth);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(node);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [logoBrands]);

  if (!logoBrands.length) return null;

  const duration = scrollDistance
    ? Math.max(18, Number((scrollDistance / 85).toFixed(2)))
    : Math.max(24, logoBrands.length * 3.5);

  const renderLogoGroup = (suffix) =>
    logoBrands.map((brand, index) => {
      const hasLogo = !!brand.logoUrl;
      const hasBorder = brand.border || (brand.name === "Gucci" && !hasLogo);
      
      return (
        <div 
          key={`${suffix}-${brand._id || brand.name}-${index}`}
          onClick={() => handleBrandClick(brand.name)}
          className={`bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer shrink-0 w-44 h-36 border border-surface-container/50 ${
            hasBorder ? "border-2 border-primary/10" : ""
          }`}
        >
          {hasLogo ? (
            <img 
              src={brand.logoUrl} 
              alt={brand.name} 
              className="h-10 w-auto max-w-full object-contain mb-3" 
            />
          ) : (
            <div className="h-10 flex items-center justify-center mb-3">
              <span className="text-xl font-bold tracking-wider text-primary">
                {getBrandInitials(brand.name)}
              </span>
            </div>
          )}
          <p className="font-label-sm font-bold text-center text-sm w-full truncate">{brand.name}</p>
        </div>
      );
    });

  return (
    <section className="py-20 bg-white border-b border-surface-container overflow-visible">
      <style>
        {`
          @keyframes brand-logo-marquee-scroll {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(calc(-1 * var(--brand-scroll-distance, 0px)), 0, 0); }
          }
        `}
      </style>
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <p className="font-label-md text-label-md uppercase tracking-[0.3em] text-on-surface-variant">Trending Brands</p>
        </div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-4">Trusted labels across the store</h2>
        <p className="font-body-md text-on-surface-variant mb-12">Tap any logo to jump straight into matching products in the catalog.</p>
        
        <div className="relative py-5 overflow-hidden">
       
          <div className="overflow-hidden">
            <div
              className="flex w-max will-change-transform backface-hidden transform-[translate3d(0,0,0)] hover:[animation-play-state:paused]"
              style={{
                "--brand-scroll-distance": `${scrollDistance}px`,
                animation:
                  scrollDistance > 0
                    ? `brand-logo-marquee-scroll ${duration}s linear infinite`
                    : "none",
              }}
            >
              <div
                ref={groupRef}
                className="flex shrink-0 gap-6 px-4 py-3"
              >
                {renderLogoGroup("first")}
              </div>
              <div
                className="flex shrink-0 gap-6 px-4 py-3"
                aria-hidden="true"
              >
                {renderLogoGroup("second")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;
