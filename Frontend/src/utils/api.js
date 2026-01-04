const API_BASE = "http://localhost:5000/api";

export const getFiles = async () => {
  const res = await fetch(`${API_BASE}/files`);
  return res.json();
};

export const uploadFile = async (file) => {
  const res = await fetch(`${API_BASE}/files/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(file),
  });
  return res.json();
};

export const deleteFile = async (id) => {
  await fetch(`${API_BASE}/files/${id}`, {
    method: "DELETE",
  });
};
