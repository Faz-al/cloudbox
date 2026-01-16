import { useParams } from "react-router-dom";
import { API_BASE } from "../utils/api";
import { useEffect, useRef, useState } from "react";
import AdSlot from "../components/AdSlot";
import HouseAd from "../components/HouseAd";



// 🔒 Propeller load guard (GLOBAL for this page)
let propellerLoaded = false;



export default function ViewSharedFile() {
  const { token } = useParams();
  const videoRef = useRef();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [adReason, setAdReason] = useState(null); 



  const [showAd, setShowAd] = useState(false);
  const [unlockedUntil, setUnlockedUntil] = useState(0);
  const [currentGate, setCurrentGate] = useState(0);
  const [downloadAdsLeft, setDownloadAdsLeft] = useState(0);

  const infoUrl = `${API_BASE}/files/public/info/${token}`;
  const previewUrl = `${API_BASE}/files/public/preview/${token}`;
  const downloadUrl = `${API_BASE}/files/public/view/${token}`;

  // 15m, 45m, 90m, 3h
  const GATES = [900, 2700, 5400, 10800];

  useEffect(() => {
  fetch(infoUrl)
    .then(async (r) => {
      if (r.status === 410) {
        setDisabled(true);
        setLoading(false);
        return null;
      }

      if (!r.ok) throw new Error();

      return r.json();
    })
    .then((data) => {
      if (!data) return;
      setFile(data);
      setLoading(false);
    })
    .catch(() => {
      setError(true);
      setLoading(false);
    });
}, [token]);



useEffect(() => {
  propellerLoaded = false;
  window.__lastPopAt = 0;
}, [token]);





useEffect(() => {
  const i = setInterval(() => {
    fetch(infoUrl)
      .then((r) => {
        if (r.status === 410) {
          setDisabled(true);
        }
      })
      .catch(() => {});
  }, 3000); // every 3 seconds

  return () => clearInterval(i);
}, [token]);





  useEffect(() => {
  const v = videoRef.current;
  if (!v) return;

  if (showAd) {
    v.pause();
    v.controls = false;
  } else {
    v.controls = true;
  }
}, [showAd]);

  const isVideo = file?.type?.startsWith("video/");
  const isImage = file?.type?.startsWith("image/");

  const isQuickTime = file?.type === "video/quicktime"; // .mov


  /* ============ AD ENGINE ============ */


const firePopAd = () => {
  if (process.env.REACT_APP_ENABLE_POPADS !== "true") return;

  // 1️⃣ Load Propeller script ONLY ONCE
  if (!propellerLoaded) {
    const s = document.createElement("script");
    s.dataset.zone = "10472131";
    s.src = "https://al5sm.com/tag.min.js";
    s.async = true;

    document.body.appendChild(s);
    propellerLoaded = true;

    return; // ⛔ first interaction only loads script
  }

  // 2️⃣ Throttle pops (60s)
  if (window.__lastPopAt && Date.now() - window.__lastPopAt < 60000) return;
  window.__lastPopAt = Date.now();
};






const requireAd = (gate) => {
  firePopAd();              // 👈 ADD THIS

  const v = videoRef.current;
  if (!v) return;

  v.pause();
  v.controls = false;
  setCurrentGate(gate);
  setAdReason("video");
  setShowAd(true);
};




  const finishAd = () => {
    // Download flow
    if (downloadAdsLeft > 0) {
        firePopAd(); // ✅ ONE pop per modal ad

  setDownloadAdsLeft(prev => {
    const next = prev - 1;

    if (next === 0) {
      setTimeout(() => {
        setShowAd(false);
        window.location.href = downloadUrl;
      }, 100);
    } else {
      // keep showing next ad automatically
      setTimeout(() => {
        setShowAd(true);
      }, 50);
    }

    return next;
  });

  return;
}



    // Timeline unlock
    setUnlockedUntil(currentGate);
setShowAd(false);

if (videoRef.current) {
  videoRef.current.controls = true;   // restore controls
  videoRef.current.play();
}

  };

  /* ============ VIDEO GATING ============ */

  const handleTimeUpdate = () => {
    if (!isVideo || showAd) return;

    const t = videoRef.current.currentTime;

    // If crossed into locked zone
    if (t > unlockedUntil) {
      const gate = GATES.find(g => t <= g);
      if (gate) requireAd(gate);
    }
  };

  const handleSeeked = () => {
  const v = videoRef.current;
  if (!v) return;

  const t = v.currentTime;

  if (t > unlockedUntil) {
    v.currentTime = unlockedUntil; // snap back
    const gate = GATES.find(g => t <= g);
    if (gate) requireAd(gate);
  }
};




  



const startDownload = () => {         
  setAdReason("download");
  setShowAd(true);

  setTimeout(() => {
    setDownloadAdsLeft(2);
  }, 5000);
};







  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (disabled) {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      This link has been deleted or disabled.
    </div>
  );
}

