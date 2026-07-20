/**
 * Delete category — confirmed by caller before invoke.
 */

import { alertSuccess, alertError } from "../../helpers/alerts.js";
import { t } from "../../i18n/i18n.js";

export const eliminarController = async (a) => {
  try {
    const request = await fetch(`http://localhost:3000/api/categorias/${a.id}`, {
      method: "DELETE",
    });
    const result = await request.json();

    if (result.success) {
      await alertSuccess(result.message);
      location.hash = "#categorias";
    } else {
      await alertError(result.message);
    }
  } catch (error) {
    console.error(error);
    await alertError(t("alerts.deleteError"));
  }
};
