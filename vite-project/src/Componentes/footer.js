/**
 * Site footer — semantic landmark, i18n-ready.
 */

import { t } from "../i18n/i18n.js";

export const renderFooter = () => {
  let footer = document.querySelector("#footer");
  if (!footer) {
    footer = document.createElement("footer");
    footer.id = "footer";
    document.body.appendChild(footer);
  }

  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container site-footer__inner">
      <p>
        <strong data-i18n="brand">${t("brand")}</strong>
        — <span data-i18n="footer.copy">${t("footer.copy")}</span>
      </p>
      <p data-i18n="footer.rights">${t("footer.rights")}</p>
    </div>
  `;
};
