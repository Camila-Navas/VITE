/**
 * Hash router — maps routes to templates + controllers.
 * Unknown routes fall back to products list.
 */

import { loadView } from "../helpers/loadView.js";
import { productoController } from "../views/Productos/productosController.js";
import { categoriaController } from "../views/Categorias/categoriaController.js";
import { crearproController } from "../casos de uso/productos/crearproController.js";
import { crearcaController } from "../casos de uso/categoria/crearcaController.js";
import { editarcaController } from "../casos de uso/categoria/editarcaController.js";
import { editarproController } from "../casos de uso/productos/editarproController.js";
import { updateActiveNav } from "../Componentes/header.js";

const routes = {
  "/": {
    template: "Productos/index.html",
    controlador: productoController,
  },
  productos: {
    template: "Productos/index.html",
    controlador: productoController,
  },
  crearproductos: {
    template: "Productos/crear.html",
    controlador: crearproController,
  },
  "editarproducto/:id": {
    template: "Productos/editar.html",
    controlador: editarproController,
  },
  categorias: {
    template: "Categorias/index.html",
    controlador: categoriaController,
  },
  crearcategorias: {
    template: "Categorias/crear.html",
    controlador: crearcaController,
  },
  "editarcategorias/:id": {
    template: "Categorias/editar.html",
    controlador: editarcaController,
  },
};

export const router = async (app) => {
  const hash = location.hash.slice(1);
  const [rutas, params] = matchRoute(hash);

  if (!rutas) {
    // Unknown route → soft redirect to products
    if (hash && hash !== "/") {
      location.hash = "#productos";
      return;
    }
  }

  const route = rutas || routes.productos;
  const routeParams = params || {};

  await loadView(app, route.template);
  updateActiveNav();

  // Move focus to main for screen readers after navigation
  if (typeof app.focus === "function") {
    app.focus({ preventScroll: true });
  }

  if (typeof route.controlador === "function") {
    route.controlador(routeParams);
  }
};

const matchRoute = (hash) => {
  // Empty or bare "/" → home (products)
  if (!hash || hash === "/") {
    return [routes["/"] || routes.productos, {}];
  }

  const parts = hash.split("/");

  for (const route in routes) {
    if (route === "/") continue;

    const b = route.split("/");
    if (b.length !== parts.length) continue;

    const params = {};

    const matched = b.every((parte, i) => {
      if (parte.startsWith(":")) {
        params[parte.slice(1)] = parts[i];
        return true;
      }
      return parte === parts[i];
    });

    if (matched) {
      return [routes[route], params];
    }
  }

  return [null, null];
};
