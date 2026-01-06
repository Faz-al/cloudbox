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
  const [loading, setLoading] = useState(true); // 🔥 START TRUE

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
      } finally {
        if (!cancelled) setLoading(false); // 🔥 END LOADING
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const signup = async (email, password) => {
    await apiSignup(email, password);
    // ✅ signup does NOT log in
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

  // 🔒 GLOBAL AUTH GATE (THIS PREVENTS FLICKER)
  // do not edit, or remove if removed- it might skip auth check or trust cookies blindly
  // or render dashboard before /me



  if (loading) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar placeholder */}
      <div className="h-14 bg-white border-b" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-white rounded-xl border"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
