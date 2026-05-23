// src/theme/LogoThemeProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import usePublicSettings from "../hooks/usePublicSettings";
// Dynamically import Vibrant (browser build) only when needed
const loadVibrant = async () => {
  const { Vibrant } = await import('node-vibrant/browser');
  return Vibrant;
};

// Context to expose theme colors if needed elsewhere
export const LogoThemeContext = createContext({});

/**
 * LogoThemeProvider extracts prominent colors from the site logo and sets CSS variables
 * on the document root. These variables are used throughout the app for dynamic theming.
 * Assumes the logo image is located at `/logo.png` (public folder) or any URL passed via `logoUrl`.
 */
const LogoThemeProvider = ({ children }) => {
  const { settings } = usePublicSettings();
  const logoUrl = settings?.website?.logoUrl || "/logo.png";
  const [theme, setTheme] = useState({});

  useEffect(() => {
    // Load image and extract palette
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = logoUrl;
        img.onload = async () => {
          try {
            const Vibrant = await loadVibrant();
            const palette = await Vibrant.from(img).getPalette();
        // Choose swatches (muted, vibrant, darkVibrant) with fallbacks
        const primary = palette.Vibrant?.hex || "#1d4ed8"; // default blue-700
        const secondary = palette.Muted?.hex || "#6b7280"; // gray-500
        const accent = palette.DarkVibrant?.hex || "#111827"; // gray-900
        const background = palette.LightVibrant?.hex || "#ffffff";
        // Apply to root CSS variables
        const root = document.documentElement;
        root.style.setProperty("--color-primary", primary);
        root.style.setProperty("--color-secondary", secondary);
        root.style.setProperty("--color-accent", accent);
        root.style.setProperty("--color-bg", background);
        // Map to existing brand/theme CSS variables for consistency
        root.style.setProperty("--brand-theme-color", primary);
        root.style.setProperty("--brand-button-text-color", secondary);
        root.style.setProperty("--brand-theme-shadow", `rgba(${parseInt(primary.slice(1,3),16)}, ${parseInt(primary.slice(3,5),16)}, ${parseInt(primary.slice(5,7),16)}, 0.24)`);
        root.style.setProperty("--app-surface", background);
        setTheme({ primary, secondary, accent, background });
      } catch (e) {
        console.error("Failed to extract logo colors", e);
      }
    };
    img.onerror = (e) => {
      console.error("Logo image failed to load", e);
    };
  }, [logoUrl]);

  return (
    <LogoThemeContext.Provider value={theme}>{children}</LogoThemeContext.Provider>
  );
};

export default LogoThemeProvider;
