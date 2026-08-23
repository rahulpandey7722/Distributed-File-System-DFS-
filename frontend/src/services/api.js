import axios from "axios";

const API = axios.create({
  baseURL: "https://distributed-file-system-dfs-5ls2.onrender.com/api",
});

// ✅ GET FILES
export const getFiles = () => API.get("/files");

// ✅ UPLOAD FILE
export const uploadFile = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ DELETE FILE
export const deleteFile = (id) => API.delete(`/delete/${id}`);

// ✅ DOWNLOAD FILE
export const downloadFile = (id) =>
  window.open(
    `https://distributed-file-system-dfs-5ls2.onrender.com/api/download/${id}`
  );