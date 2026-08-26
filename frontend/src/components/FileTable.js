import React from "react";
import { useAuth } from "../context/AuthContext";

const FileTable = ({ files, onDelete, onDownload, onViewFile, scope = "my" }) => {
  const { user } = useAuth();

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "1.25rem" }}>
          {scope === "my" ? "📂 My Files" : "🌐 All Files (System View)"} ({files.length})
        </h3>
      </div>

      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #1e293b", background: "#0f172a" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={trHeaderStyle}>
              <th style={thStyle}>File Name</th>
              <th style={thStyle}>Owner</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Uploaded</th>
              <th style={thStyle}>Replication</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "35px", color: "#64748b" }}>
                  {scope === "my"
                    ? "You haven't uploaded any files yet."
                    : "No files found in the distributed system."}
                </td>
              </tr>
            ) : (
              files.map((file) => {
                const isOwner = !file.owner || (user && (file.owner._id === user._id || file.owner === user._id));
                const ownerName = file.owner?.name || file.owner?.email || "Legacy / Public";

                return (
                  <tr key={file._id} style={trBodyStyle}>
                    {/* Filename */}
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "1.1rem" }}>📄</span>
                        <span style={{ fontWeight: "600", color: "#f1f5f9" }}>{file.filename}</span>
                      </div>
                    </td>

                    {/* Owner Badge */}
                    <td style={tdStyle}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        background: isOwner ? "rgba(59, 130, 246, 0.15)" : "rgba(148, 163, 184, 0.15)",
                        color: isOwner ? "#60a5fa" : "#94a3b8",
                        border: isOwner ? "1px solid rgba(96, 165, 250, 0.3)" : "1px solid rgba(148, 163, 184, 0.3)"
                      }}>
                        {isOwner ? "You (Owner)" : ownerName}
                      </span>
                    </td>

                    {/* File Size */}
                    <td style={tdStyle}>{formatBytes(file.size)}</td>

                    {/* Upload Date */}
                    <td style={{ ...tdStyle, color: "#94a3b8", fontSize: "0.82rem" }}>
                      {formatDate(file.createdAt)}
                    </td>

                    {/* Nodes */}
                    <td style={tdStyle}>
                      {file.chunks && file.chunks[0]?.nodes ? (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {file.chunks[0].nodes.map((node, i) => (
                            <span key={i} style={miniNodeTag}>
                              {node}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={miniNodeTag}>node1</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        {/* VIEW BUTTON */}
                        <button
                          onClick={() => onViewFile(file)}
                          style={viewBtnStyle}
                          title="View / Preview File"
                        >
                          👁️ View
                        </button>

                        {/* DOWNLOAD BUTTON */}
                        <button
                          onClick={() => onDownload(file._id)}
                          style={downloadBtnStyle}
                          title="Download File"
                        >
                          ⬇️ Download
                        </button>

                        {/* DELETE BUTTON (Protected by ownership) */}
                        <button
                          onClick={() => onDelete(file._id, isOwner)}
                          disabled={!isOwner}
                          style={isOwner ? deleteBtnStyle : disabledDeleteBtnStyle}
                          title={isOwner ? "Delete File" : "Only the owner can delete this file"}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
  color: "#cbd5e1",
};

const trHeaderStyle = {
  background: "#020617",
  borderBottom: "1px solid #1e293b",
};

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: "600",
  color: "#94a3b8",
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const trBodyStyle = {
  borderBottom: "1px solid #1e293b",
  transition: "background 0.15s ease",
};

const tdStyle = {
  padding: "14px 16px",
  verticalAlign: "middle",
};

const miniNodeTag = {
  background: "#1e293b",
  color: "#38bdf8",
  fontSize: "0.7rem",
  padding: "2px 6px",
  borderRadius: "6px",
  border: "1px solid #334155",
};

const viewBtnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid rgba(56, 189, 248, 0.3)",
  background: "rgba(56, 189, 248, 0.1)",
  color: "#38bdf8",
  fontWeight: "600",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const downloadBtnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid rgba(16, 185, 129, 0.3)",
  background: "rgba(16, 185, 129, 0.1)",
  color: "#34d399",
  fontWeight: "600",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const deleteBtnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  background: "rgba(239, 68, 68, 0.1)",
  color: "#f87171",
  fontWeight: "600",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const disabledDeleteBtnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#64748b",
  fontWeight: "600",
  fontSize: "0.8rem",
  cursor: "not-allowed",
  opacity: 0.6,
};

export default FileTable;