import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-surface pb-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg mb-4 italic">About Diamond Fashion Zone</h1>
        <p className="font-body-lg max-w-2xl mx-auto px-4 opacity-90">
          Your premier destination for modest wear and contemporary fashion, designed with elegance and comfort in mind.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline-lg text-primary mb-6 italic">Our Story</h2>
            <p className="font-body-md text-on-surface-variant mb-4">
              At Diamond Fashion Zone, we believe that fashion should be a reflection of your inner beauty and values. Founded with a passion for providing high-quality, stylish, and modest clothing, we have curated a collection that speaks to the modern individual.
            </p>
            <p className="font-body-md text-on-surface-variant mb-4">
              From elegant Abayas and Hijabs to comfortable everyday wear like Panjabis and T-Shirts, our mission is to empower you to express your unique style without compromising on comfort or modesty.
            </p>
            <Link to="/shop" className="inline-block mt-6 px-8 py-3 bg-secondary text-white font-label-md rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-300">
              Explore Our Collection
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src="https://placehold.co/800x600?text=Our+Story" alt="Our Story" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16 border-t border-surface-container">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline-lg text-primary mb-12 italic">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-surface-container rounded-xl shadow-sm border border-primary/5">
              <h3 className="font-title-lg text-primary mb-3">Quality</h3>
              <p className="font-body-sm text-on-surface-variant">We source only the finest fabrics and materials to ensure every piece is crafted to perfection.</p>
            </div>
            <div className="p-6 bg-surface-container rounded-xl shadow-sm border border-primary/5">
              <h3 className="font-title-lg text-primary mb-3">Modesty</h3>
              <p className="font-body-sm text-on-surface-variant">We celebrate modesty in fashion, offering designs that are both beautiful and respectful.</p>
            </div>
            <div className="p-6 bg-surface-container rounded-xl shadow-sm border border-primary/5">
              <h3 className="font-title-lg text-primary mb-3">Customer First</h3>
              <p className="font-body-sm text-on-surface-variant">Your satisfaction is our priority. We strive to provide an exceptional shopping experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
