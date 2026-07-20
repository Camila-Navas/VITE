/**
 * Theme manager
 * - Persists choice in localStorage
 * - Falls back to prefers-color-scheme when no saved preference
 * - Applies via data-theme on <html> (CSS variables only)
 */

const STORAGE_KEY = "catalog-theme";
const THEMES = ["light", "dark", "ocean", "forest", "sunset"];

let userChoseTheme = false;

/**
 * Resolve initial theme: localStorage → system preference → light
 */
export const resolveInitialTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && THEMES.includes(saved)) {
    userChoseTheme = true;
    return saved;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

/**
 * Apply theme to document
 * @param {string} theme
 * @param {{ persist?: boolean }} options
 */
export const setTheme = (theme, { persist = true } = {}) => {
  const next = THEMES.includes(theme) ? theme : "light";
  document.documentElement.setAttribute("data-theme", next);

  if (persist) {
    localStorage.setItem(STORAGE_KEY, next);
    userChoseTheme = true;
  }
};

export const getTheme = () =>
  document.documentElement.getAttribute("data-theme") || "light";

export const getThemes = () => [...THEMES];

/**
 * Boot theme system and listen for OS preference changes
 * (only when the user has not picked a theme manually)
 */
export const initTheme = () => {
  setTheme(resolveInitialTheme(), { persist: userChoseTheme });

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (e) => {
    if (userChoseTheme) return;
    setTheme(e.matches ? "dark" : "light", { persist: false });
  };

  if (media.addEventListener) {
    media.addEventListener("change", onChange);
  } else {
    media.addListener(onChange);
  }
};
