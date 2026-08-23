import axios from "axios";

// ✅ Use deployed backend URL
const API = axios.create({
  baseURL: "https://distributed-file-system-dfs-51s2.onrender.com/api",
});

// APIs
export const getFiles = () => API.get("/files");

export const uploadFile = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteFile = (id) => API.delete(`/delete/${id}`);

export const downloadFile = (id) =>
  window.open(
    `https://distributed-file-system-dfs-51s2.onrender.com/api/download/${id}`
  );