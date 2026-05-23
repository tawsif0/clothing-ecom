import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAdminSettingsDraft } from "../../store/publicSettingsSlice";

const baseUrl = import.meta.env.VITE_API_URL;

/**
 * DynamicCollectionSection
 * Renders the "Shop by Collection" (Bento Grid) section based on admin-configured
 * categories (bentoCategories). It fetches category details (including image) from the
 * backend and displays them in the same layout as the previous static implementation.
 */
const DynamicCollectionSection = () => {
  const settings = useSelector(selectAdminSettingsDraft);
  const bentoCategories = settings?.storefront?.bentoCategories || [];

  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load category details for the selected IDs
  useEffect(() => {
    const loadCategories = async () => {
      if (!bentoCategories.length) {
        setCategoryData([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/categories`, {
          params: { ids: bentoCategories.filter(Boolean).join(",") },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Expect response.data.categories = array of category objects
        const data = response.data?.success ? response.data.categories : [];
        setCategoryData(data);
      } catch (e) {
        console.error("Failed to load bento categories", e);
        setCategoryData([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [bentoCategories]);

  // Helper to find category by id
  const findCategory = (id) => categoryData.find((c) => c._id === id) || {};

  // Render a single card – matches the markup used in the original static version
  const renderCard = (catId, slotClass) => {
    const cat = findCategory(catId);
    const imageSrc = cat.image || "https://via.placeholder.com/800x600?text=Collection";
    const title = cat.name || "Collection";
    const link = catId ? `/shop?category=${catId}` : "#";
    return (
      <div className={slotClass}>
        <div className="relative overflow-hidden aspect-[3/4] bg-surface-container mb-4 cursor-pointer rounded-lg card-hover">
          <img alt={title} className="w-full h-full object-cover image-reveal" src={imageSrc} />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
          <div className="absolute bottom-10 left-10">
            <h3 className="font-headline-md text-headline-md text-white mb-2 italic">{title}</h3>
            <a className="text-white font-label-md text-label-md border-b border-white pb-1 hover:text-secondary hover:border-secondary transition-colors" href={link}>{settings?.storefront?.collectionButtonLabel || "Shop Now"}</a>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto is-visible">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 italic">Shop by Collection</h2>
          <div className="w-24 h-1 bg-secondary mx-auto" />
        </div>
        <p className="text-center text-on-surface-variant">Loading collections…</p>
      </section>
    );
  }

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto is-visible">
      <div className="text-center mb-16">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 italic">Shop by Collection</h2>
        <div className="w-24 h-1 bg-secondary mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
        {/* Large left slot */}
        {renderCard(bentoCategories[0], "md:col-span-8 group")}
        {/* Top right slot */}
        {renderCard(bentoCategories[1], "md:col-span-4 group")}
        {/* Bottom right slot */}
        {renderCard(bentoCategories[2], "md:col-span-12 group")}
      </div>
    </section>
  );
};

export default DynamicCollectionSection;
