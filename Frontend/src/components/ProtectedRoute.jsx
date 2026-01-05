import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 🔑 CRITICAL: wait for auth check
  if (loading) {
    return null; // or loader later
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
