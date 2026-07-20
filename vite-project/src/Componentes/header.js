/**
 * Sticky site header: brand, nav, theme/lang selectors, mobile menu.
 */

import { t, getLang, setLang, getSupportedLangs, onLanguageChange } from "../i18n/i18n.js";
import { getTheme, setTheme, getThemes } from "../theme/theme.js";

const headerEl = document.querySelector("#header");

/** Build and mount the header chrome */
export const renderHeader = () => {
  if (!headerEl) return;

  headerEl.className = "site-header";
  headerEl.innerHTML = `
    <div class="container site-header__inner">
      <a href="#productos" class="site-header__brand">
        <span class="site-header__brand-mark" data-i18n="brandShort">C</span>
        <span class="site-header__brand-text" data-i18n="brand">Catálogo</span>
      </a>

      <button
        type="button"
        class="site-header__toggle"
        id="nav-toggle"
        aria-expanded="false"
        aria-controls="site-nav-panel"
        data-i18n-aria-label="controls.menuOpen"
      >
        <svg class="site-header__toggle-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="site-header__panel" id="site-nav-panel">
        <nav class="site-header__nav" id="site-nav" data-i18n-aria-label="nav.label" aria-label="Navegación">
          <ul class="menu" role="list">
            <li>
              <a href="#productos" class="menu__link" data-nav="productos" data-i18n="nav.products">Productos</a>
            </li>
            <li>
              <a href="#categorias" class="menu__link" data-nav="categorias" data-i18n="nav.categories">Categorías</a>
            </li>
          </ul>

          <div class="site-header__controls">
            <div class="control-group">
              <label class="control-group__label" for="theme-select" data-i18n="controls.theme">Tema</label>
              <select id="theme-select" class="control-select"></select>
            </div>
            <div class="control-group">
              <label class="control-group__label" for="lang-select" data-i18n="controls.language">Idioma</label>
              <select id="lang-select" class="control-select"></select>
            </div>
          </div>
        </nav>
      </div>
    </div>
  `;

  populateThemeSelect();
  populateLangSelect();
  bindEvents();
  updateActiveNav();
};

const populateThemeSelect = () => {
  const select = document.querySelector("#theme-select");
  if (!select) return;

  const current = getTheme();
  select.innerHTML = getThemes()
    .map(
      (id) =>
        `<option value="${id}" ${id === current ? "selected" : ""}>${t(`controls.themes.${id}`)}</option>`
    )
    .join("");
};

const populateLangSelect = () => {
  const select = document.querySelector("#lang-select");
  if (!select) return;

  const current = getLang();
  select.innerHTML = getSupportedLangs()
    .map(
      (id) =>
        `<option value="${id}" ${id === current ? "selected" : ""}>${t(`controls.langs.${id}`)}</option>`
    )
    .join("");
};

const closeMenu = () => {
  const panel = document.querySelector("#site-nav-panel");
  const toggle = document.querySelector("#nav-toggle");
  if (!panel || !toggle) return;

  panel.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", t("controls.menuOpen"));
  document.body.style.overflow = "";
};

const openMenu = () => {
  const panel = document.querySelector("#site-nav-panel");
  const toggle = document.querySelector("#nav-toggle");
  if (!panel || !toggle) return;

  panel.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", t("controls.menuClose"));
  document.body.style.overflow = "hidden";
};

const bindEvents = () => {
  const toggle = document.querySelector("#nav-toggle");
  const panel = document.querySelector("#site-nav-panel");
  const themeSelect = document.querySelector("#theme-select");
  const langSelect = document.querySelector("#lang-select");

  toggle?.addEventListener("click", () => {
    const open = panel?.classList.contains("is-open");
    if (open) closeMenu();
    else openMenu();
  });

  panel?.addEventListener("click", (e) => {
    if (e.target === panel) closeMenu();
  });

  panel?.querySelectorAll(".menu__link").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel?.classList.contains("is-open")) {
      closeMenu();
      toggle?.focus();
    }
  });

  themeSelect?.addEventListener("change", (e) => {
    setTheme(e.target.value);
  });

  langSelect?.addEventListener("change", (e) => {
    setLang(e.target.value);
  });

  window.addEventListener("hashchange", updateActiveNav);

  onLanguageChange(() => {
    populateThemeSelect();
    populateLangSelect();
    updateActiveNav();
  });
};

/** Highlight current section in nav */
export const updateActiveNav = () => {
  const hash = location.hash.slice(1) || "productos";
  const section = hash.startsWith("categoria") || hash.startsWith("crearcat") || hash.startsWith("editarcat")
    ? "categorias"
    : "productos";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const isActive = link.getAttribute("data-nav") === section;
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};
