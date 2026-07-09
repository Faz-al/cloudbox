import { createContext, useContext, useEffect, useState } from "react";
import { Capacitor, CapacitorCookies } from "@capacitor/core";
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getMe,
  saveMobileAuthToken,
  clearMobileAuthToken,
  getMobileAuthToken,
} from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [suspended, setSuspended] = useState(false);

  const normalizeUser = (data) => ({
    id: data._id || data.id,
    email: data.email,
    storageLimit: data.storageLimit,
    usedStorage: data.usedStorage,
    plan: data.plan,
  });

  useEffect(() => {
    let cancelled = false;

    if (window.location.pathname.startsWith("/view/")) {
      setUser(null);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
  try {
    if (Capacitor.getPlatform() === "android") {
      const savedToken = await getMobileAuthToken();
      alert(savedToken ? "STARTUP: token found" : "STARTUP: no token found");
    }

    const data = await getMe();

    if (cancelled) return;

    if (Capacitor.getPlatform() === "android") {
      alert("STARTUP: /auth/me success");
    }

    setSuspended(false);
    setUser(normalizeUser(data));
  } catch (err) {
    if (Capacitor.getPlatform() === "android") {
      alert(
        `STARTUP: /auth/me failed - ${err?.status || "no status"} - ${
          err?.message || "unknown"
        }`
      );
    }
        if (cancelled) return;

        if (err.status === 403 || err.data?.message === "Account suspended") {
          setSuspended(true);
          setUser(null);
        } else {
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
  };

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    
   if (res?.token) {
  await saveMobileAuthToken(res.token);

  if (Capacitor.getPlatform() === "android") {
    const savedToken = await getMobileAuthToken();
    alert(savedToken ? "LOGIN: token saved" : "LOGIN: token NOT saved");
  }
}

    if (res?.requires2FA === true) {
      return {
        requires2FA: true,
        userId: res.userId,
      };
    }

    const data = await getMe();

    setSuspended(false);
    setUser(normalizeUser(data));

    return { success: true };
  };

  const refreshUser = async () => {
    const data = await getMe();

    setSuspended(false);
    setUser(normalizeUser(data));

    return data;
  };

  const logout = async () => {
  setLoggingOut(true);

  // Clear frontend immediately so protected pages stop rendering.
  setUser(null);
  setSuspended(false);

  try {
    await apiLogout();
  } catch (err) {
    console.error("Logout request failed", err);
  }

  try {
    if (Capacitor.getPlatform() === "android") {
      await CapacitorCookies.clearCookies({
        url: "https://api.safevault.in",
      });

      await CapacitorCookies.clearCookies({
        url: "https://api.safevault.in/api",
      });

      await CapacitorCookies.clearAllCookies();
    }
  } catch (err) {
    console.error("Failed to clear native cookies", err);
  }

 try {
 await clearMobileAuthToken();
localStorage.removeItem("lastFolder");
sessionStorage.clear();
} catch {
  // ignore cleanup errors
}

  setLoggingOut(false);
};

  if (loading || loggingOut) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="h-14 bg-white border-b" />

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
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          loggingOut,
          signup,
          login,
          logout,
          refreshUser,
          suspended,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loggingOut,
        signup,
        login,
        logout,
        refreshUser,
        suspended,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);