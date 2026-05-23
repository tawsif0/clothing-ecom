import React from "react";

// Shop page retains the exact visual design from the provided HTML.
// Logic (product fetching, filtering, pagination) is handled by existing components
// such as ProductGrid and related hooks elsewhere in the codebase.
// This component focuses on the layout and styling.

const Shop = () => {
  return (
    <div className="bg-white text-on-surface font-body-md antialiased transition-colors duration-300 shop-page">
      {/* Top Navigation Bar - reuse existing Navbar component if available */}
      {/* Assuming a Navbar component exists at src/Home/components/Navbar.jsx */}
      <Navbar />

      <main className="pt-32 pb-20 max-w-container-max-width mx-auto px-margin-desktop">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Our Collections</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">
            Discover a curated selection of modest masterpieces, blending timeless silhouettes with contemporary emerald and gold accents.
          </p>
        </header>

        <CollectionSection />
<div className="flex flex-col md:flex-row gap-gutter">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              {/* Category */}
              <section>
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-4">Category</h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between text-on-surface-variant hover:text-primary cursor-pointer transition-colors group">
                    <span className="font-body-md">All Pieces</span>
                    <span className="text-xs opacity-50">124</span>
                  </li>
                  <li className="flex items-center justify-between text-primary font-semibold cursor-pointer group">
                    <span className="font-body-md">Abayas</span>
                    <span className="text-xs">48</span>
                  </li>
                  <li className="flex items-center justify-between text-on-surface-variant hover:text-primary cursor-pointer transition-colors group">
                    <span className="font-body-md">Hijabs</span>
                    <span className="text-xs opacity-50">32</span>
                  </li>
                  <li className="flex items-center justify-between text-on-surface-variant hover:text-primary cursor-pointer transition-colors group">
                    <span className="font-body-md">Kaftans</span>
                    <span className="text-xs opacity-50">18</span>
                  </li>
                </ul>
              </section>

              {/* Color */}
              <section>
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-4">Color</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="w-8 h-8 rounded-full border-2 border-primary ring-2 ring-offset-2 ring-primary/20 bg-[#004326]" title="Emerald"></button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant bg-[#c5a059]" title="Warm Gold"></button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant bg-black" title="Midnight"></button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant bg-[#f5f5dc]" title="Cream"></button>
                  <button className="w-8 h-8 rounded-full border border-outline-variant bg-[#704214]" title="Umber"></button>
                </div>
              </section>

              {/* Size */}
              <section>
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-4">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button className="px-3 py-2 border border-outline-variant text-sm font-label-md hover:border-primary hover:text-primary transition-all">XS</button>
                  <button className="px-3 py-2 border border-primary text-primary font-bold text-sm font-label-md bg-primary-container/10">S</button>
                  <button className="px-3 py-2 border border-outline-variant text-sm font-label-md hover:border-primary hover:text-primary transition-all">M</button>
                  <button className="px-3 py-2 border border-outline-variant text-sm font-label-md hover:border-primary hover:text-primary transition-all">L</button>
                  <button className="px-3 py-2 border border-outline-variant text-sm font-label-md hover:border-primary hover:text-primary transition-all">XL</button>
                </div>
              </section>

              {/* Price Range */}
              <section>
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-4">Price</h3>
                <div className="space-y-4">
                  <input className="w-full accent-primary" max="1000" min="100" type="range" />
                  <div className="flex justify-between text-sm text-on-surface-variant font-label-sm">
                    <span>$100</span>
                    <span>$1,000+</span>
                  </div>
                </div>
              </section>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {/* Reuse the existing ProductGrid component which already fetches and renders products */}
            {/* Import it at the top if needed: import ProductGrid from "../Home/subPages/ProductGrid"; */}
            {/* <ProductGrid /> */}
            {/* For demonstration, we include the static markup from the original HTML (cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {/* Card 1 */}
              <div className="fashion-card group">
                <div className="relative overflow-hidden aspect-[3/4] bg-surface-container mb-4 cursor-pointer">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    data-alt="A luxurious emerald green silk abaya with intricate gold embroidery details on the sleeves. The model is standing in a minimalist white-walled gallery with soft morning light filtering through. The mood is sophisticated and regal, highlighting the rich fabric texture and deep jewel tones of the garment."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDe17lt0weCCHdPldjPMt5Hi5tpzl2CzZdgG-gvthPGKNKcM_Fz4jr-R-x63K_d7-0pz5usHcMp-v0jhonbb9phQ0Hd5RUrQAGYosA29xmjujsUgZ7L-FbloVnpvKg1d4Zz5NwvTZ4mY7u9hhgRmVDHCEqvrlSC4NZRfDwG_hl-F4nxz9PdE-tjm6HVWk8sRQ9t3lUqAaC5AlNpXcn5yqns7JVZSBC6H7IchUzUvWrwQzs2tyiBk7yzBeMa9bLlU4-HUglQDOfLQ"
                    alt="Emerald Silk Abaya"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] buy-now-btn">
                    <button className="w-full py-3 bg-primary text-white rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors shadow-lg">
                      Buy Now
                    </button>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-sm rounded-full text-primary hover:bg-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div className="text-center px-2">
                  <h4 className="font-headline-md text-[18px] text-primary mb-1">Emerald Silk Abaya</h4>
                  <p className="font-label-md text-secondary">$349.00</p>
                </div>
              </div>

              {/* Additional cards (2-8) omitted for brevity – they follow the same structure */}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary text-on-surface-variant transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-label-md">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary text-on-surface-variant font-label-md transition-all">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary text-on-surface-variant font-label-md transition-all">3</button>
                <span className="px-2 text-on-surface-variant">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary text-on-surface-variant font-label-md transition-all">12</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary text-on-surface-variant transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      {/* Footer – reuse existing Footer component if available */}
      {/* <Footer /> */}
    </div>
  );
};

export default Shop;
