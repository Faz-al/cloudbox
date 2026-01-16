import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";


// 🔒 PropellerAds: allow ONLY on public view pages
(function () {
  const isPublicView = /^\/view\/[^/]+/.test(window.location.pathname);

  if (!isPublicView) {
    // Hard-disable Propeller everywhere else
    window.propellerAdsDisabled = true;

    // Block pop attempts defensively
    const originalOpen = window.open;
    window.open = function (...args) {
      if (window.propellerAdsDisabled) return null;
      return originalOpen.apply(this, args);
    };
  }
})();









const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
