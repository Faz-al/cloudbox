import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Upgrade from "./pages/Upgrade";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ImagePreview from "./components/ImagePreview";

export default function App() {
  // 🔥 GLOBAL PREVIEW STATE
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);

  const openPreview = (file, files) => {
    if (!file || file.isFolder) return;
    setPreviewFiles(files);
    setPreviewFile(file);
  };

  const closePreview = () => setPreviewFile(null);

  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard openPreview={openPreview} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <Files openPreview={openPreview} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 🔥 ONE GLOBAL PREVIEW */}
      <ImagePreview
        files={previewFiles}
        activeFile={previewFile}
        onClose={closePreview}
      />
    </>
  );
}
