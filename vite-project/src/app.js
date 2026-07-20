/**
 * App entry — boot theme, i18n, chrome, and hash router.
 */

import "./main.css";
import { initTheme } from "./theme/theme.js";
import { initI18n, onLanguageChange } from "./i18n/i18n.js";
import { renderHeader } from "./Componentes/header.js";
import { renderFooter } from "./Componentes/footer.js";
import { router } from "./router/router.js";

const app = document.querySelector("#app");

// Order matters: prefs first, then chrome that reads t() / theme
initTheme();
initI18n();
renderHeader();
renderFooter();

window.addEventListener("hashchange", () => {
  router(app);
});

window.addEventListener("DOMContentLoaded", () => {
  router(app);
});

// Re-render current view so dynamic strings (tables, selects) update
onLanguageChange(() => {
  router(app);
});
