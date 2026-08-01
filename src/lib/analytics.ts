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

export type NavTarget = "how-it-works" | "features" | "faq" | "home" | string;

export type SectionId =
  | "hero"
  | "how-it-works"
  | "smart-reminder"
  | "vehicle-database"
  | "customize-parts"
  | "coming-soon"
  | "ai-assistant"
  | "features"
  | "screenshots"
  | "faq"
  | "final-cta";

export type MockupId = "hero-gauge" | "customize-parts" | "ai-assistant" | "screenshots";

type EventParams = Record<string, string | number | boolean | undefined>;

const ATTR_KEY = "mechanist_attribution";
const SCROLL_KEY = "mechanist_scroll_depths";
const SECTION_KEY = "mechanist_section_views";
const MOCKUP_KEY = "mechanist_mockup_views";

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
};

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

function readSessionJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSessionJson(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

function getDeviceContext() {
  if (typeof navigator === "undefined") return {};
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  let browser = "other";
  if (/Edg\//.test(ua)) browser = "edge";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "chrome";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "safari";
  else if (/Firefox\//.test(ua)) browser = "firefox";
  return {
    device_type: isMobile ? "mobile" : "desktop",
    browser,
  };
}

function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const existing = readSessionJson<Attribution>(ATTR_KEY);
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
    referrer: document.referrer || undefined,
    landing_page: `${window.location.pathname}${window.location.search}`,
  };
  writeSessionJson(ATTR_KEY, attribution);
  return attribution;
}

function track(event: string, params: EventParams = {}) {
  const attribution = getAttribution();
  const device = getDeviceContext();
  const cleaned: EventParams = {};
  for (const [key, value] of Object.entries({ ...attribution, ...device, ...params })) {
    if (value !== undefined && value !== "") cleaned[key] = value;
  }
  gtag("event", event, cleaned);
}

function oncePerSession(storeKey: string, id: string): boolean {
  const seen = readSessionJson<string[]>(storeKey) ?? [];
  if (seen.includes(id)) return false;
  writeSessionJson(storeKey, [...seen, id]);
  return true;
}

/** Capture UTM / referrer once per session and attach to later events. */
export function captureAttribution() {
  getAttribution();
}

export function trackDownloadCtaClick(source: DownloadCtaSource) {
  track("download_cta_click", { source });
}

export function trackDownloadPageView() {
  track("download_page_view", { page: "/download" });
}

export function trackDownloadVpnBlocked(country?: string) {
  track("download_vpn_blocked", {
    country: country ?? "unknown",
    page: "/download",
  });
}

export function trackDownloadGeoAllowed() {
  track("download_geo_allowed", { page: "/download" });
}

export function trackDownloadGeoUnknown() {
  track("download_geo_unknown", { page: "/download" });
}

export function trackDownloadVpnRetry() {
  track("download_vpn_retry", { page: "/download" });
}

export function trackDownloadFormSubmit(method: "email" | "phone") {
  track("download_form_submit", { method, page: "/download" });
}

export function trackDownloadFormValidationError(reason = "invalid_identifier") {
  track("download_form_validation_error", { reason, page: "/download" });
}

export function trackDownloadSignupSuccess(method: "email" | "phone") {
  track("download_signup_success", { method, page: "/download" });
}

export function trackDownloadSignupError(statusCode?: number) {
  track("download_signup_error", {
    status_code: statusCode ?? 0,
    page: "/download",
  });
}

export function trackDownloadIdentifierType(method: "email" | "phone" | "invalid") {
  track("download_identifier_type", { method, page: "/download" });
}

export function trackDownloadGeoCheckLatency(ms: number) {
  track("geo_check_latency_ms", { value: Math.round(ms), page: "/download" });
}

export function trackDownloadSignupLatency(ms: number) {
  track("signup_latency_ms", { value: Math.round(ms), page: "/download" });
}

export function trackSectionView(section: SectionId) {
  if (!oncePerSession(SECTION_KEY, section)) return;
  track("section_view", { section });
}

export function trackNavClick(target: NavTarget, location: "header" | "header_mobile" | "footer" | "hero") {
  track("nav_click", { target, location });
}

export function trackFaqOpen(question: string, index: number) {
  track("faq_open", { question, index });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100) {
  const key = String(percent);
  if (!oncePerSession(SCROLL_KEY, key)) return;
  track("scroll_depth", { percent, value: percent });
}

export function trackHeroCtaSecondary() {
  track("hero_cta_secondary", { target: "how-it-works" });
}

export function trackMockupInView(mockup: MockupId) {
  if (!oncePerSession(MOCKUP_KEY, mockup)) return;
  track("mockup_in_view", { mockup });
}

export function trackOutboundClick(url: string, label?: string) {
  track("outbound_click", { url, label: label ?? url });
}

export function trackJsError(message: string, source?: string) {
  track("js_error", {
    message: message.slice(0, 180),
    source: source ?? "window",
  });
}

export function trackWebVital(name: "LCP" | "CLS" | "INP", value: number) {
  track("web_vitals", {
    metric_name: name,
    value: Math.round(name === "CLS" ? value * 1000 : value),
  });
}

/** Observe landing scroll milestones once per session. */
export function initScrollDepthTracking() {
  if (typeof window === "undefined") return () => {};

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;
    if (pct >= 25) trackScrollDepth(25);
    if (pct >= 50) trackScrollDepth(50);
    if (pct >= 75) trackScrollDepth(75);
    if (pct >= 100) trackScrollDepth(100);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener("scroll", onScroll);
}

/** Track clicks to external hosts. */
export function initOutboundClickTracking() {
  if (typeof document === "undefined") return () => {};

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("/") || href.startsWith("mailto:")) return;
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin === window.location.origin) return;
      trackOutboundClick(url.href, anchor.textContent?.trim()?.slice(0, 80));
    } catch {
      // ignore invalid urls
    }
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

/** Global JS error / rejection reporting. */
export function initJsErrorTracking() {
  if (typeof window === "undefined") return () => {};

  const onError = (event: ErrorEvent) => {
    trackJsError(event.message || "unknown_error", event.filename);
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const message =
      reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "unhandled_rejection";
    trackJsError(message, "unhandledrejection");
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}

/** Collect LCP / CLS / INP via PerformanceObserver. */
export function initWebVitalsTracking() {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => {};
  }

  const observers: PerformanceObserver[] = [];

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) trackWebVital("LCP", last.startTime);
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    observers.push(lcpObserver);
  } catch {
    // unsupported
  }

  try {
    let cls = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
        if (!entry.hadRecentInput) cls += entry.value ?? 0;
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
    observers.push(clsObserver);
    const flushCls = () => trackWebVital("CLS", cls);
    window.addEventListener("pagehide", flushCls);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushCls();
    });
  } catch {
    // unsupported
  }

  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { duration?: number; interactionId?: number }>) {
        if (entry.interactionId && typeof entry.duration === "number") {
          trackWebVital("INP", entry.duration);
        }
      }
    });
    inpObserver.observe({ type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
    observers.push(inpObserver);
  } catch {
    // unsupported
  }

  return () => observers.forEach((observer) => observer.disconnect());
}

/** Boot session-level analytics listeners. */
export function initAnalyticsRuntime() {
  captureAttribution();
  const cleanups = [
    initScrollDepthTracking(),
    initOutboundClickTracking(),
    initJsErrorTracking(),
    initWebVitalsTracking(),
  ];
  return () => cleanups.forEach((fn) => fn());
}
