/**
 * Delete product — confirmed by caller before invoke.
 */

import { alertSuccess, alertError } from "../../helpers/alerts.js";
import { t } from "../../i18n/i18n.js";

export const eliminarproController = async (a) => {
  try {
    const request = await fetch(`http://localhost:3000/api/productos/${a.id}`, {
      method: "DELETE",
    });
    const result = await request.json();

    if (result.success) {
      const tr = document.querySelector(`#product_${a.id}`);
      tr?.remove();
      await alertSuccess(result.message);
      location.hash = "#productos";
    } else {
      await alertError(result.message);
    }
  } catch (error) {
    console.error(error);
    await alertError(t("alerts.deleteError"));
  }
};
