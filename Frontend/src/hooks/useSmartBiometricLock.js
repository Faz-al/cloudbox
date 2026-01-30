import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";
import { NativeBiometric } from "capacitor-native-biometric";

export default function useSmartBiometricLock() {
  const locked = useRef(false);

  async function lockApp() {
    if (locked.current) return;
    locked.current = true;

    try {
      await NativeBiometric.verifyIdentity({
        reason: "Unlock SafeVault",
        title: "SafeVault Security",
        subtitle: "Authenticate",
        description: "Use fingerprint or face ID"
      });
    } catch (e) {
      alert("Authentication failed");
    }

    locked.current = false;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Run biometric when app comes to foreground
    App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        lockApp();
      }
    });

    // Run biometric on first load
    lockApp();
  }, []);
}
