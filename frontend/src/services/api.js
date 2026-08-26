import axios from "axios";

// Standardize Base URL (production Render URL or local fallback)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://distributed-file-system-dfs-5ls2.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Request Interceptor: Attach JWT Token automatically to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dfs_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Handle Token Expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token if un-authenticated response occurs
      const currentToken = localStorage.getItem("dfs_token");
      if (currentToken) {
        localStorage.removeItem("dfs_token");
        localStorage.removeItem("dfs_user");
        window.dispatchEvent(new Event("dfs_auth_change"));
      }
    }
    return Promise.reject(error);
  }
);

// 🔑 AUTH API ENDPOINTS
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const signupUser = (userData) => API.post("/auth/signup", userData);
export const getMe = () => API.get("/auth/me");

// 📂 FILES API ENDPOINTS
// scope: 'my' (user specific files) or 'all' (all system files)
export const getFiles = (scope = "my") => API.get(`/files?scope=${scope}`);

// 📤 UPLOAD FILE
export const uploadFile = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ❌ DELETE FILE
export const deleteFile = (id) => API.delete(`/delete/${id}`);

// ⬇️ DOWNLOAD FILE
export const downloadFileUrl = (id) => {
  const token = localStorage.getItem("dfs_token");
  return `${API_BASE_URL}/download/${id}${token ? `?token=${token}` : ""}`;
};

export const downloadFile = (id) => {
  const url = downloadFileUrl(id);
  window.open(url, "_blank");
};

// 👁️ VIEW FILE INLINE
export const getViewUrl = (id) => {
  const token = localStorage.getItem("dfs_token");
  return `${API_BASE_URL}/view/${id}${token ? `?token=${token}` : ""}`;
};

export default API;