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
  
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
  let cancelled = false;

  // 🔓 DO NOT CHECK AUTH FOR PUBLIC SHARE LINKS
  if (window.location.pathname.startsWith("/view/")) {
    setUser(null);
    setLoading(false);
    return;
  }

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
    } catch (err) {
 if (err.status === 403 || err.data?.message === "Account suspended") {

    // account suspended
    setSuspended(true);
    setUser(null);
  } else {
    // normal logout / token invalid
    setSuspended(false);
    setUser(null);
  }
} finally {
  if (!cancelled) setLoading(false);
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
  try {
    await apiLogin(email, password);

    const data = await getMe(); // will throw 403 if suspended

    setSuspended(false);
    setUser({
      id: data._id || data.id,
      email: data.email,
      storageLimit: data.storageLimit,
      usedStorage: data.usedStorage,
      plan: data.plan,
    });
  } catch (err) {
  if (err.status === 403 || err.data?.message === "Account suspended") {
    // 🚫 suspended account
    setSuspended(true);
    setUser(null);
    return; // do NOT throw
  }

  throw err; // real login error
}

};



  const logout = async () => {
    await apiLogout();
    setUser(null);
    setSuspended(false);
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

if (suspended) {
  return (
    <AuthContext.Provider value={{ user: null, loading: false, signup, login, logout, suspended }}>
      {children}
    </AuthContext.Provider>
  );
}



  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, suspended }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
