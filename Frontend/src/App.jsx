import { Routes, Route } from "react-router-dom";
import { useState } from "react";



import AccountSettings from "./pages/AccountSettings";
import AppLayout from "./layouts/AppLayout";

import SettingsSecurity from "./pages/SettingsSecurity";
import Vault from "./pages/Vault";



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
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="/dashboard"
    element={<Dashboard openPreview={openPreview} />}
  />

  <Route
    path="/files"
    element={<Files openPreview={openPreview} />}
  />

  <Route path="/vault" element={<Vault />} />



  <Route path="/upgrade" element={<Upgrade />} />

  <Route path="/account" element={<AccountSettings />} />

  <Route path="/settings/security" element={<SettingsSecurity />} />




</Route>


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
