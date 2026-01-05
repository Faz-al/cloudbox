import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // wait for /me check
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
