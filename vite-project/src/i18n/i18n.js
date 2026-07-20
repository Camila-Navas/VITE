/**
 * Lightweight i18n — no external libs.
 * Usage: t('products.title') | data-i18n="products.title" in HTML
 */

import { translations } from "./translations.js";

const STORAGE_KEY = "catalog-lang";
const SUPPORTED = ["es", "en"];

let currentLang = "es";
const listeners = new Set();

const getNested = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), obj);

/**
 * Resolve initial language: localStorage → browser → es
 */
export const resolveInitialLang = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;

  const browser = (navigator.language || "es").toLowerCase();
  return browser.startsWith("es") ? "es" : "en";
};

export const getLang = () => currentLang;

export const getSupportedLangs = () => [...SUPPORTED];

/**
 * Translate a key path. Returns the key if missing (helps debugging).
 * @param {string} key
 * @param {Record<string, string>} [vars]
 */
export const t = (key, vars = {}) => {
  const value = getNested(translations[currentLang], key);
  if (value == null) return key;

  return String(value).replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] != null ? String(vars[name]) : `{${name}}`
  );
};

/**
 * Apply translations to elements with data-i18n / data-i18n-attr
 * @param {ParentNode} [root=document]
 */
export const applyTranslations = (root = document) => {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });

  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });

  root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (!key) return;
    el.setAttribute("aria-label", t(key));
  });

  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (!key) return;
    el.setAttribute("title", t(key));
  });
};

export const onLanguageChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/**
 * Set language, persist, update <html lang>, notify listeners, re-apply DOM
 * @param {string} lang
 */
export const setLang = (lang) => {
  const next = SUPPORTED.includes(lang) ? lang : "es";
  currentLang = next;
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next;
  document.title = `${t("brand")} — ${t("footer.copy")}`;
  applyTranslations(document);
  listeners.forEach((fn) => fn(next));
};

export const initI18n = () => {
  currentLang = resolveInitialLang();
  document.documentElement.lang = currentLang;
  document.title = `${t("brand")} — ${t("footer.copy")}`;
  applyTranslations(document);
};
