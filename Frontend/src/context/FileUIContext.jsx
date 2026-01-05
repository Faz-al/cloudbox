import { createContext, useContext, useState } from "react";
import ImagePreview from "../components/ImagePreview";

const FileUIContext = createContext();

export function FileUIProvider({ children }) {
  const [preview, setPreview] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);

  const openPreview = (file, files) => {
    if (!file || file.isFolder) return;
    setPreviewFiles(files);
    setPreview(file);
  };

  const closePreview = () => setPreview(null);

  return (
    <FileUIContext.Provider
      value={{
        openPreview,
      }}
    >
      {children}

      <ImagePreview
        files={previewFiles}
        activeFile={preview}
        onClose={closePreview}
      />
    </FileUIContext.Provider>
  );
}

export const useFileUI = () => useContext(FileUIContext);
