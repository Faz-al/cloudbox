import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSmartBiometricLock from "../hooks/useSmartBiometricLock";


export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

    // 🔐 Biometric lock for logged-in users only
useSmartBiometricLock();

  return <Outlet />;
}
