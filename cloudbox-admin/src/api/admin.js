import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const adminApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const login = (data) => adminApi.post("/admin/auth/login", data);
export const getMe = () => adminApi.get("/admin/auth/me");

export const getStats = () => adminApi.get("/admin/stats");
export const getUsers = () => adminApi.get("/admin/users");
export const suspendUser = (id, reason) =>
  adminApi.post(`/admin/users/${id}/suspend`, { reason });

export const getFiles = () => adminApi.get("/admin/files");
export const deleteFile = (id) => adminApi.delete(`/admin/files/${id}`);

export const downloadFile = (id) =>
  window.open(`${API_BASE}/admin/files/${id}/download`);

export const flagFile = (id, reason) =>
  adminApi.post(`/admin/files/${id}/flag`, { reason });

export const getActivity = () => adminApi.get("/admin/activity");

export const unsuspendUser = (id) =>
  adminApi.post(`/admin/users/${id}/unsuspend`);


// ===== DMCA =====
export const getDmcaReports = () => adminApi.get("/admin/dmca");

export const dmcaDeleteFile = (id) =>
  adminApi.post(`/admin/dmca/${id}/delete-file`);

export const dmcaSuspendUser = (id) =>
  adminApi.post(`/admin/dmca/${id}/suspend-user`);

export const dmcaResolve = (id, status) =>
  adminApi.post(`/admin/dmca/${id}/resolve`, { status });

