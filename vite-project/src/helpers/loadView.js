/**
 * Load an HTML partial into a container, then re-apply i18n + reveal.
 */

import { applyTranslations } from "../i18n/i18n.js";
import { initReveal } from "./reveal.js";

export const loadView = async (elemento, hash) => {
  const response = await fetch(`./src/views/${hash}`);
  if (!response.ok) {
    throw new Error(`View not found: ${hash}`);
  }
  const html = await response.text();
  elemento.innerHTML = html;
  applyTranslations(elemento);
  initReveal(elemento);
};
