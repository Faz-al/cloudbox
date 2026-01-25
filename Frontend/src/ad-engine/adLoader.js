export function loadMonetagIframe(container) {
  if (!container) return;

  container.innerHTML = `
    <iframe 
      sandbox="allow-scripts allow-same-origin"
      referrerpolicy="no-referrer"
      src="https://a.monetag.com/banner?zoneid=YOUR_ZONE_ID"
      style="border:0;width:100%;height:100%;"
    ></iframe>
  `;
}
