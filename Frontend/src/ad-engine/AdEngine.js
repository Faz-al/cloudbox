// Pure JS. Never imported in React.
(function () {
  if (window.__SAFEVAULT_AD_ENGINE__) return;
  window.__SAFEVAULT_AD_ENGINE__ = true;

  const ENABLED = process.env.REACT_APP_ENABLE_AD_ENGINE === "true";
  if (!ENABLED) return;

  const THROTTLE = parseInt(process.env.REACT_APP_AD_THROTTLE_SECONDS || "900");

  function canShowAd() {
    const last = parseInt(localStorage.getItem("sv_ad_last") || "0");
    return Date.now() - last > THROTTLE * 1000;
  }

  function markAdShown() {
    localStorage.setItem("sv_ad_last", Date.now());
  }

  window.SafeVaultAds = {
    canShowAd,
    markAdShown
  };
})();
