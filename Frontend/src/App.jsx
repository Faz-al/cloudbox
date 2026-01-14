import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import ViewSharedFile from "./pages/ViewSharedFile";
import DMCA from "./pages/DMCA";
import ResetPassword from "./pages/ResetPassword";


import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";



import AccountSettings from "./pages/AccountSettings";
import AppLayout from "./layouts/AppLayout";

import SettingsSecurity from "./pages/SettingsSecurity";
import Vault from "./pages/Vault";

import PublicLayout from "./layouts/PublicLayout";


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

  {/* Public file viewer */}
  <Route path="/view/:token" element={<ViewSharedFile />} />

  {/* Everything else uses AppLayout */}
  <Route element={<AppLayout />}>

    {/* Public pages */}
    <Route element={<PublicRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/dmca" element={<DMCA />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    
    </Route>

    {/* App pages */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard openPreview={openPreview} />} />
      <Route path="/files" element={<Files openPreview={openPreview} />} />
      <Route path="/vault" element={<Vault />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/account" element={<AccountSettings />} />
      <Route path="/settings/security" element={<SettingsSecurity />} />
    </Route>

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
