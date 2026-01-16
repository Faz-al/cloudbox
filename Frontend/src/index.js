import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// 🔒 BLOCK PROPELLER ADS OUTSIDE /view/:token
(function () {
  const isPublicView = /^\/view\/[^/]+/.test(window.location.pathname);

  if (!isPublicView) {
    window.propellerAdsDisabled = true;

    window.open = function () {
      return null;
    };

    document.addEventListener(
      "click",
      function (e) {
        e.stopImmediatePropagation();
      },
      true
    );
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
