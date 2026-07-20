/**
 * Edit product — load by id, update via PUT.
 */

import { listar_categorias } from "../categoria/listar_categorias";
import { t } from "../../i18n/i18n.js";
import { alertSuccess, alertError } from "../../helpers/alerts.js";

export const editarproController = async (a) => {
  const form = document.querySelector("#form");
  const nombre = document.querySelector("#nombre");
  const descripcion = document.querySelector("#descripcion");
  const precio = document.querySelector("#precio");
  const categoria_id = document.querySelector("#categoria_id");

  if (!form || !categoria_id) {
    console.error("formulario no encontrado");
    return;
  }

  try {
    const request = await fetch(`http://localhost:3000/api/productos/${a.id}`);
    const { data } = await request.json();
    const categorias = (await listar_categorias()) || [];

    nombre.value = data.nombre;
    descripcion.value = data.descripcion;
    precio.value = data.precio;

    categoria_id.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = t("common.selectCategory");
    categoria_id.append(placeholder);

    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.textContent = categoria.nombre;
      option.value = categoria.id;
      if (categoria.id === data.categoria_id) {
        option.selected = true;
      }
      categoria_id.append(option);
    });
  } catch (error) {
    console.error(error);
    await alertError(t("products.errorText"));
    return;
  }

  const guardaredicion = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      precio: precio.value,
      categoria_id: categoria_id.value,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/productos/${a.id}`, {
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
        location.hash = "#productos";
      } else {
        await alertError(result.message);
      }
    } catch (error) {
      console.error("error al actualizar el producto:", error);
      await alertError(t("products.errorText"));
    }
  };

  form.addEventListener("submit", guardaredicion);
};
