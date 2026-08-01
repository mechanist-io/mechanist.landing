type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export type DownloadCtaSource =
  | "hero"
  | "header"
  | "header_mobile"
  | "footer"
  | "final_cta";

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Track when a user clicks a download / waitlist CTA. */
export function trackDownloadCtaClick(source: DownloadCtaSource) {
  gtag("event", "download_cta_click", { source });
}

/** Track when the /download page shows the VPN / geo block screen. */
export function trackDownloadVpnBlocked(country?: string) {
  gtag("event", "download_vpn_blocked", {
    country: country ?? "unknown",
    page: "/download",
  });
}

/** Track successful waitlist / identifier signup on /download. */
export function trackDownloadSignupSuccess(method: "email" | "phone") {
  gtag("event", "download_signup_success", { method });
}
