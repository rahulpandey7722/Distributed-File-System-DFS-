import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onOpenAuth }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/files", label: "My Files", icon: "📂" },
    { path: "/upload", label: "Upload", icon: "📤" },
    { path: "/nodes", label: "Nodes Status", icon: "🖥️" },
    { path: "/replication", label: "Replication", icon: "🔁" },
  ];

  return (
    <div style={sidebarContainerStyle}>
      {/* App Branding Header */}
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🌐</span> DFS Storage
        </h2>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Distributed File System</span>
      </div>

      {/* Navigation List */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                style={{
                  ...linkBaseStyle,
                  background: isActive ? "linear-gradient(90deg, #0284c7 0%, #0369a1 100%)" : "transparent",
                  color: isActive ? "#ffffff" : "#cbd5e1",
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User Profile / Authentication Badge Footer */}
      <div style={authSectionStyle}>
        {isAuthenticated && user ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={avatarStyle}>
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#f8fafc", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {user.name || "User"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {user.email}
                </div>
              </div>
            </div>

            <button onClick={logout} style={logoutButtonStyle}>
              🚪 Sign Out
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "8px" }}>
              Sign in to manage your files securely
            </p>
            <button onClick={onOpenAuth} style={loginButtonStyle}>
              🔑 Sign In / Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const sidebarContainerStyle = {
  width: "220px",
  minHeight: "100vh",
  background: "#020617",
  borderRight: "1px solid #1e293b",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
};

const linkBaseStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
};

const authSectionStyle = {
  marginTop: "auto",
  paddingTop: "20px",
  borderTop: "1px solid #1e293b",
};

const avatarStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "0.9rem",
  flexShrink: 0,
};

const logoutButtonStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#f87171",
  fontSize: "0.8rem",
  fontWeight: "600",
  cursor: "pointer",
};

const loginButtonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.85rem",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(3, 105, 161, 0.3)",
};

export default Sidebar;