import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUser, signupUser, getMe } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("dfs_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("dfs_token") || null);
  const [loading, setLoading] = useState(true);

  // Validate existing token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.user);
          localStorage.setItem("dfs_user", JSON.stringify(res.data.user));
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleAuthChange = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("dfs_auth_change", handleAuthChange);
    return () => window.removeEventListener("dfs_auth_change", handleAuthChange);
  }, [token]);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token: authToken, user: userData } = res.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("dfs_token", authToken);
    localStorage.setItem("dfs_user", JSON.stringify(userData));
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await signupUser({ name, email, password });
    const { token: authToken, user: userData } = res.data;
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("dfs_token", authToken);
    localStorage.setItem("dfs_user", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("dfs_token");
    localStorage.removeItem("dfs_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
