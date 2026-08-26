import React, { useState, useEffect } from "react";
import { getViewUrl, downloadFile } from "../services/api";

const FileViewerModal = ({ file, isOpen, onClose }) => {
  const [textContent, setTextContent] = useState(null);
  const [loadingText, setLoadingText] = useState(false);

  const viewUrl = file ? getViewUrl(file._id) : "";

  const isImage = file?.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file?.filename || "");
  const isPdf = file?.mimeType === "application/pdf" || /\.pdf$/i.test(file?.filename || "");
  const isAudio = file?.mimeType?.startsWith("audio/") || /\.(mp3|wav|ogg)$/i.test(file?.filename || "");
  const isVideo = file?.mimeType?.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(file?.filename || "");
  const isText =
    file?.mimeType?.startsWith("text/") ||
    /\.(txt|json|js|html|css|py|md|xml|log|csv)$/i.test(file?.filename || "");

  useEffect(() => {
    if (isOpen && file && isText) {
      setLoadingText(true);
      fetch(viewUrl)
        .then((res) => res.text())
        .then((data) => {
          setTextContent(data);
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent("Failed to load text preview");
          setLoadingText(false);
        });
    } else {
      setTextContent(null);
    }
  }, [isOpen, file, isText, viewUrl]);

  if (!isOpen || !file) return null;

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h3 style={{ margin: 0, color: "#38bdf8", fontSize: "1.2rem", wordBreak: "break-all" }}>
              📄 {file.filename}
            </h3>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Size: {formatBytes(file.size)} | Owner: {file.owner?.name || file.owner?.email || "System"}
            </span>
          </div>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        {/* File Preview Content Area */}
        <div style={previewContainerStyle}>
          {isImage && (
            <div style={{ textAlign: "center", width: "100%" }}>
              <img
                src={viewUrl}
                alt={file.filename}
                style={{ maxWidth: "100%", maxHeight: "450px", borderRadius: "8px", objectFit: "contain" }}
              />
            </div>
          )}

          {isPdf && (
            <iframe
              src={viewUrl}
              title={file.filename}
              style={{ width: "100%", height: "450px", border: "none", borderRadius: "8px" }}
            />
          )}

          {isAudio && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <audio controls src={viewUrl} style={{ width: "100%", maxWidth: "400px" }} />
            </div>
          )}

          {isVideo && (
            <div style={{ textAlign: "center" }}>
              <video controls src={viewUrl} style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "8px" }} />
            </div>
          )}

          {isText && (
            <pre style={textPreviewStyle}>
              {loadingText ? "Loading file preview..." : textContent}
            </pre>
          )}

          {!isImage && !isPdf && !isAudio && !isVideo && !isText && (
            <div style={fallbackBoxStyle}>
              <p style={{ fontSize: "2.5rem", margin: 0 }}>📁</p>
              <p style={{ margin: "10px 0 5px 0", color: "#e2e8f0" }}>
                Preview not directly supported in browser for this file type.
              </p>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                MIME: {file.mimeType || "Unknown"}
              </span>
            </div>
          )}
        </div>

        {/* Node Replication Info & Actions */}
        <div style={footerStyle}>
          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            <strong>Replicated Across Nodes:</strong>{" "}
            {file.chunks && file.chunks[0]?.nodes ? (
              file.chunks[0].nodes.map((node, i) => (
                <span key={i} style={nodeBadgeStyle}>
                  {node}
                </span>
              ))
            ) : (
              <span style={nodeBadgeStyle}>node1</span>
            )}
          </div>

          <button onClick={() => downloadFile(file._id)} style={downloadButtonStyle}>
            ⬇️ Download File
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(2, 6, 23, 0.85)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1100,
};

const modalStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "24px",
  width: "90%",
  maxWidth: "700px",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
  color: "#f8fafc",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "1px solid #1e293b",
  paddingBottom: "14px",
  marginBottom: "16px",
};

const previewContainerStyle = {
  flex: 1,
  minHeight: "250px",
  maxHeight: "480px",
  overflowY: "auto",
  background: "#020617",
  borderRadius: "10px",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #1e293b",
};

const textPreviewStyle = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: "0.85rem",
  color: "#38bdf8",
  margin: 0,
  width: "100%",
  height: "100%",
  textAlign: "left",
};

const fallbackBoxStyle = {
  textAlign: "center",
  padding: "30px",
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "1px solid #1e293b",
  paddingTop: "14px",
  marginTop: "16px",
  flexWrap: "wrap",
  gap: "10px",
};

const nodeBadgeStyle = {
  background: "rgba(14, 165, 233, 0.15)",
  color: "#38bdf8",
  border: "1px solid rgba(56, 189, 248, 0.3)",
  padding: "2px 8px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  marginRight: "4px",
};

const downloadButtonStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.9rem",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  color: "#94a3b8",
  fontSize: "1.2rem",
  cursor: "pointer",
};

export default FileViewerModal;
