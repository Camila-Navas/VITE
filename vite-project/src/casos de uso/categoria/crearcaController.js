/**
 * Create category — form submit.
 */

import { alertSuccess, alertError } from "../../helpers/alerts.js";
import { t } from "../../i18n/i18n.js";

export const crearcaController = async () => {
  await new Promise(requestAnimationFrame);

  const form = document.querySelector("#form");
  const nombre = document.querySelector("#nombre");
  const descripcion = document.querySelector("#descripcion");

  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  const guardar = async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombre.value,
      descripcion: descripcion.value,
    };

    try {
      const request = await fetch("http://localhost:3000/api/categorias", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const response = await request.json();

      if (response.success) {
        form.reset();
        await alertSuccess(response.message);
        location.hash = "#categorias";
      } else {
        await alertError(response.message);
      }
    } catch (error) {
      console.error(error);
      await alertError(t("categories.errorText"));
    }
  };

  form.addEventListener("submit", guardar);
};
