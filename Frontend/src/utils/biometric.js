import { NativeBiometric } from "capacitor-native-biometric";

export async function biometricLogin() {
  try {
    await NativeBiometric.verifyIdentity({
      reason: "Unlock SafeVault",
      title: "SafeVault Security",
      subtitle: "Authenticate",
      description: "Use fingerprint or face ID"
    });
    return true;
  } catch (e) {
    console.log("Biometric failed", e);
    return false;
  }
}
