import React, { useState } from "react";
import { uploadFile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const UploadBox = ({ refreshFiles, onOpenAuth }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select a file to upload." });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setMessage(null);

    try {
      await uploadFile(formData);
      setMessage({ type: "success", text: `✅ "${selectedFile.filename || selectedFile.name}" uploaded and chunked across DFS nodes successfully!` });
      setSelectedFile(null);
      if (refreshFiles) refreshFiles();
    } catch (err) {
      console.error(err);
      const errText = err.response?.data?.message || err.message || "Upload failed";
      setMessage({ type: "error", text: `❌ ${errText}` });
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: "0 0 10px 0", color: "#f8fafc", fontSize: "1.25rem" }}>
        📤 Upload File to DFS Storage
      </h3>
      <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: "0.88rem" }}>
        Files are automatically partitioned into chunks and replicated across distributed nodes (`node1`, `node2`, `node3`).
      </p>

      {!isAuthenticated && (
        <div style={authNoticeStyle}>
          🔒 You are currently in Guest Mode. Please{" "}
          <button onClick={onOpenAuth} style={inlineAuthBtn}>Sign In</button> to upload files securely.
        </div>
      )}

      {message && (
        <div style={message.type === "success" ? successBannerStyle : errorBannerStyle}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={dropzoneStyle}>
          <input
            type="file"
            id="dfs-file-input"
            onChange={handleFileChange}
            disabled={uploading || !isAuthenticated}
            style={{ display: "none" }}
          />
          <label htmlFor="dfs-file-input" style={{ cursor: isAuthenticated ? "pointer" : "not-allowed", width: "100%" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "8px" }}>☁️</div>
            {selectedFile ? (
              <div>
                <span style={{ fontWeight: "600", color: "#38bdf8", fontSize: "0.95rem" }}>
                  {selectedFile.name}
                </span>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>
                  Size: {formatBytes(selectedFile.size)} | Type: {selectedFile.type || "binary"}
                </div>
              </div>
            ) : (
              <div>
                <span style={{ color: "#e2e8f0", fontWeight: "500", fontSize: "0.95rem" }}>
                  Click to browse or drag & drop a file
                </span>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                  Supports all file types (up to 10MB)
                </div>
              </div>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading || !selectedFile || !isAuthenticated}
          style={uploading || !selectedFile || !isAuthenticated ? disabledUploadBtn : activeUploadBtn}
        >
          {uploading ? "⚡ Partitioning & Uploading Chunks..." : "🚀 Upload & Replicate"}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "24px",
  marginTop: "20px",
  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
};

const dropzoneStyle = {
  border: "2px dashed #334155",
  borderRadius: "12px",
  padding: "30px 20px",
  textAlign: "center",
  background: "#020617",
  transition: "border-color 0.2s ease",
};

const activeUploadBtn = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "0.95rem",
  cursor: "pointer",
  boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.39)",
};

const disabledUploadBtn = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#64748b",
  fontWeight: "600",
  fontSize: "0.95rem",
  cursor: "not-allowed",
  opacity: 0.6,
};

const authNoticeStyle = {
  background: "rgba(234, 179, 8, 0.1)",
  border: "1px solid rgba(234, 179, 8, 0.3)",
  color: "#fde047",
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "0.88rem",
  marginBottom: "16px",
};

const inlineAuthBtn = {
  background: "none",
  border: "none",
  color: "#38bdf8",
  fontWeight: "700",
  textDecoration: "underline",
  cursor: "pointer",
  padding: 0,
};

const successBannerStyle = {
  background: "rgba(16, 185, 129, 0.15)",
  color: "#34d399",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.88rem",
  marginBottom: "16px",
};

const errorBannerStyle = {
  background: "rgba(239, 68, 68, 0.15)",
  color: "#f87171",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.88rem",
  marginBottom: "16px",
};

export default UploadBox;