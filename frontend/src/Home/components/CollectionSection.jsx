import React from "react";

const CollectionSection = () => (
  <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto is-visible">
    <div className="text-center mb-16">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2 italic">
        Shop by Collection
      </h2>
      <div className="w-24 h-1 bg-secondary mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
      <div className="md:col-span-8 group relative overflow-hidden bg-surface-container rounded-lg card-hover">
        <img
          alt="Abayas"
          className="w-full h-full object-cover image-reveal"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5UUcKbUdBxJGzwt6Y6w0nC4lMl8SlYeApwDyertv7ysFFlCdOkSWc0wJbVE4g6vN3JWjtkCy6y5-Bd-81PGJkzEMUugcx71C28J1a18OPm52_qoQqmhwOpGV2ueTilMYqJa6rIqU3w-1LpdSgQZ20UQ2AaulNQblEVC4V1mcqsNQvi5LD8nuQ150XQ4heVAzQel1w87TxLyjTZ3k_CWkw2PaBQlJHrP0lLN3UIr0NjqXkd3eYp7vX9zNbdlDaktYYbcDgoIWHPg"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
        <div className="absolute bottom-10 left-10">
          <h3 className="font-headline-md text-headline-md text-white mb-2 italic">Abayas</h3>
          <a
            className="text-white font-label-md text-label-md border-b border-white pb-1 hover:text-secondary hover:border-secondary transition-colors"
            href="/shop?category=6a114ac25ff06c9c0c20cbd7"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="md:col-span-4 group relative overflow-hidden bg-surface-container rounded-lg card-hover">
        <img
          alt="Hijabs"
          className="w-full h-full object-cover image-reveal"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoVeEO8M2MibvoW5_7Yn6Zja7y0xjdos9XiGDILuw7rGFO8ivZSyie0Nv-6BkEkAEqCjgzFaTq50JU7-FISFBd0DWztbve6teas3j9C6pQH1CrAzDJvDQfnedozq1mlWFdgCxWV3BT2m-yU_DfvRN2WU68IgVkmUIoj9yIggcNR4rw3n6nbbBM5HN0VcsvfqwgvVS7AH99Pe5W8fp0ZkyIvTsqSTKpiHfkE5HSEeu7Z6L8ymFwa-1i8xytMjsWp2JuWJRsaHyNLA"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
        <div className="absolute bottom-10 left-10">
          <h3 className="font-headline-md text-headline-md text-white mb-2 italic">Hijabs</h3>
          <a
            className="text-white font-label-md text-label-md border-b border-white pb-1 hover:text-secondary hover:border-secondary transition-colors"
            href="/shop?category=6a114ac25ff06c9c0c20cbd8"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="md:col-span-12 group relative overflow-hidden bg-surface-container rounded-lg card-hover h-[300px]">
        <img
          alt="Evening Wear"
          className="w-full h-full object-cover image-reveal"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Y9BACFAc5nuRyVlBAmzaul1gpgRjJkPR_S03SiwzyR9__cP3GKVPZdpw-nFl5DHyobfq5u8oW_HnJtXyB-fFztBI5ugbKmTsDkwNwKctFtNZgcSiZBRx3CEz7xb_2704wlaKRG3mkB0_wFoqhUvuSFsP7ghgoAPTCkU87um465wwPOnKz48P82av0VirT0yNvF5StowDKURAOKe202dWuUHw3eUNEsoqadR5NTkfgRnCuKErAeTmroLKmZoMsCxL8Jgqs3SFNw"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-display-lg-mobile md:font-display-lg text-white mb-4 italic">Evening Wear</h3>
            <a
              className="inline-block bg-white text-primary font-label-md text-label-md px-8 py-3 rounded-lg hover:bg-secondary hover:text-white transition-colors"
              href="/shop?category=6a114ac25ff06c9c0c20cbdb"
            >
              Explore Occasion
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CollectionSection;
