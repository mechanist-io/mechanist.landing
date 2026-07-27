const IP_LOOKUP_URL = "https://whatismyip.technology/api/me";

type IpLookupResponse = {
  countryCode?: string;
  country?: string;
};

export type IpCheckResult =
  { status: "iran" } | { status: "blocked"; country?: string } | { status: "unknown" };

export async function checkIranIp(): Promise<IpCheckResult> {
  try {
    const res = await fetch(IP_LOOKUP_URL);
    if (!res.ok) return { status: "unknown" };

    const data = (await res.json()) as IpLookupResponse;
    if (data.countryCode?.toUpperCase() === "IR") {
      return { status: "iran" };
    }

    return { status: "blocked", country: data.country };
  } catch {
    return { status: "unknown" };
  }
}