if (error || !file) {
  return (
    <div className="min-h-screen flex items-center justify-center text-red-600">
      Invalid or expired link
    </div>
  );
}


  return (
    <div className="min-h-screen bg-slate-100 grid place-items-start p-6">

 <div className="bg-white w-full max-w-4xl rounded-xl shadow overflow-hidden mx-auto">


        
       <div className="border-b px-6 py-4 flex justify-between items-center bg-slate-50">

  <div className="flex items-center gap-2">
    <span className="font-bold text-blue-600">☁ CloudBox</span>
    <span className="text-xs text-gray-500">Secure file sharing</span>
  </div>

  <div className="flex items-center gap-4 text-sm">
  <a href="/" className="text-blue-600 hover:underline">
    Upload your own files
  </a>

  <a
    href={`/dmca?url=${encodeURIComponent(window.location.href)}`}
    className="text-red-600 hover:underline"
  >
    Report copyright
  </a>
</div>

</div>



      <div className="p-6 space-y-4 max-w-4xl mx-auto">

        {/* FILE INFO */}
<div className="border-b pb-4 space-y-1">

 

            <div className="text-xs text-gray-500">
  Shared via <span className="font-semibold">CloudBox</span> ·
  <a href="/" className="text-blue-600 ml-1 hover:underline">
    Upload your own files
  </a>
</div>


          <h1 className="text-lg font-semibold text-gray-900 truncate">
  {file.name}
</h1>

          <p className="text-sm text-gray-500">
            {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type}
          </p>
        </div>


             {/* SAFE ADSENSE PLACEMENT */}
{process.env.REACT_APP_ENABLE_ADS === "true" && (
  <div className="my-4 flex justify-center">
    <AdSlot
      slot="YOUR_ADSENSE_SLOT_ID"
      style={{ width: "100%", maxWidth: 728, height: 90 }}
    />
  </div>
)}







        {/* VIDEO / FILE */}
        {/* VIDEO / FILE */}
{isVideo && !isQuickTime ? (

  <div className="bg-slate-100 p-4 rounded-lg flex justify-center max-w-full overflow-hidden"
  onContextMenu={e => e.preventDefault()}
>

    <video
      draggable={false}
      ref={videoRef}
      src={previewUrl}
      className="w-full max-h-[70vh]"
      controls
      controlsList="nodownload"
      onTimeUpdate={handleTimeUpdate}
      onSeeked={handleSeeked}
      onPlay={() => {
        const v = videoRef.current;
        if (!v) return;
        if (v.currentTime > unlockedUntil) {
          v.pause();
          const gate = GATES.find(g => v.currentTime <= g);
          if (gate) requireAd(gate);
        }
      }}
    />
  </div>
) : isImage ? (
  <div
    className="flex justify-center"
    onContextMenu={e => e.preventDefault()}
  >
    <img
      draggable={false}
      src={previewUrl}
      alt={file.name}
      className="max-h-[70vh] rounded-lg shadow"
    />
  </div>
) : (
  <div className="border p-6 rounded text-center">
    <p>This file is ready to download</p>
  </div>
)}


{/* SAFE ADSENSE SLOT #2 – post-preview */}
{process.env.REACT_APP_ENABLE_ADS === "true" && (
  <div className="my-6 flex justify-center">
    <AdSlot
      slot="YOUR_SECOND_ADSENSE_SLOT_ID"
      style={{ width: "100%", maxWidth: 728, height: 90 }}
    />
  </div>
)}




        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t">

                <div className="flex gap-3 mt-3">
  <button
    onClick={() => navigator.clipboard.writeText(window.location.href)}
    className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
  >
    Copy link
  </button>

  <a
    href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
    target="_blank"
    rel="noreferrer"
    className="text-sm px-3 py-1 bg-green-100 rounded hover:bg-green-200"
  >
    WhatsApp
  </a>

  <a
    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
    target="_blank"
    rel="noreferrer"
    className="text-sm px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
  >
    Telegram
  </a>
</div>



          <span className="text-sm text-gray-500">
            {isVideo
              ? "Ads unlock video in time blocks"
              : "Ads unlock download"}
          </span>

          <button
            onClick={startDownload}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
          >
            Download
          </button>
        </div>
      </div>
      </div>


      {showAd && (
  <AdModal
  key={`${adReason}-${downloadAdsLeft}`}
  onFinish={finishAd}
  downloadAdsLeft={downloadAdsLeft}
  adReason={adReason}
/>

)}

    </div>
  );
}

/* ============ AD MODAL ============ */

function AdModal({ onFinish, downloadAdsLeft, adReason }) {

  const [timeLeft, setTimeLeft] = useState(10);


    const [adLoaded, setAdLoaded] = useState(false);
  const adContainerRef = useRef(null);





  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);



  useEffect(() => {
  if (!adContainerRef.current) return;

  const observer = new MutationObserver(() => {
    const iframe = adContainerRef.current.querySelector("iframe");
    if (iframe) {
      setAdLoaded(true);
      observer.disconnect();
    }
  });

  observer.observe(adContainerRef.current, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);





    



  return (
    <div
  className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
  onClick={(e) => e.stopPropagation()}
>

     <div
  className="bg-white p-6 rounded-2xl w-96 text-center space-y-5 shadow-xl"
  onClick={(e) => e.stopPropagation()}
>

      <h2 className="font-semibold text-lg">
  {adReason === "download" && downloadAdsLeft === 0
    ? "Preparing download…"
    : adReason === "download"
    ? `Watch ad (${downloadAdsLeft} left)`
    : "Watch ad to continue watching"}
</h2>



       <div
  ref={adContainerRef}
  className="relative border rounded-lg overflow-hidden h-44 bg-gray-50"
>


      {/* POP / NON-GOOGLE AD PLACEHOLDER */}
<div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 pointer-events-none">

  Advertisement
</div>




  {/* Skeleton */}
  {!adLoaded && (
  <div className="absolute inset-0 flex items-center justify-center animate-pulse text-gray-300 pointer-events-none">
    Loading ad…
  </div>
)}


  {process.env.REACT_APP_ENABLE_POPADS !== "true" && (
  <div className="absolute inset-0 bg-white">
    <HouseAd />
  </div>
)}



</div>

<p className="text-xs text-gray-400">
  Ads help keep CloudBox free and secure.
</p>



        {timeLeft > 0 ? (
  <>
    <p className="text-sm text-gray-500">
      Please wait {timeLeft}s to continue
    </p>

    <div className="h-1 bg-gray-200 rounded overflow-hidden">
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
      />
    </div>
  </>
) : (

          <button
            onClick={onFinish}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
