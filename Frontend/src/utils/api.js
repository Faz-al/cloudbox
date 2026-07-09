import { Preferences } from "@capacitor/preferences";

export const API_BASE = "https://api.safevault.in/api";

const MOBILE_TOKEN_KEY = "safevault_mobile_token";

export const getMobileAuthToken = async () => {
  try {
    const nativeToken = await Preferences.get({ key: MOBILE_TOKEN_KEY });

    if (nativeToken?.value) {
      return nativeToken.value;
    }

    return localStorage.getItem(MOBILE_TOKEN_KEY);
  } catch {
    try {
      return localStorage.getItem(MOBILE_TOKEN_KEY);
    } catch {
      return null;
    }
  }
};

export const saveMobileAuthToken = async (token) => {
  if (!token) return;

  try {
    localStorage.setItem(MOBILE_TOKEN_KEY, token);
  } catch {
    // ignore localStorage errors
  }

  try {
    await Preferences.set({
      key: MOBILE_TOKEN_KEY,
      value: token,
    });
  } catch {
    // ignore native storage errors
  }
};

export const clearMobileAuthToken = async () => {
  try {
    localStorage.removeItem(MOBILE_TOKEN_KEY);
  } catch {
    // ignore localStorage errors
  }

  try {
    await Preferences.remove({ key: MOBILE_TOKEN_KEY });
  } catch {
    // ignore native storage errors
  }
};

const apiFetch = async (url, options = {}) => {
  const token = await getMobileAuthToken();

  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || "Request failed";

    if (message === "Vault locked") {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            type: "error",
            message: "Vault is locked",
          },
        })
      );
    }

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

/* ===== AUTH ===== */
export const signup = (email, password) =>
  apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const login = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () => apiFetch("/auth/logout", { method: "POST" });

export const logoutEverywhere = () =>
  apiFetch("/auth/logout-all", { method: "POST" });

export const getMe = async () => {
  const data = await apiFetch("/auth/me");
  return data;
};

export const changePassword = (currentPassword, newPassword) =>
  apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const toggleEmail2FA = (body = {}) =>
  apiFetch("/auth/security/2fa-toggle", {
    method: "POST",
    body: JSON.stringify(body),
  });

/* ===== FILES ===== */
export const getFiles = (query = "") => apiFetch(`/files${query}`);

export const uploadFile = async (file, parent = null) => {
  const token = await getMobileAuthToken();

  const formData = new FormData();
  formData.append("file", file);
  if (parent) formData.append("parent", parent);

  const res = await fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");

  return data;
};

export const moveToTrash = (id) =>
  apiFetch(`/files/${id}`, { method: "DELETE" });

export const renameFile = (id, name) =>
  apiFetch(`/files/${id}/rename`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

export const createFolder = (name, parent = null) =>
  apiFetch("/files/folder", {
    method: "POST",
    body: JSON.stringify({ name, parent }),
  });

/* ===== VAULT ===== */
export const setupVaultPin = (pin) =>
  apiFetch("/files/vault/setup", {
    method: "POST",
    body: JSON.stringify({ pin }),
  });

export const unlockVault = (pin) =>
  apiFetch("/files/vault/unlock", {
    method: "POST",
    body: JSON.stringify({ pin }),
  });

export const getVaultFiles = () => apiFetch("/files/vault");

export const unvaultFile = (id) =>
  apiFetch(`/files/vault/${id}`, {
    method: "DELETE",
  });

export const getVaultStatus = () => apiFetch("/files/vault/status");

export const vaultFile = (id) =>
  apiFetch(`/files/vault/${id}`, {
    method: "POST",
  });

/* ===== VIEWER ACCESS ===== */
export const checkViewerAccess = (fileId) =>
  apiFetch(`/viewer/access/${fileId}`);

export const grantViewerAccess = (fileId, tier) =>
  apiFetch("/viewer/grant", {
    method: "POST",
    body: JSON.stringify({ fileId, tier }),
  });