/**
 * Create product — form submit + category select.
 */

import { listar_categorias } from "../categoria/listar_categorias";
import { t } from "../../i18n/i18n.js";
import { alertSuccess, alertError } from "../../helpers/alerts.js";

export const crearproController = async () => {
  await new Promise(requestAnimationFrame);

  const form = document.querySelector("#form");
  const nombre = document.querySelector("#nombre");
  const descripcion = document.querySelector("#descripcion");
  const precio = document.querySelector("#precio");
  const categoria_id = document.querySelector("#categoria_id");

  if (!form || !categoria_id) {
    console.error("Formulario no encontrado");
    return;
  }

  const guardar = async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      precio: precio.value,
      categoria_id: categoria_id.value,
    };

    try {
      const request = await fetch("http://localhost:3000/api/productos", {
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
        location.hash = "#productos";
      } else {
        await alertError(response.message);
      }
    } catch (error) {
      console.error(error);
      await alertError(t("products.errorText"));
    }
  };

  const cargar_Categorias = async () => {
    const categorias = (await listar_categorias()) || [];
    categoria_id.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = t("common.selectCategory");
    categoria_id.append(placeholder);

    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.textContent = categoria.nombre;
      option.value = categoria.id;
      categoria_id.append(option);
    });
  };

  await cargar_Categorias();
  form.addEventListener("submit", guardar);
};
