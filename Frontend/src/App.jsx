import { useAuth } from "./context/AuthContext";

import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

import ViewSharedFile from "./pages/ViewSharedFile";
import DMCA from "./pages/DMCA";
import ResetPassword from "./pages/ResetPassword";
import Trash from "./pages/Trash";

import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

import AccountSettings from "./pages/AccountSettings";

import AppLayout from "./layouts/AppLayout";
import SeoArticleLayout from "./layouts/SeoArticleLayout";

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

import CloudStorageMain from "./pages/SeoMainCloudStorage";
import BlogIndex from "./pages/BlogIndex";
import SecureCloudStorageGuide from "./pages/blog/SecureCloudStorageGuide";
import EncryptedCloudStorageExplained from "./pages/blog/EncryptedCloudStorageExplained";
import BestCloudStorageIndia from "./pages/blog/BestCloudStorageIndia";
import GoogleDriveAlternatives from "./pages/blog/GoogleDriveAlternatives";
import CloudStoragePrivacyGuide from "./pages/blog/CloudStoragePrivacyGuide";
import ZeroKnowledgeEncryptionGuide from "./pages/blog/ZeroKnowledgeEncryptionGuide";
import SanityBlogPage from "./pages/blog/SanityBlogPage";
import Faq from "./pages/Faq";
import DeleteAccount from "./pages/DeleteAccount";


import {
  SecureCloudStorage,
  PrivateCloudStorage,
  EncryptedCloudStorage,
  FreeCloudStorage,
  CloudStorageIndia,
} from "./pages/SeoPages";

/**
 * Android app should not open like a website.
 * Browser: "/" shows Home page.
 * Android app: "/" goes directly to dashboard.
 *
 * If user is not logged in, your ProtectedRoute should send them to /login.
 */
function RootRoute() {
  const isAndroidApp = Capacitor.getPlatform() === "android";
  const { user } = useAuth();

  if (isAndroidApp) {
    return <Navigate to={user ? "/dashboard" : "/login"} replace />;
  }

  return <Home />;
}

/**
 * SEO/blog/marketing pages are useful for website,
 * but not for the Android app experience.
 *
 * If someone opens those routes inside Android app,
 * redirect them back to dashboard.
 */
function WebsiteOnly({ children }) {
  const isAndroidApp = Capacitor.getPlatform() === "android";
  const { user } = useAuth();

  if (isAndroidApp) {
    return <Navigate to={user ? "/dashboard" : "/login"} replace />;
  }

  return children;
}

export default function App() {
  // Global preview state
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const previewFileRef = useRef(null);
  const locationRef = useRef(location);
  const lastBackPressRef = useRef(0);

  const openPreview = (file, files) => {
    if (!file || file.isFolder) return;
    setPreviewFiles(files);
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  useEffect(() => {
    previewFileRef.current = previewFile;
    locationRef.current = location;
  }, [previewFile, location]);

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;

    let backHandler = null;

    const setupListener = async () => {
      backHandler = await CapacitorApp.addListener("backButton", () => {
        // 1. Close preview first
        if (previewFileRef.current) {
          closePreview();
          return;
        }

        const currentPath = locationRef.current.pathname;

        // 2. If user is inside app pages, go back
        if (
          currentPath !== "/" &&
          currentPath !== "/dashboard" &&
          currentPath !== "/login" &&
          currentPath !== "/signup"
        ) {
          navigate(-1);
          return;
        }

        // 3. Double press to exit on main app/auth screens
        const now = Date.now();

        if (now - lastBackPressRef.current < 2000) {
          CapacitorApp.exitApp();
        } else {
          lastBackPressRef.current = now;
        }
      });
    };

    setupListener();

    return () => {
      if (backHandler && typeof backHandler.remove === "function") {
        backHandler.remove();
      }
    };
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* Public file viewer */}
        <Route path="/view/:token" element={<ViewSharedFile />} />

        {/* SEO + Marketing Public Content Layout - Website only */}
        <Route
          element={
            <WebsiteOnly>
              <SeoArticleLayout />
            </WebsiteOnly>
          }
        >
          {/* Marketing Mega Page */}
          <Route path="/cloud-storage" element={<CloudStorageMain />} />

          {/* SEO Article Pages */}
          <Route path="/secure-cloud-storage" element={<SecureCloudStorage />} />
          <Route path="/private-cloud-storage" element={<PrivateCloudStorage />} />
          <Route path="/encrypted-cloud-storage" element={<EncryptedCloudStorage />} />
          <Route path="/free-cloud-storage" element={<FreeCloudStorage />} />
          <Route path="/cloud-storage-india" element={<CloudStorageIndia />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/secure-cloud-storage-guide" element={<SecureCloudStorageGuide />} />
          <Route
            path="/blog/encrypted-cloud-storage-explained"
            element={<EncryptedCloudStorageExplained />}
          />
          <Route path="/blog/best-cloud-storage-india" element={<BestCloudStorageIndia />} />
          <Route path="/blog/google-drive-alternatives" element={<GoogleDriveAlternatives />} />
          <Route path="/blog/cloud-storage-privacy-guide" element={<CloudStoragePrivacyGuide />} />
          <Route
            path="/blog/how-zero-knowledge-encryption-works"
            element={<ZeroKnowledgeEncryptionGuide />}
          />

          <Route path="/blog/:slug" element={<SanityBlogPage />} />

          {/* FAQ */}
          <Route path="/faq" element={<Faq />} />
        </Route>

        {/* Everything else uses AppLayout */}
        <Route element={<AppLayout />}>
          {/* Public pages */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<RootRoute />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
          </Route>

          {/* App pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard openPreview={openPreview} />} />
            <Route path="/files" element={<Files openPreview={openPreview} />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/trash" element={<Trash />} />

            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/settings/security" element={<SettingsSecurity />} />
          </Route>
        </Route>
      </Routes>

      {/* Global preview */}
      <ImagePreview
        files={previewFiles}
        activeFile={previewFile}
        onClose={closePreview}
      />
    </>
  );
}