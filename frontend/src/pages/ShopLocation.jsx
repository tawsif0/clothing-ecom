import React from "react";

// Custom shop-location page – a personalized design variant of the Shop page.
// Reuses existing components (Navbar, Footer, ProductGrid) but adds a hero banner
// with a gradient background, animated headline, and a distinct layout.

const ShopLocation = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-fixed/30 text-on-surface font-body-md antialiased transition-colors duration-300 min-h-screen">
      {/* Navbar */}
      {/* Assuming Navbar is lazy-loaded in PublicLayout; we directly include it here for simplicity */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="pt-32 pb-20 max-w-container-max-width mx-auto px-margin-desktop text-center">
        <h1 className="font-display-lg text-headline-lg text-white mb-4 animate-fade-in">
          Explore Our Exclusive Collections
        </h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Hand‑picked pieces curated for you. Dive into a world of elegance, heritage, and modern style.
        </p>
      </section>
        {/* Shop Location Info */}
          <section className="py-12 bg-surface/90 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="font-display-lg text-headline-lg text-primary mb-4">Our Store Location</h2>
              <p className="font-body-md text-on-surface-variant mb-6">
                123 Fashion Avenue, Dhaka, Bangladesh<br />
                Open Hours: Mon‑Fri 10:00‑20:00, Sat‑Sun 11:00‑18:00
              </p>
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902352342578!2d90.39278481536444!3d23.75090309454196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85f2a5a9b7d%3A0x9e7c0c9c5a1c5e6b!2sDhaka%20Mall!5e0!3m2!1sen!2sbd!4v1727077200000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{border:0}}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>

      {/* Main Content – reuse the existing ProductGrid layout */}
      <main className="flex flex-col md:flex-row gap-gutter max-w-container-max-width mx-auto px-margin-desktop">
        {/* Sidebar Filters – same as Shop but with a translucent backdrop */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-10 bg-surface/80 backdrop-blur-sm p-4 rounded-lg">
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
                <li className="flex items-center justify-between text-on-surface-variant hover:text-primary cursor-pointer group">
                  <span className="font-body-md">Hijabs</span>
                  <span className="text-xs opacity-50">32</span>
                </li>
                <li className="flex items-center justify-between text-on-surface-variant hover:text-primary cursor-pointer group">
                  <span className="font-body-md">Kaftans</span>
                  <span className="text-xs opacity-50">18</span>
                </li>
              </ul>
            </section>
            {/* Additional filters (Color, Size, Price) could be added similarly */}
          </div>
        </aside>

        {/* Product Grid – using the lazy‑loaded ProductGrid component */}
        <div className="flex-grow">
          {/* The existing ProductGrid component handles fetching and rendering */}
          {/* Ensure it is imported where this page is used (e.g., via PublicLayout) */}
          {/* <ProductGrid /> */}
          {/* For demo purposes we keep a placeholder grid similar to the original Shop HTML */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Card 1 – sample static card */}
            <div className="fashion-card group">
              <div className="relative overflow-hidden aspect-[3/4] bg-surface-container mb-4 cursor-pointer">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
</div>
            </div>
          </div>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default ShopLocation;
