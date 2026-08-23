import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import FileTable from "../components/FileTable";

import { getFiles, uploadFile, deleteFile, downloadFile } from "../services/api";

const Dashboard = () => {
  const location = useLocation();

  const [files, setFiles] = useState([]);

  // 📥 Fetch files
  const fetchFiles = async () => {
    try {
      const res = await getFiles();
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 📤 Upload
  const handleUpload = async (file) => {
    try {
      await uploadFile(file);
      fetchFiles();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    try {
      await deleteFile(id);
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ⬇️ Download
  const handleDownload = (id) => {
    downloadFile(id);
  };

  // 🧠 Dynamic Title
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/files":
        return "My Files";
      case "/upload":
        return "Upload Files";
      case "/nodes":
        return "Nodes";
      case "/replication":
        return "Replication";
      default:
        return "Dashboard";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", color: "white" }}>
        
        <h1>{getTitle()}</h1>

        {/* 📊 Dashboard Overview */}
        {location.pathname === "/" && (
          <div style={{ marginTop: "20px" }}>
            <p>Welcome to Distributed File System Dashboard created by Rahul Shankar Pandey🚀</p>
            <p>Total Files: {files.length}</p>
          </div>
        )}

        {/* 📂 Files Page */}
        {location.pathname === "/files" && (
          <FileTable
            files={files}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        )}

        {/* 📤 Upload Page */}
        {location.pathname === "/upload" && (
          <UploadBox onUpload={handleUpload} />
        )}

        {/* 🖥 Nodes Page */}
        {location.pathname === "/nodes" && (
          <div>
            <h3>Active Nodes</h3>
            <p>node1</p>
            <p>node2</p>
            <p>node3</p>
          </div>
        )}

        {/* 🔁 Replication Page */}
        {location.pathname === "/replication" && (
          <div>
            <h3>Replication Info</h3>
            <p>Each file is replicated across 2 nodes.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;