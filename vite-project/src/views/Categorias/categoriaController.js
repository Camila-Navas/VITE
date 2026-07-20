/**
 * Categories list controller — renders table from API data.
 */

import { listar_categorias } from "../../casos de uso/categoria/listar_categorias";
import { eliminarController } from "../../casos de uso/categoria/eliminarcaController.js";
import { createActionButtons, renderTableState } from "../../helpers/tableActions.js";
import { confirmDelete } from "../../helpers/alerts.js";

export const categoriaController = async () => {
  await new Promise(requestAnimationFrame);

  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  const lista_categorias = async () => {
    try {
      const categorias = await listar_categorias();

      if (categorias == null) {
        throw new Error("categories fetch failed");
      }

      tbody.innerHTML = "";

      if (categorias.length === 0) {
        renderTableState(tbody, 3, "empty", {
          titleKey: "categories.emptyTitle",
          textKey: "categories.emptyText",
        });
        return;
      }

      categorias.forEach((categoria) => {
        const tr = tbody.insertRow();
        tr.id = `category_${categoria.id}`;

        const cellNombre = tr.insertCell(0);
        const cellDescripcion = tr.insertCell(1);
        const acciones = tr.insertCell(2);
        acciones.classList.add("acciones");

        cellNombre.textContent = categoria.nombre;
        cellDescripcion.textContent = categoria.descripcion;

        acciones.append(
          createActionButtons({
            editHref: `#editarcategorias/${categoria.id}`,
            onDelete: async () => {
              const ok = await confirmDelete();
              if (!ok) return;
              await eliminarController({ id: categoria.id });
              await lista_categorias();
            },
          })
        );
      });
    } catch (error) {
      console.error(error);
      renderTableState(tbody, 3, "error", {
        titleKey: "categories.errorTitle",
        textKey: "categories.errorText",
      });
    }
  };

  lista_categorias();
};
