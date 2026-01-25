let monetagLoaded = false;

export function loadMonetagPop() {
  if (monetagLoaded) return;
  monetagLoaded = true;

  const s = document.createElement("script");
  s.dataset.zone = "10514178";
  s.src = "https://al5sm.com/tag.min.js";
  s.async = true;
  document.body.appendChild(s);
}
