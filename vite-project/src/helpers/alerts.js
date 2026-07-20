/**
 * Shared SweetAlert2 helpers with i18n + theme-aware buttons.
 */

import Swal from "sweetalert2";
import { t } from "../i18n/i18n.js";

const primaryColor = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() ||
  "#0f766e";

const dangerColor = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--color-danger").trim() ||
  "#dc2626";

export const alertSuccess = (message) =>
  Swal.fire({
    title: t("alerts.successTitle"),
    text: message,
    icon: "success",
    confirmButtonText: t("common.ok"),
    confirmButtonColor: primaryColor(),
  });

export const alertError = (message) =>
  Swal.fire({
    title: t("alerts.errorTitle"),
    text: message,
    icon: "error",
    confirmButtonText: t("common.ok"),
    confirmButtonColor: dangerColor(),
  });

export const confirmDelete = async () => {
  const result = await Swal.fire({
    title: t("alerts.confirmDeleteTitle"),
    text: t("alerts.confirmDeleteText"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("alerts.confirmDeleteBtn"),
    cancelButtonText: t("alerts.cancelBtn"),
    confirmButtonColor: dangerColor(),
    cancelButtonColor: primaryColor(),
  });
  return result.isConfirmed;
};
