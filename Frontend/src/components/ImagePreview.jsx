import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../utils/api";


export default function ImagePreview({ files = [], activeFile, onClose }) {
  const [index, setIndex] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const touchStartX = useRef(0);
const touchStartY = useRef(0);
const touchEndX = useRef(0);
const touchEndY = useRef(0);
const videoRef = useRef(null);







  /* ---------- SYNC INDEX ---------- */
  useEffect(() => {
    if (!activeFile || !files.length) {
      setIndex(null);
      return;
    }

    const i = files.findIndex((f) => f._id === activeFile._id);
    if (i === -1) onClose();
    else {
      setIndex(i);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setShowInfo(false);
    }
  }, [activeFile, files, onClose]);

  /* ---------- KEYBOARD ---------- */
  useEffect(() => {
    if (index === null) return;

    const key = (e) => {
      if (e.key === "Escape") {
        setShowInfo(false);
        onClose();
      }
      if (e.key === "ArrowRight" && index < files.length - 1)
        setIndex((i) => i + 1);
      if (e.key === "ArrowLeft" && index > 0)
        setIndex((i) => i - 1);
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, files.length, onClose]);

  if (index === null || !files[index]) return null;

  const file = files[index];
  const isVideo = file.type?.startsWith("video");

  /* ---------- INTERACTIONS ---------- */

  const onWheel = (e) => {
    if (isVideo) return;
    e.preventDefault();
    setShowInfo(false);
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.min(3, Math.max(1, z + delta)));
  };

  const onMouseDown = (e) => {
    if (isVideo || zoom === 1) return;
    setShowInfo(false);
    isDragging.current = true;
    startX.current = e.clientX - offset.x;
    startY.current = e.clientY - offset.y;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    setOffset({
      x: e.clientX - startX.current,
      y: e.clientY - startY.current,
    });
  };

  const onMouseUp = () => (isDragging.current = false);

  const MIN_SWIPE_DISTANCE = 50;

const onTouchStart = (e) => {
  const touch = e.touches[0];
  touchStartX.current = touch.clientX;
  touchStartY.current = touch.clientY;
};

const onTouchMove = (e) => {
  const touch = e.touches[0];
  touchEndX.current = touch.clientX;
  touchEndY.current = touch.clientY;
};

const onTouchEnd = (e) => {
  e.stopPropagation();

  const dx = touchEndX.current - touchStartX.current;
  const dy = touchEndY.current - touchStartY.current;

  if (Math.abs(dx) < Math.abs(dy)) return;

  let didChange = false;

  if (dx > MIN_SWIPE_DISTANCE && index > 0) {
    setIndex((i) => i - 1);
    didChange = true;
  }

  if (dx < -MIN_SWIPE_DISTANCE && index < files.length - 1) {
    setIndex((i) => i + 1);
    didChange = true;
  }

  // 👇 EXACTLY BELOW swipe logic
  if (didChange) {
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 120);
  }
};










  /* ---------- UI ---------- */

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl"
      onClick={() => {
        setShowInfo(false);
        onClose();
      }}
    >
      {/* TOP BAR */}
      <div
        className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-6 text-white bg-gradient-to-b from-black/60 to-transparent z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="truncate text-sm font-medium tracking-wide">
          {file.name}
        </div>

        <div className="flex gap-6 items-center text-sm">
          {!isVideo && (
            <>
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
                ＋
              </button>
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>
                －
              </button>
            </>
          )}

          <button onClick={() => setShowInfo((v) => !v)}>Info</button>

          <a
            href={`${API_BASE}/files/download/${file._id}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>

          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* MEDIA STAGE */}
      <div
  className="absolute inset-0 flex items-center justify-center"
  onClick={(e) => {
    e.stopPropagation();
    setShowInfo(false);
  }}
  onWheel={onWheel}
  onMouseDown={onMouseDown}
  onMouseMove={onMouseMove}
  onMouseUp={onMouseUp}
  onMouseLeave={onMouseUp}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  style={{ touchAction: "pan-y" }}

>

        {index > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index - 1);
            }}
            className="absolute left-4 text-white text-5xl opacity-70 hover:opacity-100"
          >
            ‹
          </button>
        )}

        {index < files.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index + 1);
            }}
            className="absolute right-4 text-white text-5xl opacity-70 hover:opacity-100"
          >
            ›
          </button>
        )}

        {isVideo ? (
  <video
    ref={videoRef}
    src={`${API_BASE}/files/${file._id}/preview`}
    controls
    playsInline
    muted
    preload="metadata"
    className="max-w-full max-h-[80vh] rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)] bg-black"
  />
) : (

          <img
            src={`${API_BASE}/files/${file._id}/preview`}

            alt={file.name}
            draggable={false}
            className="select-none max-w-full max-h-[80vh] rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? "grab" : "default",
            }}
          />
        )}

        <div className="absolute bottom-6 text-xs text-gray-300">
          {index + 1} / {files.length}
        </div>
      </div>

      {/* INFO DRAWER */}
      {showInfo && (
        <aside
          className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l shadow-2xl z-40 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-semibold mb-6 text-lg">File details</h3>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <div className="text-gray-500">Name</div>
              <div className="break-all font-medium">{file.name}</div>
            </div>

            <div>
              <div className="text-gray-500">Type</div>
              <div>{file.type}</div>
            </div>

            <div>
              <div className="text-gray-500">Size</div>
              <div>{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>

            <div>
              <div className="text-gray-500">Uploaded</div>
              <div>{new Date(file.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
