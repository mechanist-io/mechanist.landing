import { createServerFn } from "@tanstack/react-start";

type IpLookupResponse = {
  status?: string;
  countryCode?: string;
  country?: string;
  message?: string;
};

export type IpCheckResult =
  { status: "iran" } | { status: "blocked"; country?: string } | { status: "unknown" };

/** Server-side lookup via ip-api.com (free tier is HTTP-only). */
export const checkIranIp = createServerFn({ method: "GET" }).handler(
  async (): Promise<IpCheckResult> => {
    try {
      const { getRequestHeader, getRequestIP } = await import("@tanstack/react-start/server");

      const ip =
        getRequestHeader("cf-connecting-ip")?.trim() ||
        getRequestHeader("x-real-ip")?.trim() ||
        getRequestIP({ xForwardedFor: true })?.trim();

      // Without a client IP we'd geolocate the edge/origin, not the visitor.
      if (!ip) return { status: "unknown" };

      const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,message`;
      const res = await fetch(url);
      if (!res.ok) return { status: "unknown" };

      const data = (await res.json()) as IpLookupResponse;
      if (data.status !== "success" || !data.countryCode) {
        return { status: "unknown" };
      }

      if (data.countryCode.toUpperCase() === "IR") {
        return { status: "iran" };
      }

      return { status: "blocked", country: data.country };
    } catch {
      return { status: "unknown" };
    }
  },
);
