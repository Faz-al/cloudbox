import { useEffect, useRef, useState } from "react";
import {
  X,
  Info,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
} from "lucide-react";
import { API_BASE } from "../utils/api";
import { App } from "@capacitor/app";

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
  const showInfoRef = useRef(false);

  /* ---------- SYNC ACTIVE FILE ---------- */

  useEffect(() => {
    if (!activeFile || !files.length) {
      setIndex(null);
      return;
    }

    const i = files.findIndex((f) => f._id === activeFile._id);

    if (i === -1) {
      onClose();
      return;
    }

    setIndex(i);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setShowInfo(false);
  }, [activeFile, files, onClose]);

  /* ---------- RESET WHEN FILE CHANGES ---------- */

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setShowInfo(false);
  }, [index]);

  useEffect(() => {
  showInfoRef.current = showInfo;
}, [showInfo]);

  /* ---------- KEYBOARD ---------- */

  useEffect(() => {
    if (index === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();

        if (showInfo) {
          setShowInfo(false);
        } else {
          onClose();
        }
      }

      if (e.key === "ArrowRight" && index < files.length - 1) {
        setIndex((i) => i + 1);
      }

      if (e.key === "ArrowLeft" && index > 0) {
        setIndex((i) => i - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, files.length, onClose, showInfo]);


    const handleClose = () => {
    setShowInfo(false);
    onClose();
  };

    /* ---------- ANDROID / BROWSER BACK ---------- */
useEffect(() => {
  if (index === null) return;

  let backButtonListener;
  let cancelled = false;

  const setupBackHandler = async () => {
    try {
      const listener = await App.addListener(
        "backButton",
        () => {
          if (showInfoRef.current) {
            setShowInfo(false);
            return;
          }

          handleClose();
        }
      );

      if (cancelled) {
        listener.remove();
      } else {
        backButtonListener = listener;
      }
    } catch {
      // Browser fallback
    }
  };

  setupBackHandler();

  const handlePopState = () => {
    if (showInfoRef.current) {
      setShowInfo(false);
    } else {
      handleClose();
    }
  };

  window.history.pushState(
    { imagePreviewOpen: true },
    "",
    window.location.href
  );

  window.addEventListener("popstate", handlePopState);

  return () => {
    cancelled = true;

    window.removeEventListener("popstate", handlePopState);

    if (backButtonListener) {
      backButtonListener.remove();
    }
  };
}, []);


  if (index === null || !files[index]) return null;

  const file = files[index];
  const isVideo = file.type?.startsWith("video");

  const goPrevious = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  };

  const goNext = () => {
    if (index < files.length - 1) {
      setIndex((i) => i + 1);
    }
  };

  /* ---------- ZOOM ---------- */

  const increaseZoom = () => {
    setZoom((z) => Math.min(3, Number((z + 0.25).toFixed(2))));
  };

  const decreaseZoom = () => {
    setZoom((z) => {
      const nextZoom = Math.max(1, Number((z - 0.25).toFixed(2)));

      if (nextZoom === 1) {
        setOffset({ x: 0, y: 0 });
      }

      return nextZoom;
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  /* ---------- MOUSE INTERACTIONS ---------- */

  const onWheel = (e) => {
    if (isVideo) return;

    e.preventDefault();

    const delta = e.deltaY < 0 ? 0.15 : -0.15;

    setZoom((z) => {
      const nextZoom = Math.min(3, Math.max(1, z + delta));

      if (nextZoom === 1) {
        setOffset({ x: 0, y: 0 });
      }

      return nextZoom;
    });
  };

  const onMouseDown = (e) => {
    if (isVideo || zoom === 1) return;

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

  const onMouseUp = () => {
    isDragging.current = false;
  };

  /* ---------- TOUCH / SWIPE ---------- */

  const MIN_SWIPE_DISTANCE = 55;

  const onTouchStart = (e) => {
    const touch = e.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;

    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;
  };

  const onTouchMove = (e) => {
    const touch = e.touches[0];

    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;
  };

  const onTouchEnd = (e) => {
    const dx = touchEndX.current - touchStartX.current;
    const dy = touchEndY.current - touchStartY.current;

    if (Math.abs(dx) < Math.abs(dy)) return;

    if (Math.abs(dx) < MIN_SWIPE_DISTANCE) return;

    if (dx > 0 && index > 0) {
      goPrevious();
    }

    if (dx < 0 && index < files.length - 1) {
      goNext();
    }
  };

  const formatFileSize = (size) => {
    if (!size) return "Unknown";

    const units = ["B", "KB", "MB", "GB", "TB"];

    let value = size;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${
      units[unitIndex]
    }`;
  };

  

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0B0D12]"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${file.name}`}
    >
      {/* ---------- PREMIUM TOP BAR ---------- */}

      <div
        className="
          absolute inset-x-0 top-0 z-40
          bg-gradient-to-b from-black/75 via-black/35 to-transparent
          px-4
          pt-[max(env(safe-area-inset-top),16px)]
          pb-8
        "
      >
        <div className="flex items-center justify-between gap-3">
          {/* FILE NAME */}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-full border border-white/10 bg-white/10
                text-white backdrop-blur-xl
              "
            >
              <FileText size={18} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-white">
                {file.name}
              </div>

              <div className="mt-0.5 text-xs text-white/55">
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInfo((v) => !v)}
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full border border-white/10
                bg-white/10 text-white
                backdrop-blur-xl
                transition active:scale-95
                hover:bg-white/20
              "
              aria-label="File information"
            >
              <Info size={20} />
            </button>

            <a
              href={`${API_BASE}/files/download/${file._id}`}
              target="_blank"
              rel="noreferrer"
              className="
                hidden sm:flex h-11 w-11 items-center justify-center
                rounded-full border border-white/10
                bg-white/10 text-white
                backdrop-blur-xl
                transition active:scale-95
                hover:bg-white/20
              "
              aria-label="Download file"
            >
              <Download size={20} />
            </a>

            {/* CLEAR, LARGE CLOSE BUTTON */}

            <button
              type="button"
              onClick={handleClose}
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full
                bg-white text-[#111318]
                shadow-lg shadow-black/30
                transition active:scale-95
              "
              aria-label="Close preview"
            >
              <X size={21} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- MEDIA STAGE ---------- */}

      <div
        className="absolute inset-0 flex items-center justify-center px-3 py-24"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          touchAction: "pan-y",
        }}
      >
        {/* PREVIOUS */}

        {index > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrevious();
            }}
            className="
              absolute left-3 z-30
              hidden sm:flex
              h-12 w-12 items-center justify-center
              rounded-full border border-white/10
              bg-black/30 text-white
              backdrop-blur-xl
              transition hover:bg-black/60
              active:scale-95
            "
            aria-label="Previous file"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* NEXT */}

        {index < files.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="
              absolute right-3 z-30
              hidden sm:flex
              h-12 w-12 items-center justify-center
              rounded-full border border-white/10
              bg-black/30 text-white
              backdrop-blur-xl
              transition hover:bg-black/60
              active:scale-95
            "
            aria-label="Next file"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* VIDEO */}

        {isVideo ? (
          <video
            ref={videoRef}
            src={`${API_BASE}/files/${file._id}/preview`}
            controls
            playsInline
            preload="metadata"
            className="
              max-h-full max-w-full
              rounded-2xl
              bg-black
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            "
          />
        ) : (
          <img
            src={`${API_BASE}/files/${file._id}/preview`}
            alt={file.name}
            draggable={false}
            className="
              max-h-full max-w-full
              select-none
              rounded-2xl
              object-contain
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
              transition-transform duration-150
            "
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? "grab" : "default",
            }}
          />
        )}
      </div>

      {/* ---------- IMAGE CONTROLS ---------- */}

      {!isVideo && (
        <div
          className="
            absolute bottom-[max(env(safe-area-inset-bottom),20px)]
            left-1/2 z-40
            -translate-x-1/2
          "
        >
          <div
            className="
              flex items-center gap-1
              rounded-2xl
              border border-white/10
              bg-black/45
              p-1.5
              text-white
              shadow-2xl
              backdrop-blur-2xl
            "
          >
            <button
              type="button"
              onClick={decreaseZoom}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl transition
                hover:bg-white/10 active:scale-95
              "
              aria-label="Zoom out"
            >
              <ZoomOut size={19} />
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="
                min-w-[62px] px-3
                text-xs font-semibold text-white/90
              "
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={increaseZoom}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl transition
                hover:bg-white/10 active:scale-95
              "
              aria-label="Zoom in"
            >
              <ZoomIn size={19} />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10" />

            <button
              type="button"
              onClick={resetZoom}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl transition
                hover:bg-white/10 active:scale-95
              "
              aria-label="Reset zoom"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- MOBILE FILE POSITION ---------- */}

      <div
        className="
  absolute bottom-[calc(max(env(safe-area-inset-bottom),22px)+68px)]
          left-1/2 z-30
          -translate-x-1/2
          rounded-full
          border border-white/10
          bg-black/35
          px-3 py-1.5
          text-xs font-medium text-white/70
          backdrop-blur-xl
          sm:hidden
          pointer-events-none
        "
      >
        {index + 1} of {files.length}
      </div>

      {/* ---------- INFO PANEL ---------- */}

      {showInfo && (
        <>
          <div
            className="absolute inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
            onClick={() => setShowInfo(false)}
          />

          <aside
            className="
              absolute z-50
              inset-x-0 bottom-0
              max-h-[75vh]
              overflow-y-auto
              rounded-t-[28px]
              bg-white
              p-6
              pb-[max(env(safe-area-inset-bottom),24px)]
              shadow-[0_-20px_80px_rgba(0,0,0,0.4)]
              sm:inset-y-0 sm:left-auto sm:right-0
              sm:max-h-none sm:w-[380px]
              sm:rounded-none
              sm:pb-6
            "
          >
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden" />

            <div className="mb-7 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  File details
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Information about this file
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full bg-gray-100
                  text-gray-700
                  transition hover:bg-gray-200
                "
                aria-label="Close information"
              >
                <X size={19} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
              <InfoRow label="Name" value={file.name} breakAll />

              <InfoRow
                label="Type"
                value={file.type || "Unknown"}
              />

              <InfoRow
                label="Size"
                value={formatFileSize(file.size)}
              />

              <InfoRow
                label="Uploaded"
                value={
                  file.createdAt
                    ? new Date(file.createdAt).toLocaleString()
                    : "Unknown"
                }
              />
            </div>

            <a
              href={`${API_BASE}/files/download/${file._id}`}
              target="_blank"
              rel="noreferrer"
              className="
                mt-6 flex w-full items-center justify-center gap-2
                rounded-2xl
                bg-[#15171C]
                px-4 py-3.5
                text-sm font-semibold text-white
                transition active:scale-[0.98]
              "
            >
              <Download size={18} />
              Download file
            </a>
          </aside>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value, breakAll = false }) {
  return (
    <div className="p-4">
      <div className="text-xs font-medium uppercase tracking-[0.12em] text-gray-400">
        {label}
      </div>

      <div
        className={`mt-1.5 text-sm font-medium text-gray-900 ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}