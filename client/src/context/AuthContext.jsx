import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api.js";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  const stored = localStorage.getItem("pds_user");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem("pds_user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    // Remove legacy bearer tokens created by older versions of the app.
    localStorage.removeItem("pds_token");
  }, []);
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.removeItem("pds_token");
    localStorage.setItem("pds_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("pds_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("pds_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("pds_token");
      localStorage.removeItem("pds_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
