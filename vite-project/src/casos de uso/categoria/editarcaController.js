/**
 * Edit category — load by id, update via PUT.
 */

import { alertSuccess, alertError } from "../../helpers/alerts.js";
import { t } from "../../i18n/i18n.js";

export const editarcaController = async (a) => {
  const form = document.querySelector("#form");
  const nombre = document.querySelector("#nombre");
  const descripcion = document.querySelector("#descripcion");

  if (!form) {
    console.error("formulario no encontrado");
    return;
  }

  try {
    const request = await fetch(`http://localhost:3000/api/categorias/${a.id}`);
    const { data } = await request.json();
    nombre.value = data.nombre;
    descripcion.value = data.descripcion;
  } catch (error) {
    console.error(error);
    await alertError(t("categories.errorText"));
    return;
  }

  const guardaredicion = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: nombre.value,
      descripcion: descripcion.value,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/categorias/${a.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const result = await response.json();

      if (result.success) {
        form.reset();
        await alertSuccess(result.message);
        location.hash = "#categorias";
      } else {
        await alertError(result.message);
      }
    } catch (error) {
      console.error("error al actualizar la categoria:", error);
      await alertError(t("categories.errorText"));
    }
  };

  form.addEventListener("submit", guardaredicion);
};
