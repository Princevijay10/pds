import axios from "axios";

// Production uses the dedicated Render API service. VITE_API_URL can still
// override this for local/staging environments.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://pds-server-s06a.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname.startsWith("/admin") &&
      !window.location.pathname.startsWith("/admin/login")
    ) {
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;
