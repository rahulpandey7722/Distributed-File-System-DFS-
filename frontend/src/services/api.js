import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

// ✅ NAMED EXPORTS (VERY IMPORTANT)
export const getFiles = () => API.get("/files");

export const uploadFile = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteFile = (id) => API.delete(`/delete/${id}`);

export const downloadFile = (id) =>
  window.open(`http://localhost:3001/api/download/${id}`);