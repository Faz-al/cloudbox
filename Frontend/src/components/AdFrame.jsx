import { useEffect, useRef } from "react";
import { loadMonetagIframe } from "../ad-engine/adLoader";

export default function AdFrame() {
  const ref = useRef();

useEffect(() => {
  // HARD LOCK: Ads ONLY on /view/ pages
  if (!window.location.pathname.startsWith("/view/")) return;

if (!window.SafeVaultAds || !window.SafeVaultAds.canShowAd()) return;
  window.SafeVaultAds.markAdShown();
  loadMonetagIframe(ref.current);
}, []);


  return (
    <div ref={ref} className="w-full h-full bg-gray-50 rounded-lg" />
  );
}
