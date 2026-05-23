import ProductDetails from "./ProductDetails";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaHeart,
  FaShare,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLink,
  FaPaperPlane,
  FaStar,
  FaYoutube,
  FaChevronLeft,
  FaChevronRight,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import { FiArrowLeft, FiHeart, FiShare2, FiShuffle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import SearchableSelect from "../../components/SearchableSelect";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import usePublicSettings from "../../hooks/usePublicSettings";
import StorefrontProductCard from "../components/StorefrontProductCard";
import ProductReviewsPanel from "../components/ProductReviewsPanel";
import {
  COMPARE_LIMIT_MESSAGE,
  MAX_COMPARE_ITEMS,
  toggleCompareItem,
} from "../../store/compareSlice";
import { addRecentlyViewedItem } from "../../store/recentlyViewedSlice";
import {
  selectWishlistPendingIds,
  toggleWishlistItem,
} from "../../store/wishlistSlice";
import { buildDataLayerItem, getDataLayerCurrency } from "../../utils/marketingDataLayer";
import { trackViewContent } from "../../utils/analyticsTracker";
import { createProductSnapshot } from "../../utils/productSnapshot";
import { isPublicStockVisible } from "../../utils/publicProduct";
import { applySeoMetadata } from "../../utils/seoManager";
import {
  applyMarketingTemplate,
  getActiveMarketingEntry,
} from "../../utils/marketingProfiles";
import {
  buildSelectedVariantLabel,
  getEffectiveProductPricing,
  getReadableColorLabel,
  getReadableVariantOptionLabel,
  getResolvedSelectedVariants,
  normalizeProductVariantDefinitions,
  normalizeSelectedVariantsPayload,
} from "../../utils/productVariants";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  normalizeProductVideoEntries,
  normalizeProductYouTubeUrls,
} from "../../utils/productMedia";
import { hasHtmlContent, stripHtml } from "../../utils/richText";

const baseUrl = import.meta.env.VITE_API_URL;
const VALID_PRODUCT_TABS = new Set(["description", "additional", "reviews"]);
const THUMBNAIL_VISIBLE_COUNT = 4;

const normalizeProductTabValue = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return VALID_PRODUCT_TABS.has(normalized) ? normalized : "";
};

const getStoredProductTab = (productId) => {
  if (typeof window === "undefined" || !productId) return "";
  try {
    const localStorageTab = normalizeProductTabValue(
      localStorage.getItem(`productTab_${productId}`),
    );
    if (localStorageTab) return localStorageTab;
    return normalizeProductTabValue(
      window.sessionStorage.getItem(`product-detail-tab:${productId}`),
    );
  } catch {
    return "";
  }
};

const resolveImageValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return resolveImageValue(value[0]);
  if (typeof value === "object") {
    return (
      value.data ||
      value.url ||
      value.secure_url ||
      value.src ||
      value.path ||
      ""
    );
  }
  return "";
};

const getFullImageUrl = (imagePath) => {
  const resolvedPath = resolveImageValue(imagePath);
  if (!resolvedPath) return null;
  if (
    resolvedPath.startsWith("http://") ||
    resolvedPath.startsWith("https://") ||
    resolvedPath.startsWith("data:")
  ) {
    return resolvedPath;
  }
  if (resolvedPath.startsWith("/")) {
    return baseUrl ? `${baseUrl}${resolvedPath}` : resolvedPath;
  }
  return baseUrl
    ? `${baseUrl}/uploads/products/${resolvedPath}`
    : `/uploads/products/${resolvedPath}`;
};

const FallbackImage = ({ className, alt }) => (
  <div className={`${className} bg-gray-100 flex items-center justify-center`}>
    <svg
      className="w-12 h-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span className="sr-only">{alt || "No image available"}</span>
  </div>
);

const ProductImage = ({ src, alt, className, isCurrent = false }) => {
  const [imgSrc, setImgSrc] = useState(getFullImageUrl(src));
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setImgSrc(getFullImageUrl(src));
    setHasError(false);
  }, [src]);
  const handleError = () => {
    setHasError(true);
    if (typeof src === "string" && src.startsWith("/uploads/products/")) {
      const altUrl = `${baseUrl}${src}`;
      if (altUrl !== imgSrc) {
        setImgSrc(altUrl);
        setHasError(false);
      }
    }
  };
  if (hasError || !imgSrc) {
    return <FallbackImage className={className} alt={alt} />;
  }
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={isCurrent ? "eager" : "lazy"}
      decoding="async"
      crossOrigin={
        imgSrc?.startsWith("http://") || imgSrc?.startsWith("https://")
          ? "anonymous"
          : undefined
      }
    />
  );
};

  const ProductSingle = () => {
    // Reuse original ProductDetails component for full functionality
    // This component simply forwards to the existing implementation
    return <ProductDetails />;
  };

  export default ProductSingle;
