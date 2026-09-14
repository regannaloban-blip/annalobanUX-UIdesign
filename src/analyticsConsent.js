const consentStorageKey = "anna-loban-analytics-consent";

export function shouldLoadAnalytics(consent) {
  return consent === "granted";
}

export function readAnalyticsConsent() {
  try {
    return window.localStorage.getItem(consentStorageKey);
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(consent) {
  try {
    window.localStorage.setItem(consentStorageKey, consent);
  } catch {
    // Analytics remains disabled if browser storage is unavailable.
  }
}

export function loadGoogleAnalytics() {
  if (window.gtag || document.querySelector('script[data-google-analytics="G-EFV436KR9R"]')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-EFV436KR9R");

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-EFV436KR9R";
  script.dataset.googleAnalytics = "G-EFV436KR9R";
  document.head.append(script);
}
