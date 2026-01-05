export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";


const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
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

export const getMe = async () => {
  const data = await apiFetch("/auth/me");
  return { id: data.userId };
};


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


export const deleteFile = (id) =>
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
