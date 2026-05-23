import React from 'react';

const HomeNewsletter = () => {
  return (
    <section className="py-24 bg-primary text-on-primary overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="max-w-2xl mx-auto px-margin-mobile text-center relative z-10">
        <h2 className="font-display-lg-mobile md:font-headline-lg text-display-lg-mobile md:text-headline-lg mb-6 italic">Join the Inner Circle</h2>
        <p className="font-body-lg text-body-lg mb-10 opacity-80">Be the first to experience our new collections and receive exclusive invitations to our private events.</p>
        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            className="flex-grow bg-transparent border-b-2 border-on-primary/30 py-4 px-2 focus:outline-none focus:border-secondary transition-colors placeholder:text-on-primary/50 font-body-md" 
            placeholder="Your Email Address" 
            type="email"
          />
          <button 
            className="bg-secondary text-white px-10 py-4 rounded-lg font-label-md text-label-md uppercase tracking-widest hover:bg-on-secondary-container transition-colors" 
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default HomeNewsletter;
