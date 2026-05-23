import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HotDeals = ({ products = [] }) => {
  const fallbackProducts = [
    {
      _id: 'hd1',
      name: 'Celestial Pearl Modal Hijab',
      price: 66.00,
      originalPrice: 110.00,
      discount: 40,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9rfPdsrwP0drN-LoVHtb9D9Kea7FKQjFwptaBDo7pmhu7lfJCKlE-rYDDbh-1SQ86fbSF9nLpQHWnz1spSmOO_fSs_-IOv5PHaPs4vRpZrobQrl77xvAdFeo99ktMJXIsrmlo_Ndb-YzFdbIqGQ9j4aF2fdyM3czXx0gRLmMxYq1y5E4bmWQHcABfWSLune1rocv2PLuQpKX1WFq6kEWajiKggbu7xCeqzHdE1Jj1jqgA_ECkOPmdCGWtsWAOQyOU2PQp6aTcA' }
    },
    {
      _id: 'hd2',
      name: 'Classic Evening Abaya',
      price: 261.00,
      originalPrice: 349.00,
      discount: 25,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6BWCBMMOFvFUuq5kXrvEbRAGZXLJvDAv3Rzf3o1TzWcGBz6X2O7YuVkUflGpcJ17_V0pU8LXsFvfnr1cnC_SyEiDulK3n5_P7hZBIfepKTiVcdASF8wwNqk_Rt2GB8grR3OCAU0nhsWzcL88zWXStfCFoV8vggUyYX8Wt8-UvncluC5D5vg7-pt3dtALc1BtjYz7RTgAd1fnFOc5H_qHIrKI69TkAAN_X-_mD8nYkfeDMgI-fq31_egwNlzEbpIZiZj2FfPKig' }
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

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <p className="font-label-sm text-on-surface-variant uppercase tracking-[0.4em] mb-4">Limited Time Offers</p>
        <h2 className="font-display-lg-mobile md:font-headline-lg text-primary mb-4 italic">Hot Deals</h2>
        <p className="font-body-md text-on-surface-variant mb-12 max-w-2xl mx-auto">Exceptional value on the products our shoppers are most likely to grab quickly.</p>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
          {uniqueCategories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              className={`px-6 md:px-8 py-2 md:py-3 rounded-full font-label-md uppercase transition-colors ${activeTab === cat ? 'bg-black text-white active-tab' : 'border border-outline-variant text-on-surface-variant hover:border-black'}`}
            >
              {cat}
            </button>
          ))}
          {uniqueCategories.length === 0 && (
            <>
              <button className="px-6 md:px-8 py-2 md:py-3 rounded-full bg-black text-white font-label-md uppercase">BOTTOMS</button>
              <button className="px-6 md:px-8 py-2 md:py-3 rounded-full border border-outline-variant text-on-surface-variant font-label-md uppercase">JEWELLERY</button>
              <button className="px-6 md:px-8 py-2 md:py-3 rounded-full border border-outline-variant text-on-surface-variant font-label-md uppercase">POLO SHIRTS</button>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayProducts.map((product) => (
            <div key={product._id} className="group bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 text-left items-center border border-primary/5">
              <Link to={`/product/${product._id}`} className="w-full sm:w-1/3 aspect-square sm:aspect-square bg-surface-container rounded-lg relative overflow-hidden block">
                <img className="w-full h-full object-cover" src={product.images?.[0] || product.image || product.mainImage?.url || "https://placehold.co/400x400?text=No+Image"} alt={product.title || product.name} />
                {(product.discount || product.discountPercentage) && (
                  <span className="absolute top-2 left-2 bg-error text-white text-[8px] px-2 py-1 rounded font-bold uppercase">
                    -{product.discount || product.discountPercentage}%
                  </span>
                )}
              </Link>
              <div className="flex-grow">
                <span className="text-error font-bold text-[10px] uppercase tracking-widest mb-1 block">Hot Deal</span>
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-headline-md text-black mb-1 text-xl">{product.title || product.name}</h3>
                </Link>
                <p className="text-black font-bold text-xl mb-4">
                  ${product.price || product.basePrice}
                  {(product.originalPrice || product.comparePrice) && (
                    <span className="text-on-surface-variant text-sm line-through font-normal ml-2">${product.originalPrice || product.comparePrice}</span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button className="bg-primary text-white px-4 py-2 rounded text-xs font-label-md">GRAB DEAL</button>
                  <button className="p-2 border border-outline-variant rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotDeals;
