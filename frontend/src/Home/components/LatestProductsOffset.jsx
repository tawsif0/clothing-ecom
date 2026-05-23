import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductPricingDisplay } from "../../utils/productPricing";
import usePublicSettings from "../../hooks/usePublicSettings";
import { getPublicStockBadgeText, isPublicStockVisible } from "../../utils/publicProduct";

const LatestProductsOffset = ({ products = [] }) => {
  const { settings } = usePublicSettings();
  const fallbackProducts = [
    {
      _id: 'lp1',
      name: 'Striped Linen Casual Shirt',
      price: 1690,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6BWCBMMOFvFUuq5kXrvEbRAGZXLJvDAv3Rzf3o1TzWcGBz6X2O7YuVkUflGpcJ17_V0pU8LXsFvfnr1cnC_SyEiDulK3n5_P7hZBIfepKTiVcdASF8wwNqk_Rt2GB8grR3OCAU0nhsWzcL88zWXStfCFoV8vggUyYX8Wt8-UvncluC5D5vg7-pt3dtALc1BtjYz7RTgAd1fnFOc5H_qHIrKI69TkAAN_X-_mD8nYkfeDMgI-fq31_egwNlzEbpIZiZj2FfPKig' }
    },
    {
      _id: 'lp2',
      name: 'Slim Fit Oxford Shirt',
      price: 1390,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9rfPdsrwP0drN-LoVHtb9D9Kea7FKQjFwptaBDo7pmhu7lfJCKlE-rYDDbh-1SQ86fbSF9nLpQHWnz1spSmOO_fSs_-IOv5PHaPs4vRpZrobQrl77xvAdFeo99ktMJXIsrmlo_Ndb-YzFdbIqGQ9j4aF2fdyM3czXx0gRLmMxYq1y5E4bmWQHcABfWSLune1rocv2PLuQpKX1WFq6kEWajiKggbu7xCeqzHdE1Jj1jqgA_ECkOPmdCGWtsWAOQyOU2PQp6aTcA' }
    }
  ];

  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    const source = products.length > 0 ? products : fallbackProducts;
    source.forEach(p => {
      if (p.category?.name) cats.add(p.category.name);
    });
    return Array.from(cats).slice(0, 4);
  }, [products]);

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (uniqueCategories.length > 0 && !activeTab) {
      setActiveTab(uniqueCategories[0]);
    }
  }, [uniqueCategories, activeTab]);

  const displayProducts = useMemo(() => {
    const source = products.length > 0 ? products : fallbackProducts;
    if (!activeTab) return source.slice(0, 2);
    return source.filter(p => p.category?.name === activeTab).slice(0, 2);
  }, [products, activeTab]);

  const renderProductCard = (product, index) => {
    const stockBadgeText = getPublicStockBadgeText(product, null, settings);
    const showStockBadge = Boolean(stockBadgeText) && isPublicStockVisible(product, settings);
    
    return (
      <div key={product._id} className={`relative group ${index % 2 === 0 ? 'mt-0 md:mt-24' : ''}`}>
        <div className="relative aspect-square bg-surface-container rounded shadow-xl overflow-hidden">
          <Link to={`/product/${product._id}`}>
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src={product.images?.[0] || product.image || product.mainImage?.url || "https://placehold.co/600x600?text=No+Image"} 
              alt={product.title || product.name} 
            />
          </Link>
          {showStockBadge && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
              {stockBadgeText}
            </span>
          )}
          <span className="absolute top-6 left-6 bg-white text-primary text-[10px] font-bold px-3 py-1 uppercase rounded-full">New</span>
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg"><span className="material-symbols-outlined text-sm">shopping_bag</span></button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg"><span className="material-symbols-outlined text-sm">favorite</span></button>
            <Link to={`/product/${product._id}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-lg">
              <span className="material-symbols-outlined text-sm">open_in_full</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center md:text-left">
          <p className="font-label-sm text-secondary uppercase tracking-widest mb-2">Fresh Arrival</p>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-headline-md text-black mb-2 text-2xl">{product.title || product.name}</h3>
          </Link>
          <p className="font-bold text-black">${product.price || product.basePrice}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto overflow-hidden">
      <div className="text-center mb-16 relative">
        <p className="font-label-sm text-on-surface-variant uppercase tracking-[0.4em] mb-4">New Arrivals</p>
        <h2 className="font-display-lg-mobile md:font-display-lg text-primary mb-4 italic">Latest Products</h2>
        <p className="font-body-md text-on-surface-variant mb-12 max-w-xl mx-auto">Fresh inventory presented with a lighter launch-style section that feels new the moment it loads.</p>
        <div className="flex justify-center mb-8 gap-3">
          {uniqueCategories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-2 rounded font-label-sm uppercase tracking-widest transition-colors ${activeTab === cat ? 'bg-black text-white' : 'border border-outline-variant text-on-surface-variant hover:border-black'}`}
            >
              {cat}
            </button>
          ))}
          {uniqueCategories.length === 0 && (
            <button className="bg-black text-white px-8 py-2 rounded font-label-sm uppercase tracking-widest">SHIRTS</button>
          )}
        </div>
        <div className="absolute -right-20 top-0 opacity-5 pointer-events-none hidden lg:block">
          <h3 className="text-[200px] font-bold text-primary leading-none uppercase select-none">NEW</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start pt-12">
        {displayProducts.map((product, index) => renderProductCard(product, index))}
      </div>
    </section>
  );
};

export default LatestProductsOffset;
