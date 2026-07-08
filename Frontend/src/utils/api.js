export const API_BASE = "https://api.safevault.in/api";


export const getMobileAuthToken = () => {
  try {
    return localStorage.getItem("safevault_mobile_token");
  } catch {
    return null;
  }
};

export const saveMobileAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("safevault_mobile_token", token);
    }
  } catch {
    // ignore storage errors
  }
};

export const clearMobileAuthToken = () => {
  try {
    localStorage.removeItem("safevault_mobile_token");
  } catch {
    // ignore storage errors
  }
};




const apiFetch = async (url, options = {}) => {
  const token = getMobileAuthToken();

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

  // 🔒 Hard block suspended users
  

 if (!res.ok) {
  const message = data?.message || "Request failed";

  // 🔒 Vault locked → show toast, don't crash app
  if (message === "Vault locked") {
    window.dispatchEvent(
      new CustomEvent("toast", {
        detail: {
          type: "error",
          message: "Vault is locked",
        },
      })
    );
    return null; // IMPORTANT: do not throw
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

export const logout = () =>
  apiFetch("/auth/logout", { method: "POST" });

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
export const getFiles = (query = "") =>
  apiFetch(`/files${query}`);


export const uploadFile = async (file, parent = null) => {
  const formData = new FormData();
  formData.append("file", file);
  if (parent) formData.append("parent", parent);

  const res = await fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
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

export const getVaultFiles = () =>
  apiFetch("/files/vault");



export const unvaultFile = (id) =>
  apiFetch(`/files/vault/${id}`, {
    method: "DELETE",
  });


export const getVaultStatus = () =>
  apiFetch("/files/vault/status");


export const vaultFile = (id) =>
  apiFetch(`/files/vault/${id}`, {
    method: "POST",
  });




/* ===== VIEWER ACCESS (PHASE 3) ===== */

export const checkViewerAccess = (fileId) =>
  apiFetch(`/viewer/access/${fileId}`);

export const grantViewerAccess = (fileId, tier) =>
  apiFetch("/viewer/grant", {
    method: "POST",
    body: JSON.stringify({ fileId, tier }),
  });
