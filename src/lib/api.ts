const DEFAULT_API_BASE_URL = "https://proto2.apps.teh11.abrhapaas.com";

/** Baked in at build time via VITE_API_BASE_URL; falls back when unset. */
export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE_URL
).replace(/\/$/, "");
