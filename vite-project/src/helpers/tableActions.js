/**
 * Shared table helpers — empty/error states and action buttons.
 */

import { t } from "../i18n/i18n.js";

/**
 * Render an empty or error state spanning all columns.
 * @param {HTMLTableSectionElement} tbody
 * @param {number} colSpan
 * @param {"empty"|"error"} kind
 * @param {{ titleKey: string, textKey: string }} keys
 */
export const renderTableState = (tbody, colSpan, kind, keys) => {
  tbody.innerHTML = "";
  const tr = tbody.insertRow();
  const td = tr.insertCell(0);
  td.colSpan = colSpan;
  td.innerHTML = `
    <div class="state-message ${kind === "error" ? "state-message--error" : ""}" role="status">
      <p class="state-message__title">${t(keys.titleKey)}</p>
      <p class="state-message__text">${t(keys.textKey)}</p>
    </div>
  `;
};

/**
 * Build edit + delete action group.
 * @param {{ editHref: string, onDelete: () => void }} options
 */
export const createActionButtons = ({ editHref, onDelete }) => {
  const div = document.createElement("div");
  div.classList.add("botonera");

  const botonEditar = document.createElement("a");
  botonEditar.href = editHref;
  botonEditar.classList.add("btn", "btn--small", "btn--ghost", "editar");
  botonEditar.textContent = t("common.edit");

  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.classList.add("btn", "btn--small", "btn--danger", "eliminar");
  botonEliminar.textContent = t("common.delete");
  botonEliminar.addEventListener("click", onDelete);

  div.append(botonEditar, botonEliminar);
  return div;
};
