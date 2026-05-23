import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp, FaRegClock } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import usePublicSettings from "../../hooks/usePublicSettings";
import { toPublicAssetUrl } from "../../utils/publicSettings";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

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
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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

  const safeCartCount = Number.isFinite(cartCount) ? cartCount : Number.parseInt(cartCount, 10) || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/categories/public`);
        if (response.data?.success) {
          // Filter out package categories if needed, or use all
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed && selectedCategory === "all") return;
    
    let searchUrl = "/shop?";
    if (trimmed) searchUrl += `search=${encodeURIComponent(trimmed)}&`;
    if (selectedCategory !== "all") searchUrl += `category=${selectedCategory}`;
    
    navigate(searchUrl);
    setQuery("");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "HOME", to: "/" },
    { label: "SHOP", to: "/shop" },
    { label: "ABOUT US", to: "/about-us" },
    { label: "CONTACT US", to: "/contact" },
  ];

  return (
    <header className={`app-layer-header sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
      {/* 1. Top Tier (Accent) */}
      

      {/* 2. Middle Tier (White) */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between py-4 gap-4 lg:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600"
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

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-3xl mx-auto items-center">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center border border-gray-300 rounded-full overflow-hidden bg-[#f9f9f9]"
            >
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-gray-600 text-sm px-4 py-2.5 outline-none border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors appearance-none max-w-[120px] truncate"
              >
                <option value="all">Category ∨</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none"
              />
              <button type="submit" className="px-5 text-gray-500 hover:text-black transition-colors">
                <FiSearch className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            <Link to="/login" className="text-gray-800 hover:text-secondary transition-colors border-r border-gray-300 pr-4 lg:pr-6">
              <FiUser className="w-6 h-6 lg:w-7 lg:h-7" />
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

        {/* Search Bar (Mobile) */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center border border-gray-300 rounded-full overflow-hidden bg-[#f9f9f9]"
            >
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none"
              />
              <button type="submit" className="px-5 text-gray-500">
                <FiSearch className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
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

      {/* Mobile Nav Links */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary text-on-primary flex flex-col">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              to={link.to}
              className={`px-4 py-3 text-sm font-semibold border-b border-white/10 ${isActive(link.to) ? 'text-white' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 py-3 flex items-center justify-center text-sm bg-black/10">
            <a href={`https://wa.me/${rawNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white/80 transition-colors">
              <FaWhatsapp className="w-5 h-5" />
              <span>{displayWhatsapp}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
