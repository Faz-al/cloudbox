import { useEffect } from "react";

export default function AdSlot({ slot, format = "auto", style = {} }) {
  const adsEnabled =
    process.env.REACT_APP_ENABLE_ADS === "true" &&
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost";

  useEffect(() => {
    if (!adsEnabled) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silent fail (AdSense requirement)
    }
  }, [adsEnabled]);

  if (!adsEnabled) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-8554883906976508"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
