import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiHeart, FiPackage, FiGrid, FiChevronDown, FiArrowRight, FiLogOut, FiShuffle } from "react-icons/fi";
import { FaWhatsapp, FaRegClock } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useSelector } from "react-redux";
import { selectWishlistCount } from "../../store/wishlistSlice";
import usePublicSettings from "../../hooks/usePublicSettings";
import { toPublicAssetUrl } from "../../utils/publicSettings";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const normalizeThemeColor = (value) =>
  /^#[0-9a-f]{6}$/i.test(String(value || "").trim())
    ? String(value).trim()
    : "#000000";

const hexToRgba = (value, alpha) => {
  const normalized = normalizeThemeColor(value);
  const r = Number.parseInt(normalized.slice(1, 3), 16);
  const g = Number.parseInt(normalized.slice(3, 5), 16);
  const b = Number.parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(to);
  };
  const { settings } = usePublicSettings();
  const { cartCount } = useCart();
  const wishlistCount = useSelector(selectWishlistCount);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuTab, setMobileMenuTab] = useState("menu");
  const [scrolled, setScrolled] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Category");

  const searchRef = useRef(null);
  const categoryRef = useRef(null);
  const timeoutRef = useRef(null);

  const normalizeOrderLookup = (value) =>
    String(value || "")
      .trim()
      .replace(/^order\s*#?\s*/i, "")
      .replace(/^#/, "")
      .trim();

  useEffect(() => {
    const syncUser = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      setLoggedIn(Boolean(token));
      if (!userData) {
        setUserName("");
        return;
      }
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || user.email?.split("@")[0] || "User");
      } catch (_error) {
        setUserName("User");
      }
    };

    syncUser();
    window.addEventListener("userLoggedIn", syncUser);
    window.addEventListener("userLoggedOut", syncUser);
    return () => {
      window.removeEventListener("userLoggedIn", syncUser);
      window.removeEventListener("userLoggedOut", syncUser);
    };
  }, []);

  const loadSuggestions = async (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    try {
      const normalizedOrderQuery = normalizeOrderLookup(trimmed);
      const [productResponse, orderResponse] = await Promise.allSettled([
        axios.get(`${baseUrl}/products/public/suggestions`, {
          params: { query: trimmed, limit: 8 },
        }),
        normalizedOrderQuery.length >= 3
          ? axios.get(`${baseUrl}/orders/search`, {
              params: { query: normalizedOrderQuery },
            })
          : Promise.resolve({ data: { suggestions: [] } }),
      ]);

      const productPayload =
        productResponse.status === "fulfilled"
          ? productResponse.value.data
          : {};
      const orderPayload =
        orderResponse.status === "fulfilled" ? orderResponse.value.data : {};

      let products = Array.isArray(productPayload?.suggestions?.products)
        ? productPayload.suggestions.products.map((item) => ({
            ...item,
            resultType: "product",
          }))
        : [];
      const nextCategories = Array.isArray(
        productPayload?.suggestions?.categories,
      )
        ? productPayload.suggestions.categories.map((item) => ({
            ...item,
            resultType: "category",
          }))
        : [];
      const orders = Array.isArray(orderPayload?.suggestions)
        ? orderPayload.suggestions.map((item) => ({
            ...item,
            resultType: "order",
          }))
        : [];

      // Apply client-side category filtering if a specific category is selected in the dropdown
      if (selectedCategory && selectedCategory !== "all") {
        products = products.filter(
          (p) => p.category?._id === selectedCategory || p.category === selectedCategory
        );
      }

      const prioritizeOrders = /^ord-/i.test(normalizedOrderQuery);
      setSuggestions(
        prioritizeOrders
          ? [...orders, ...products, ...nextCategories]
          : [...products, ...nextCategories, ...orders],
      );
    } catch (error) {
      console.error("Suggestions failed", error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
    timeoutRef.current = setTimeout(() => loadSuggestions(value), 180);
  };
  
  const website = settings?.website || {};
  const social = settings?.social || {};
  const contact = settings?.contact || {};
  const whatsappNumber = String(social?.whatsapp || contact?.phone1 || "01337870250").trim();
  const rawNumber = whatsappNumber.replace(/^.*wa\.me\//, '').replace(/[^0-9]/g, '');
  const displayWhatsapp = rawNumber.startsWith('8801') ? rawNumber.slice(2) : rawNumber;
  const storeName = String(website?.storeName || "").trim() || "Cross Culture";
  const logoMode = String(website?.logoMode || "image").toLowerCase();
  const logo = logoMode === "image" ? toPublicAssetUrl(website?.logoUrl || "") : "";
  const brandLogoText = String(website?.logoText || "").trim() || storeName;

  const accent = normalizeThemeColor(website?.themeColor || "#1C4CB3");
  const accentSoft = hexToRgba(accent, 0.08);
  const accentBorder = hexToRgba(accent, 0.22);
  const accentShadow = hexToRgba(accent, 0.28);

  const safeCartCount = Number.isFinite(cartCount) ? cartCount : Number.parseInt(cartCount, 10) || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/categories/public`);
        if (response.data?.success) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setShowSuggestions(false);
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    let navigatedToOrder = false;
    const normalizedOrderQuery = normalizeOrderLookup(trimmed);

    if (normalizedOrderQuery.length >= 3) {
      try {
        const response = await axios.get(`${baseUrl}/orders/search`, {
          params: { query: normalizedOrderQuery },
        });
        const orderSuggestions = Array.isArray(response.data?.suggestions)
          ? response.data.suggestions
          : [];
        const exactOrderMatch = orderSuggestions.find(
          (item) =>
            String(item?.orderNumber || "")
              .trim()
              .toLowerCase() === normalizedOrderQuery.toLowerCase(),
        );
        if (exactOrderMatch?.orderNumber) {
          navigate(
            `/track-order/${encodeURIComponent(exactOrderMatch.orderNumber)}`,
          );
          navigatedToOrder = true;
        }
      } catch (error) {
        navigatedToOrder = false;
      }
    }

    if (!navigatedToOrder) {
      let searchUrl = "/shop?";
      if (trimmed) searchUrl += `search=${encodeURIComponent(trimmed)}&`;
      if (selectedCategory !== "all") searchUrl += `category=${selectedCategory}`;
      navigate(searchUrl);
    }
    setQuery("");
    setShowSuggestions(false);
    setMobileMenuOpen(false);
  };

  const handleMobileRouteClick = () => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileMenuTab("menu");
    setShowSuggestions(false);
  };

  const handleCategoryClick = (id) => {
    navigate(`/shop?category=${id}`);
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    window.dispatchEvent(new CustomEvent("userLoggedOut"));
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "SHOP", to: "/shop" },
    { label: "CONTACT US", to: "/contact" },
  ];

  const visibleCategories = categories.filter(
    (category) => (category?.type || "").toLowerCase() !== "package"
  );

  return (
    <header className={`app-layer-header sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
      {/* Middle Tier (White) */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-4 gap-4 lg:gap-8">
          
          {/* Logo & Mobile Menu Toggle Group */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              {logo ? (
                <img src={logo} alt={storeName} className="h-10 lg:h-14 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-primary tracking-wider">
                  {brandLogoText}
                </span>
              )}
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-3xl mx-auto items-center relative">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center border border-gray-200 rounded-full bg-slate-50 shadow-xs relative transition-all duration-300 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-md"
            >
              {/* Custom Category Dropdown */}
              <div ref={categoryRef} className="relative border-r border-gray-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center gap-1.5 bg-transparent text-slate-700 text-sm px-4 py-2.5 outline-none cursor-pointer hover:bg-slate-100/60 transition-all font-semibold min-w-[135px] justify-between h-11 rounded-l-full"
                >
                  <span className="truncate max-w-[90px]">{selectedCategoryName}</span>
                  <FiChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                
                {categoryDropdownOpen && (
                  <div className="absolute left-0 mt-2 z-[11040] w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-64 overflow-y-auto p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("all");
                          setSelectedCategoryName("Category");
                          setCategoryDropdownOpen(false);
                        }}
                        className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm transition font-medium"
                        style={
                          selectedCategory === "all"
                            ? { backgroundColor: accentSoft, color: accent, fontWeight: "bold" }
                            : { color: "#334155" }
                        }
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat._id);
                            setSelectedCategoryName(cat.name);
                            setCategoryDropdownOpen(false);
                          }}
                          className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm transition font-medium"
                          style={
                            selectedCategory === cat._id
                              ? { backgroundColor: accentSoft, color: accent, fontWeight: "bold" }
                              : { color: "#334155" }
                          }
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Search products, categories, or order ID..."
                value={query}
                onChange={handleSearchChange}
                onFocus={() => query.trim() && setShowSuggestions(true)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none h-11 text-slate-800 placeholder-slate-400"
              />
              <button type="submit" className="px-5 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
                <FiSearch className="w-5 h-5" />
              </button>
            </form>

            {/* Suggestions Overlay */}
            {showSuggestions && query.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[11030] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto p-2">
                    {suggestions.map((item) => {
                      const key = `${item.resultType}-${item._id || item.orderNumber}`;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            navigate(
                              item.resultType === "product"
                                ? `/product/${item._id}`
                                : item.resultType === "order"
                                  ? `/track-order/${encodeURIComponent(item.orderNumber)}`
                                  : `/shop?category=${item._id}`
                            );
                            setQuery("");
                            setShowSuggestions(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: accentSoft, color: accent }}
                          >
                            {item.resultType === "product" ? (
                              <FiShoppingBag className="h-5 w-5" />
                            ) : item.resultType === "order" ? (
                              <FiPackage className="h-5 w-5" />
                            ) : (
                              <FiGrid className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.resultType === "product"
                                ? item.title
                                : item.resultType === "order"
                                  ? item.orderNumber
                                  : item.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {item.resultType === "product"
                                ? item.brand || "Product"
                                : item.resultType === "order"
                                  ? `${item.status || "Order"}${item.productName ? ` - ${item.productName}` : ""}`
                                  : item.type || "Category"}
                            </p>
                          </div>
                          <FiArrowRight className="h-4 w-4 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center text-sm text-slate-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {loggedIn ? (
              <Link to="/dashboard" className="text-gray-800 hover:text-secondary transition-colors border-r border-gray-300 pr-4 lg:pr-6" title="Dashboard">
                <FiUser className="w-6 h-6 lg:w-7 lg:h-7" />
              </Link>
            ) : (
              <Link to="/login" className="text-gray-800 hover:text-secondary transition-colors border-r border-gray-300 pr-4 lg:pr-6" title="Login">
                <FiUser className="w-6 h-6 lg:w-7 lg:h-7" />
              </Link>
            )}
            <Link to="/wishlist" className="relative text-gray-800 hover:text-secondary transition-colors" title="Wishlist">
              <FiHeart className="w-6 h-6 lg:w-7 lg:h-7" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-800 hover:text-secondary transition-colors">
              <FiShoppingBag className="w-6 h-6 lg:w-7 lg:h-7" />
              {safeCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {safeCartCount > 99 ? "99+" : safeCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bottom Tier (Theme Navigation) */}
      <div className="bg-primary text-on-primary hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex justify-between items-center h-12">
          {/* Nav Links */}
          <nav className="flex items-center h-full">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.to} 
                className={`flex items-center h-full px-5 text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors ${isActive(link.to) ? 'text-white' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href={`https://wa.me/${rawNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <FaWhatsapp className="w-5 h-5" />
              <span>{displayWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide-in Mobile Side Menu Drawer (Designed like Axon) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="app-layer-drawer-overlay fixed inset-0 bg-slate-950/40 z-[127900]"
              aria-label="Close menu overlay"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.24 }}
              className="app-layer-drawer fixed inset-y-0 left-0 w-[88vw] max-w-sm border-r border-gray-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.15)] z-[128000] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <Link
                  to="/"
                  onClick={handleMobileRouteClick}
                  className="flex min-w-0 items-center overflow-hidden"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={storeName}
                      className="h-8 w-auto max-w-39 object-contain"
                    />
                  ) : (
                    <p
                      className="truncate text-lg font-bold tracking-tight"
                      style={{ color: accent }}
                    >
                      {brandLogoText}
                    </p>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-slate-50 text-slate-700 shadow-xs hover:bg-slate-100 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs Selector */}
              <div className="grid grid-cols-2 border-b border-gray-100 bg-slate-50/50 p-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuTab("menu")}
                  className="h-11 rounded-xl text-sm font-semibold tracking-wide transition-all"
                  style={
                    mobileMenuTab === "menu"
                      ? { backgroundColor: "#ffffff", color: "#0f172a", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)" }
                      : { color: "#64748b" }
                  }
                >
                  Menu
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuTab("categories")}
                  className="h-11 rounded-xl text-sm font-semibold tracking-wide transition-all"
                  style={
                    mobileMenuTab === "categories"
                      ? { backgroundColor: "#ffffff", color: "#0f172a", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)" }
                      : { color: "#64748b" }
                  }
                >
                  Categories
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                {mobileMenuTab === "categories" ? (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Categories
                      </h3>
                      <Link
                        to="/shop"
                        onClick={handleMobileRouteClick}
                        className="text-xs font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-900 transition-colors"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="space-y-2.5">
                      {visibleCategories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => handleCategoryClick(category._id)}
                          className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-slate-50/40 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                          <span className="truncate">{category.name}</span>
                          <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                            {category.type || "General"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {navLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={handleMobileRouteClick}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-slate-50/40 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                      >
                        <span>{item.label}</span>
                        <FiArrowRight className="h-4 w-4 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom footer action area */}
              <div className="border-t border-gray-100 p-5 bg-slate-50/50">
                {loggedIn ? (
                  <div className="grid grid-cols-[1fr_48px] gap-3">
                    <Link
                      to="/dashboard"
                      onClick={handleMobileRouteClick}
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-slate-600 hover:text-red-600 hover:border-red-200 shadow-xs transition-colors"
                      title="Logout"
                    >
                      <FiLogOut className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      to="/login"
                      onClick={handleMobileRouteClick}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                      style={{
                        backgroundColor: accent,
                        boxShadow: `0 4px 12px ${accentShadow}`,
                      }}
                    >
                      <FiUser className="h-4 w-4" />
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
