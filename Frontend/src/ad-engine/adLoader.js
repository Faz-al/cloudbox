export function loadMonetagIframe(container) {
  if (!container) return;

  container.innerHTML = "";

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;

  // 👉 REPLACE THIS WITH YOUR REAL BANNER ZONE ID
  script.src = "https://al5sm.com/banner.js?zoneid=10514178";

  container.appendChild(script);
}

