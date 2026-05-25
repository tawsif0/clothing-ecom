import React from 'react';
import usePublicSettings from "../../hooks/usePublicSettings";

const BrandStory = () => {
  const { settings } = usePublicSettings();
  
  const subtitle = settings?.storefront?.brandStorySubtitle ?? "Our Heritage";
  const title = settings?.storefront?.brandStoryTitle ?? "Grace in every thread, power in every silhouette.";
  const description = settings?.storefront?.brandStoryDescription ?? "Diamond Fashion Zone was founded on the belief that modesty and high-fashion are not mutually exclusive. We curate pieces that empower the modern woman to express her identity through timeless elegance and impeccable craftsmanship.";
  const buttonText = settings?.storefront?.brandStoryButtonText ?? "Read Our Story";
  const buttonLink = settings?.storefront?.brandStoryButtonLink ?? "#";
  const image = settings?.storefront?.brandStoryImage ?? "https://lh3.googleusercontent.com/aida-public/AB6AXuARPRJY_u09rnHZca23IThEl9X13LRn6iuoHtwuc4tX9SxKUdeHRIrum27ug8_oUHVxopD1EW0wK4ooGIQnjF2Grj7jrgP5qTy6Qv4olVH2p7qEiCf0zh5AubBKOIxpNzmCnAMqBUxhvNAkbb7r5ZnGiPl_ItTtPqYRTZVnYOet-ucXjZUtx1TXAsHninZcZbRTe9dzkfLiJSnOfCoxPa0Fx9uuSnHgqZ7X1vR8jKzc5LBfgjHtKrzjB_1F0Gx_GCgU-OGI1eFNIQ";

  return (
    <section className="py-24 bg-surface-dim relative overflow-hidden">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <h4 className="font-label-md text-label-md text-secondary uppercase tracking-[0.3em] mb-6">{subtitle}</h4>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary italic mb-8">{title}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="order-1 md:order-2 relative">
          <div className="aspect-[4/5] bg-surface rounded-lg overflow-hidden shadow-2xl">
            <img 
              alt="Behind the scenes craftsmanship" 
              className="w-full h-full object-cover" 
              src={image}
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-lg hidden md:block"></div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
