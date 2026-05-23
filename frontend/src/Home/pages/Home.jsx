import React, { useEffect, useMemo, useState } from "react";
import NewHeroSection from "../components/NewHeroSection";
import TrustedBrands from "../components/TrustedBrands";
import TrustBar from "../components/TrustBar";
import CategoryBentoGrid from "../components/CategoryBentoGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import HotDeals from "../components/HotDeals";
import BrandStory from "../components/BrandStory";
import LatestProductsOffset from "../components/LatestProductsOffset";
import usePublicSettings from "../../hooks/usePublicSettings";
import { formatDocumentTitle } from "../../utils/publicSettings";
import { applySeoMetadata } from "../../utils/seoManager";
import { fetchHomeCatalog } from "../../utils/homeCatalog";
import DynamicCollectionSection from "../components/DynamicCollectionSection";
import {
  applyMarketingTemplate,
  getActiveMarketingEntry,
} from "../../utils/marketingProfiles";

const resolveSectionProducts = (section) => {
  if (!section || !Array.isArray(section.categories)) {
    return [];
  }
  return section.categories.flatMap((category) =>
    Array.isArray(category?.products) ? category.products : [],
  );
};

const Home = () => {
  const { settings } = usePublicSettings();
  const [catalog, setCatalog] = useState(null);

  // SEO effect
  useEffect(() => {
    if (!settings) return;

    const website = settings?.website || {};
    const seo = settings?.seo || {};
    const pageSeo = settings?.seoAnalytics?.pages?.home || {};
    const hasExplicitEntries = Boolean(settings?.seoAnalytics?.hasExplicitEntries);
    const seoEntry = getActiveMarketingEntry(settings, {
      type: "seo",
      pathname: "/",
    });
    const storeName =
      String(website.storeName || "E-Commerce").trim() || "E-Commerce";

    applySeoMetadata({
      title: formatDocumentTitle(
        settings,
        applyMarketingTemplate(seoEntry?.metaTitle, {
          storeName,
          pageName: "Home",
        }) ||
          (!hasExplicitEntries ? pageSeo.metaTitle : "") ||
          (!hasExplicitEntries ? seo.metaTitle : "") ||
          "Home",
      ),
      description: String(
        applyMarketingTemplate(seoEntry?.metaDescription, {
          storeName,
          pageName: "Home",
        }) ||
          (!hasExplicitEntries ? pageSeo.metaDescription : "") ||
          (!hasExplicitEntries ? seo.metaDescription : "") ||
          website.tagline ||
          "",
      ).trim(),
      keywords: String(
        applyMarketingTemplate(seoEntry?.metaKeywords, {
          storeName,
          pageName: "Home",
        }) ||
          (!hasExplicitEntries ? pageSeo.metaKeywords : "") ||
          (!hasExplicitEntries ? seo.metaKeywords : "") ||
          "",
      ).trim(),
      image: String(
        applyMarketingTemplate(seoEntry?.openGraphImage, {
          storeName,
          pageName: "Home",
        }) ||
          (!hasExplicitEntries ? pageSeo.openGraphImage : "") ||
          (!hasExplicitEntries ? seo.openGraphImage : "") ||
          website.headerIconUrl ||
          website.logoUrl ||
          "",
      ).trim(),
      url: typeof window !== "undefined" ? window.location.href : "",
      siteName: storeName,
    });
  }, [settings]);

  // Fetch catalog data
  useEffect(() => {
    let active = true;
    fetchHomeCatalog().then((nextCatalog) => {
      if (active) {
        setCatalog(nextCatalog);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const sectionProducts = useMemo(() => {
    const popular = resolveSectionProducts(catalog?.sections?.Popular);
    const hotDeals = resolveSectionProducts(catalog?.sections?.["Hot deals"]);
    const general = resolveSectionProducts(catalog?.sections?.General);
    const latest = resolveSectionProducts(catalog?.sections?.Latest);

    // Provide robust fallbacks if the user hasn't explicitly set product types
    return {
      Popular: popular.length > 0 ? popular : general.slice(0, 3),
      "Hot deals": hotDeals.length > 0 ? hotDeals : general.slice(3, 5),
      General: general,
      Latest: latest.length > 0 ? latest : general.slice(5, 7),
    };
  }, [catalog]);

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden">
      <NewHeroSection />
      {settings?.storefront?.showBrandMarquee !== false && <TrustedBrands />}
      <TrustBar />
      <CategoryBentoGrid />
      <FeaturedProducts products={sectionProducts.Popular} />
      <HotDeals products={sectionProducts["Hot deals"]} />
      <BrandStory />
      <LatestProductsOffset products={sectionProducts.Latest} />
      
      {/* Trust Indicators Footer Top */}
      <section className="py-12 bg-white border-t border-surface-container">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
            <div>
              <p className="font-bold text-sm">Fast Shipping</p>
              <p className="text-xs text-on-surface-variant">Smooth delivery flow</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">undo</span>
            <div>
              <p className="font-bold text-sm">Easy Returns</p>
              <p className="text-xs text-on-surface-variant">Simple return support</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">sell</span>
            <div>
              <p className="font-bold text-sm">Offers And Discounts</p>
              <p className="text-xs text-on-surface-variant">Fresh deals for shoppers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">headset_mic</span>
            <div>
              <p className="font-bold text-sm">Customer Support</p>
              <p className="text-xs text-on-surface-variant">Help when you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
