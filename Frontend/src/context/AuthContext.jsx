import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getMe,
} from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on page load only
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMe();
        setUser(data);

      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ FIXED SIGNUP (NO getMe HERE)
  const signup = async (email, password) => {
    const data = await apiSignup(email, password);
    setUser(data.user);
  };

  // ✅ FIXED LOGIN (NO getMe HERE)
  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
