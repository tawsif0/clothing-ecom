import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const TrustedBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);

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

  return (
    <section className="py-20 bg-white border-b border-surface-container">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <p className="font-label-md text-label-md uppercase tracking-[0.3em] text-on-surface-variant">Trending Brands</p>
        </div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-4">Trusted labels across the store</h2>
        <p className="font-body-md text-on-surface-variant mb-12">Tap any logo to jump straight into matching products in the catalog.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {displayBrands.map((brand, index) => {
            const hasLogo = !!brand.logoUrl;
            // The Gucci item originally had a special outline border for contrast
            const hasBorder = brand.border || (brand.name === "Gucci" && !hasLogo);
            
            return (
              <div 
                key={brand._id || index}
                onClick={() => handleBrandClick(brand.name)}
                className={`bg-surface-container-low p-8 rounded-lg flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer ${
                  hasBorder ? "border-2 border-primary/10" : ""
                }`}
              >
                {hasLogo ? (
                  <img 
                    src={brand.logoUrl} 
                    alt={brand.name} 
                    className="h-10 w-auto object-contain mb-3" 
                  />
                ) : (
                  <span className="material-symbols-outlined text-4xl mb-3 text-primary">
                    {brand.icon || "token"}
                  </span>
                )}
                <p className="font-label-sm font-bold">{brand.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;
