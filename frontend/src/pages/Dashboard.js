import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import FileTable from "../components/FileTable";
import AuthModal from "../components/AuthModal";
import FileViewerModal from "../components/FileViewerModal";

import { getFiles, deleteFile, downloadFile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [scope, setScope] = useState("my"); // 'my' or 'all'
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Viewer State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // 📥 Fetch files from backend API
  const fetchFiles = useCallback(async () => {
    if (!isAuthenticated && scope === "my") {
      setFiles([]);
      return;
    }

    setLoadingFiles(true);
    try {
      // Fetch either 'my' files or 'all' system files
      const res = await getFiles(scope);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      showToast("error", err.response?.data?.message || "Failed to load files");
    } finally {
      setLoadingFiles(false);
    }
  }, [scope, isAuthenticated]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // ❌ Delete file with authorization handling
  const handleDelete = async (id, isOwner) => {
    if (!isOwner) {
      showToast("error", "🚫 Unauthorized: You can only delete files that you own!");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete this file and its distributed chunks?")) {
      return;
    }

    try {
      await deleteFile(id);
      showToast("success", "🗑️ File and distributed chunks deleted successfully!");
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.message || "Delete failed";
      showToast("error", `❌ ${msg}`);
    }
  };

  // ⬇️ Download file
  const handleDownload = (id) => {
    downloadFile(id);
  };

  // 👁️ Open In-App File Viewer Modal
  const handleViewFile = (file) => {
    setViewingFile(file);
    setIsViewerOpen(true);
  };

  // Filter files by search term
  const filteredFiles = files.filter((f) =>
    f.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Title based on current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard Overview";
      case "/files":
        return "File Storage Manager";
      case "/upload":
        return "Upload New File";
      case "/nodes":
        return "DFS Storage Nodes";
      case "/replication":
        return "Replication Status";
      default:
        return "Dashboard";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#090d16", color: "#f8fafc" }}>
      {/* Sidebar Navigation */}
      <Sidebar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "28px", overflowX: "hidden" }}>

        {/* Toast Notification Banner */}
        {toast && (
          <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 2000,
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "600",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            background: toast.type === "success" ? "#064e3b" : "#7f1d1d",
            color: toast.type === "success" ? "#a7f3d0" : "#fca5a5",
            border: toast.type === "success" ? "1px solid #059669" : "1px solid #dc2626",
            animation: "fadeIn 0.3s ease"
          }}>
            {toast.text}
          </div>
        )}

        {/* Top Header & Search Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem", color: "#ffffff", fontWeight: "700" }}>
              {getTitle()}
            </h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "#64748b" }}>
              Distributed File System with Chunk Partitioning & Consistent Hashing
            </p>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="text"
              placeholder="🔍 Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchBoxStyle}
            />

            {/* View Filter Scope Toggle (My Files vs All Files) */}
            <div style={scopeToggleContainer}>
              <button
                onClick={() => setScope("my")}
                style={{
                  ...scopeToggleBtn,
                  background: scope === "my" ? "#0284c7" : "transparent",
                  color: scope === "my" ? "#ffffff" : "#94a3b8",
                  fontWeight: scope === "my" ? "600" : "400",
                }}
              >
                My Files
              </button>
              <button
                onClick={() => setScope("all")}
                style={{
                  ...scopeToggleBtn,
                  background: scope === "all" ? "#0284c7" : "transparent",
                  color: scope === "all" ? "#ffffff" : "#94a3b8",
                  fontWeight: scope === "all" ? "600" : "400",
                }}
              >
                🌐 All Files View
              </button>
            </div>
          </div>
        </div>

        {/* 📊 Dashboard Overview Page */}
        {location.pathname === "/" && (
          <div>
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <span style={{ fontSize: "2rem" }}>📂</span>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#38bdf8" }}>{files.length}</div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {scope === "my" ? "Your Uploaded Files" : "Total Distributed Files"}
                  </div>
                </div>
              </div>

              <div style={statCardStyle}>
                <span style={{ fontSize: "2rem" }}>🖥️</span>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#34d399" }}>3 Active Nodes</div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>node1, node2, node3</div>
                </div>
              </div>

              <div style={statCardStyle}>
                <span style={{ fontSize: "2rem" }}>🔁</span>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#a78bfa" }}>2x Replication</div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Primary + Replica per Chunk</div>
                </div>
              </div>
            </div>

            <UploadBox refreshFiles={fetchFiles} onOpenAuth={() => setIsAuthOpen(true)} />

            {loadingFiles ? (
              <p style={{ color: "#94a3b8", marginTop: "20px" }}>Loading files...</p>
            ) : (
              <FileTable
                files={filteredFiles}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onViewFile={handleViewFile}
                scope={scope}
              />
            )}
          </div>
        )}

        {/* 📂 Files Page */}
        {location.pathname === "/files" && (
          <div>
            {loadingFiles ? (
              <p style={{ color: "#94a3b8" }}>Loading files...</p>
            ) : (
              <FileTable
                files={filteredFiles}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onViewFile={handleViewFile}
                scope={scope}
              />
            )}
          </div>
        )}

        {/* 📤 Upload Page */}
        {location.pathname === "/upload" && (
          <div>
            <UploadBox refreshFiles={fetchFiles} onOpenAuth={() => setIsAuthOpen(true)} />
          </div>
        )}

        {/* 🖥 Nodes Page */}
        {location.pathname === "/nodes" && (
          <div style={nodeCardContainer}>
            <h3 style={{ color: "#f8fafc", marginBottom: "16px" }}>Active Distributed Storage Nodes</h3>
            {["node1", "node2", "node3"].map((node, i) => (
              <div key={node} style={nodeCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🖥️</span>
                  <div>
                    <strong style={{ color: "#f8fafc", fontSize: "1rem" }}>{node}</strong>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>GridFS Storage Bucket #{i + 1}</div>
                  </div>
                </div>
                <span style={onlineTagStyle}>● ONLINE</span>
              </div>
            ))}
          </div>
        )}

        {/* 🔁 Replication Page */}
        {location.pathname === "/replication" && (
          <div style={nodeCardContainer}>
            <h3 style={{ color: "#f8fafc", marginBottom: "12px" }}>Consistent Hashing & Replication Architecture</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Our Distributed File System partitions each uploaded file into chunks using a consistent hash ring.
              Each chunk is written to a <strong>Primary Node</strong> determined by hashing the chunk key, and mirrored onto a <strong>Replica Node</strong> to guarantee fault tolerance and data availability.
            </p>
          </div>
        )}

      </div>

      {/* Auth Modal (Login / Signup) */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* In-App File Viewer Modal */}
      <FileViewerModal
        file={viewingFile}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setViewingFile(null);
        }}
      />
    </div>
  );
};

const searchBoxStyle = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #1e293b",
  background: "#0f172a",
  color: "#f8fafc",
  fontSize: "0.88rem",
  outline: "none",
  width: "180px",
};

const scopeToggleContainer = {
  display: "flex",
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "3px",
};

const scopeToggleBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const statCardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "12px",
  padding: "18px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const nodeCardContainer = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "14px",
  padding: "24px",
  marginTop: "20px",
};

const nodeCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "10px",
  padding: "16px 20px",
  marginBottom: "12px",
};

const onlineTagStyle = {
  color: "#34d399",
  background: "rgba(52, 211, 153, 0.15)",
  border: "1px solid rgba(52, 211, 153, 0.3)",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: "700",
};

export default Dashboard;