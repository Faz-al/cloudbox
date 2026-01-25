export function loadMonetagBanner() {
  if (!window.location.pathname.startsWith("/view/")) return;
  if (window.__SV_MONETAG_BANNER_LOADED__) return;
  window.__SV_MONETAG_BANNER_LOADED__ = true;

  // In-Page Push
  const push = document.createElement("script");
  push.dataset.zone = "10514225";
  push.src = "https://nap5k.com/tag.min.js";
  push.async = true;
  document.head.appendChild(push);

  // Vignette
  const vignette = document.createElement("script");
  vignette.dataset.zone = "10514195";
  vignette.src = "https://gizokraijaw.net/vignette.min.js";
  vignette.async = true;
  document.head.appendChild(vignette);
}
