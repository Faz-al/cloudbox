export function loadMonetagIframe(container) {
  if (!container) return;

  container.innerHTML = "";

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;

  // REPLACE with BANNER ZONE ID (NOT vignette, NOT onclick)
  script.src = "https://al5sm.com/banner.js?zoneid=YOUR_BANNER_ZONE_ID";

  container.appendChild(script);
}
