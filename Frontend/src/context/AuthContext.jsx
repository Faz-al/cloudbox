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
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  let cancelled = false;

  const checkAuth = async () => {
    try {
      const data = await getMe();
      if (cancelled) return;

      setUser({
        id: data._id || data.id,
        email: data.email,
        storageLimit: data.storageLimit,
        usedStorage: data.usedStorage,
        plan: data.plan,
      });
    } catch {
      if (!cancelled) setUser(null);
    }
  };

  checkAuth();

  return () => {
    cancelled = true;
  };
}, []);



  const signup = async (email, password) => {
  await apiSignup(email, password);
  // DO NOT set user
};


  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setUser({
      id: data.user._id || data.user.id,
      email: data.user.email,
      storageLimit: data.user.storageLimit,
      usedStorage: data.user.usedStorage,
      plan: data.user.plan,
    });
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
