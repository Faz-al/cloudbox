const listeners = new Set();
let uploads = [];

const notify = () => {
  listeners.forEach((cb) => cb([...uploads]));
};

export const subscribeUploads = (cb) => {
  listeners.add(cb);
  cb([...uploads]);
  return () => listeners.delete(cb);
};

export const startUploads = (files, parentFolder = null) => {
  files.forEach((file) => {
    const xhr = new XMLHttpRequest();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);


    const upload = {
      id,
      name: file.name,
      progress: 0,
      status: "uploading",
      xhr,
    };

    uploads.push(upload);
    notify();

    const formData = new FormData();
    formData.append("file", file);
    if (parentFolder) formData.append("parent", parentFolder);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        upload.progress = Math.round((e.loaded / e.total) * 100);
        notify();
      }
    };

    xhr.onload = () => {
      upload.progress = 100;
      upload.status = "done";
      notify();
    };

    xhr.onerror = () => {
      upload.status = "error";
      notify();
    };

    xhr.open("POST", "http://localhost:5000/api/files/upload");
    xhr.withCredentials = true;
    xhr.send(formData);
  });
};

export const cancelUpload = (id) => {
  const upload = uploads.find((u) => u.id === id);
  if (!upload) return;

  upload.xhr.abort();
  uploads = uploads.filter((u) => u.id !== id);
  notify();
};

export const getActiveCount = () =>
  uploads.filter((u) => u.status === "uploading").length;
