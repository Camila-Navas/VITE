/**
 * Products list controller — renders table from API data.
 */

import { listar_productos } from "../../casos de uso/productos/listar_productos";
import { listar_categorias } from "../../casos de uso/categoria/listar_categorias";
import { eliminarproController } from "../../casos de uso/productos/eliminarproController";
import { t } from "../../i18n/i18n.js";
import { createActionButtons, renderTableState } from "../../helpers/tableActions.js";
import { confirmDelete } from "../../helpers/alerts.js";

export const productoController = async () => {
  await new Promise(requestAnimationFrame);

  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  const lista_productos = async () => {
    try {
      const [productos, categorias] = await Promise.all([
        listar_productos(),
        listar_categorias(),
      ]);

      if (productos == null) {
        throw new Error("products fetch failed");
      }

      const cats = categorias || [];

      tbody.innerHTML = "";

      if (productos.length === 0) {
        renderTableState(tbody, 5, "empty", {
          titleKey: "products.emptyTitle",
          textKey: "products.emptyText",
        });
        return;
      }

      productos.forEach((producto) => {
        const tr = tbody.insertRow();
        tr.id = `product_${producto.id}`;

        const cellNombre = tr.insertCell(0);
        const cellDescripcion = tr.insertCell(1);
        const cellPrecio = tr.insertCell(2);
        const cellCategoria = tr.insertCell(3);
        const acciones = tr.insertCell(4);
        acciones.classList.add("acciones");

        cellNombre.textContent = producto.nombre;
        cellDescripcion.textContent = producto.descripcion;
        cellPrecio.textContent = producto.precio;
        cellCategoria.textContent =
          cats.find((c) => c.id === producto.categoria_id)?.nombre ||
          t("common.noCategory");

        acciones.append(
          createActionButtons({
            editHref: `#editarproducto/${producto.id}`,
            onDelete: async () => {
              const ok = await confirmDelete();
              if (!ok) return;
              await eliminarproController({ id: producto.id });
            },
          })
        );
      });
    } catch (error) {
      console.error(error);
      renderTableState(tbody, 5, "error", {
        titleKey: "products.errorTitle",
        textKey: "products.errorText",
      });
    }
  };

  lista_productos();
};
