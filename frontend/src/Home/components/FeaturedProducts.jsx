import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { selectWishlistPendingIds, toggleWishlistItem } from '../../store/wishlistSlice';

const FeaturedProducts = ({ products = [] }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const wishlistPendingIds = useSelector(selectWishlistPendingIds);

  const fallbackProducts = [
    {
      _id: '1',
      name: 'Royal Emerald Silk Abaya',
      price: 349.00,
      originalPrice: 399.00,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6BWCBMMOFvFUuq5kXrvEbRAGZXLJvDAv3Rzf3o1TzWcGBz6X2O7YuVkUflGpcJ17_V0pU8LXsFvfnr1cnC_SyEiDulK3n5_P7hZBIfepKTiVcdASF8wwNqk_Rt2GB8grR3OCAU0nhsWzcL88zWXStfCFoV8vggUyYX8Wt8-UvncluC5D5vg7-pt3dtALc1BtjYz7RTgAd1fnFOc5H_qHIrKI69TkAAN_X-_mD8nYkfeDMgI-fq31_egwNlzEbpIZiZj2FfPKig' },
      isLimited: true,
      discount: 11
    },
    {
      _id: '2',
      name: 'Golden Dusk Silk Chiffon',
      price: 85.00,
      originalPrice: null,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjdNlwmvg-0jPmjSqrnEQo-wsAU6IbaPVKQACdvj_7L3PscleYthMKiPeyhJ6SPM9prJZ_L5rf5_9yJNtj6DFDZCaMha9Fy0O8g-WuDnDAG6RWPCpNZ1t7gSjRJdl_bpRIlDj_-hTPwWbaIQC4nfLl2VcMfV4aseVuMtKco_N5C9lN6G9JCjxSY3DJRSnHVYM2IQ6YGDgB744RGGBOor-Xy_R3kecSEu2WW1v9WmQwoq8OYh0uIdbDPqgDaafHRoHt_JJFpQWuKA' },
      isLimited: true,
      discount: null
    },
    {
      _id: '3',
      name: 'Midnight Noir Structured Abaya',
      price: 420.00,
      originalPrice: 480.00,
      mainImage: { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAkoeYinsrAYFrm33PWSK4gGb2-exp5bPH7mFH9QMgh2iJfi2HkwBzsZ4S1eKmUMvne8hsBW26hblFt6bOvg7Ev32x0rxVAjUxhke3Yfq_-lk88RlUHpWS5-o5iLFuB9aP277KmiwvDeF8611s6_4GP2auNs_2XmjwBmCU1MmKFweSoLkmj8Y6b0dmLf_fe7ngxNGkDRijYr73thf1RNyP0yKcxucEYMyWac7t8Lb7gBqBr0UHEtCZdzuHQWGxyvHES5k04DKH4g' },
      isLimited: true,
      discount: 12
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
    if (!activeTab) return source.slice(0, 3);
    return source.filter(p => p.category?.name === activeTab).slice(0, 3);
  }, [products, activeTab]);

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = String(product?._id || product?.id || "").trim();
    if (wishlistPendingIds.includes(productId)) return;
    const isWishlisted = wishlistItems.some((item) => String(item?._id || "") === productId);
    try {
      await dispatch(toggleWishlistItem(product)).unwrap();
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error(error || "Failed to update wishlist");
    }
  };

  const isProductWishlisted = (product) => {
    const productId = String(product?._id || product?.id || "").trim();
    return wishlistItems.some((item) => String(item?._id || "") === productId);
  };

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <p className="font-label-md text-secondary uppercase tracking-[0.3em] mb-2">Featured Selection</p>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-primary italic">Popular Products</h2>
          <p className="font-body-md text-on-surface-variant mt-2">Curated selection with a premium presentation from our live store.</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0 w-full md:w-auto">
          {uniqueCategories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveTab(cat)}
              className={`px-4 md:px-6 py-2 rounded-full font-label-sm whitespace-nowrap uppercase transition-colors ${activeTab === cat ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
            >
              {cat}
            </button>
          ))}
          {uniqueCategories.length === 0 && (
            <>
              <button className="px-4 md:px-6 py-2 rounded-full bg-primary text-white font-label-sm whitespace-nowrap">OUTERWEAR</button>
              <button className="px-4 md:px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm whitespace-nowrap">PANJABI</button>
              <button className="px-4 md:px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm whitespace-nowrap">T-SHIRTS</button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProducts.map((product) => (
          <div key={product._id} className="group bg-white rounded-lg shadow-sm overflow-hidden p-4 relative flex flex-col h-full border border-gray-100">
            <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] bg-surface-container rounded-lg overflow-hidden mb-4">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src={product.images?.[0] || product.image || product.mainImage?.url || "https://placehold.co/400x500?text=No+Image"} 
                alt={product.title || product.name}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isLimited && <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded">LIMITED</span>}
                {product.discount > 0 && <span className="bg-primary text-white text-[10px] px-2 py-1 rounded">-{product.discount}%</span>}
              </div>
              <button 
                onClick={(e) => handleToggleWishlist(e, product)} 
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-primary transition-all hover:scale-110 active:scale-95 z-20"
                style={{
                  color: isProductWishlisted(product) ? "#ef4444" : "#94a3b8"
                }}
              >
                <span 
                  className="material-symbols-outlined text-sm font-bold"
                  style={{
                    fontVariationSettings: isProductWishlisted(product) ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  favorite
                </span>
              </button>
            </Link>
            <div className="flex flex-col flex-grow">
              <Link to={`/product/${product._id}`}>
                <h3 className="font-label-md text-black font-bold mb-1 hover:text-primary transition-colors">{product.title || product.name}</h3>
              </Link>
              <p className="text-black font-headline-md mt-auto">
                Tk {product.price || product.basePrice}
                {(product.originalPrice || product.comparePrice) && (
                  <span className="text-on-surface-variant text-sm line-through ml-2">Tk {product.originalPrice || product.comparePrice}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
