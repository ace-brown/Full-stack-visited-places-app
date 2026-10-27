export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export const ASSET_URL =
  import.meta.env.VITE_ASSET_URL || "http://localhost:5000";

export const assetUrl = (path) => `${ASSET_URL}/${path}`;
