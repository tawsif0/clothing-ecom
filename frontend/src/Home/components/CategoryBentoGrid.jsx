import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import usePublicSettings from "../../hooks/usePublicSettings";

const baseUrl = import.meta.env.VITE_API_URL;

const CategoryBentoGrid = () => {
  const [categories, setCategories] = useState([]);
  const { settings } = usePublicSettings();
  const bentoCategoryIds = settings?.storefront?.bentoCategories || [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/categories/public`);
        const rows = Array.isArray(response.data?.categories)
          ? response.data.categories
          : [];
        setCategories(rows.filter(c => c.isActive !== false));
      } catch (error) {
        console.error("Failed to fetch public categories for bento grid:", error);
      }
    };

    fetchCategories();
  }, []);

  // Smart matching logic for the Bento Grid slots
  const abayaCategory = categories.find(c => c.name.toLowerCase().includes("abaya"));
  const hijabCategory = categories.find(c => c.name.toLowerCase().includes("hijab"));
  const eveningCategory = categories.find(c => 
    c.name.toLowerCase().includes("evening") || 
    c.name.toLowerCase().includes("occasion") || 
    c.name.toLowerCase().includes("wear") || 
    c.name.toLowerCase().includes("gown")
  );

  // Determine Slot 1 (Left, Large)
  let slot1 = bentoCategoryIds[0] ? categories.find(c => c._id === bentoCategoryIds[0]) : null;
  if (!slot1) slot1 = abayaCategory || categories[0] || null;

  // Determine Slot 2 (Right, Tall)
  const remainingForSlot2 = categories.filter(c => c._id !== slot1?._id);
  let slot2 = bentoCategoryIds[1] ? categories.find(c => c._id === bentoCategoryIds[1]) : null;
  if (!slot2) slot2 = hijabCategory || remainingForSlot2[0] || null;

  // Determine Slot 3 (Bottom, Full Width)
  const remainingForSlot3 = categories.filter(c => c._id !== slot1?._id && c._id !== slot2?._id);
  let slot3 = bentoCategoryIds[2] ? categories.find(c => c._id === bentoCategoryIds[2]) : null;
  if (!slot3) slot3 = eveningCategory || remainingForSlot3[0] || null;

  // Bento Items config with premium defaults (Admin settings take precedence)
  const bento1 = {
    title: settings?.storefront?.bento1Title || slot1?.name || "The Modern Abaya",
    link: settings?.storefront?.bento1Link || (slot1 ? `/shop?category=${slot1._id}` : "/shop"),
    image: settings?.storefront?.bento1Image || slot1?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuC5UUcKbUdBxJGzwt6Y6w0nC4lMl8SlYeApwDyertv7ysFFlCdOkSWc0wJbVE4g6vN3JWjtkCy6y5-Bd-81PGJkzEMUugcx71C28J1a18OPm52_qoQqmhwOpGV2ueTilMYqJa6rIqU3w-1LpdSgQZ20UQ2AaulNQblEVC4V1mcqsNQvi5LD8nuQ150XQ4heVAzQel1w87TxLyjTZ3k_CWkw2PaBQlJHrP0lLN3UIr0NjqXkd3eYp7vX9zNbdlDaktYYbcDgoIWHPg",
    buttonText: settings?.storefront?.bento1Button || "Shop Now"
  };

  const bento2 = {
    title: settings?.storefront?.bento2Title || slot2?.name || "Essential Hijabs",
    link: settings?.storefront?.bento2Link || (slot2 ? `/shop?category=${slot2._id}` : "/shop"),
    image: settings?.storefront?.bento2Image || slot2?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAoVeEO8M2MibvoW5_7Yn6Zja7y0xjdos9XiGDILuw7rGFO8ivZSyie0Nv-6BkEkAEqCjgzFaTq50JU7-FISFBd0DWztbve6teas3j9C6pQH1CrAzDJvDQfnedozq1mlWFdgCxWV3BT2m-yU_DfvRN2WU68IgVkmUIoj9yIggcNR4rw3n6nbbBM5HN0VcsvfqwgvVS7AH99Pe5W8fp0ZkyIvTsqSTKpiHfkE5HSEeu7Z6L8ymFwa-1i8xytMjsWp2JuWJRsaHyNLA",
    buttonText: settings?.storefront?.bento2Button || "Shop Now"
  };

  const bento3 = {
    title: settings?.storefront?.bento3Title || slot3?.name || "Evening Wear",
    link: settings?.storefront?.bento3Link || (slot3 ? `/shop?category=${slot3._id}` : "/shop"),
    image: settings?.storefront?.bento3Image || slot3?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Y9BACFAc5nuRyVlBAmzaul1gpgRjJkPR_S03SiwzyR9__cP3GKVPZdpw-nFl5DHyobfq5u8oW_HnJtXyB-fFztBI5ugbKmTsDkwNwKctFtNZgcSiZBRx3CEz7xb_2704wlaKRG3mkB0_wFoqhUvuSFsP7ghgoAPTCkU87um465wwPOnKz48P82av0VirT0yNvF5StowDKURAOKe202dWuUHw3eUNEsoqadR5NTkfgRnCuKErAeTmroLKmZoMsCxL8Jgqs3SFNw",
    buttonText: settings?.storefront?.bento3Button || "Explore Occasion"
  };

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 italic">
          {settings?.storefront?.bentoSectionTitle || "Shop by Collection"}
        </h2>
        <div className="w-24 h-1 bg-secondary mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
        {/* Slot 1: Abayas / First Category */}
        <div className="md:col-span-8 group relative overflow-hidden bg-surface-container rounded-lg card-hover">
          <img 
            alt={bento1.title} 
            className="w-full h-full object-cover image-reveal" 
            src={bento1.image}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
          <div className="absolute bottom-10 left-10">
            <h3 className="font-headline-md text-headline-md text-white mb-2 italic">{bento1.title}</h3>
            <Link className="text-white font-label-md text-label-md border-b border-white pb-1 hover:text-secondary hover:border-secondary transition-colors" to={bento1.link}>{bento1.buttonText}</Link>
          </div>
        </div>

        {/* Slot 2: Hijabs / Second Category */}
        <div className="md:col-span-4 group relative overflow-hidden bg-surface-container rounded-lg card-hover">
          <img 
            alt={bento2.title} 
            className="w-full h-full object-cover image-reveal" 
            src={bento2.image}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>
          <div className="absolute bottom-10 left-10">
            <h3 className="font-headline-md text-headline-md text-white mb-2 italic">{bento2.title}</h3>
            <Link className="text-white font-label-md text-label-md border-b border-white pb-1 hover:text-secondary hover:border-secondary transition-colors" to={bento2.link}>{bento2.buttonText}</Link>
          </div>
        </div>

        {/* Slot 3: Evening Wear / Third Category */}
        <div className="md:col-span-12 group relative overflow-hidden bg-surface-container rounded-lg card-hover h-[300px]">
          <img 
            alt={bento3.title} 
            className="w-full h-full object-cover image-reveal" 
            src={bento3.image}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-display-lg-mobile md:font-display-lg text-white mb-4 italic">{bento3.title}</h3>
              <Link className="inline-block bg-white text-primary font-label-md text-label-md px-8 py-3 rounded-lg hover:bg-secondary hover:text-white transition-colors" to={bento3.link}>{bento3.buttonText}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryBentoGrid;
