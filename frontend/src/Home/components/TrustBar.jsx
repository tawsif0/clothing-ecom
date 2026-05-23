import React from 'react';

const TrustBar = () => {
  return (
    <section className="py-12 bg-surface-container-low border-y border-outline-variant/30">
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-3xl">public</span>
          <div>
            <p className="font-label-md text-label-md text-primary">Global Shipping</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Worldwide Delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-3xl">workspace_premium</span>
          <div>
            <p className="font-label-md text-label-md text-primary">Premium Quality</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Handpicked Fabrics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-3xl">verified_user</span>
          <div>
            <p className="font-label-md text-label-md text-primary">Secure Payments</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">100% Protected</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-3xl">support_agent</span>
          <div>
            <p className="font-label-md text-label-md text-primary">Elite Support</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">24/7 Assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
