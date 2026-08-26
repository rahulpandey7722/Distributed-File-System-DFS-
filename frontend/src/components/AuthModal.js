import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Name is required");
        }
        await signup(name, email, password);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Authentication failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#38bdf8", fontSize: "1.5rem" }}>
            {isLogin ? "🔑 Sign In to DFS" : "🚀 Create DFS Account"}
          </h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        {error && <div style={errorBannerStyle}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={submitting} style={submitButtonStyle}>
            {submitting ? "Processing..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem", color: "#94a3b8" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={toggleButtonStyle}
          >
            {isLogin ? "Sign Up" : "Sign In"}
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
  zIndex: 1000,
};

const modalStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "16px",
  padding: "30px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  color: "#f8fafc",
};

const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "600",
  marginBottom: "6px",
  color: "#cbd5e1",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
};

const submitButtonStyle = {
  marginTop: "10px",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.39)",
};

const toggleButtonStyle = {
  background: "none",
  border: "none",
  color: "#38bdf8",
  fontWeight: "600",
  cursor: "pointer",
  textDecoration: "underline",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  color: "#94a3b8",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const errorBannerStyle = {
  background: "#7f1d1d",
  color: "#fca5a5",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  marginBottom: "14px",
  border: "1px solid #991b1b",
};

export default AuthModal;
