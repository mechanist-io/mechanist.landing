import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle, Globe, Lock, ShieldCheck } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { API_BASE_URL } from "@/lib/api";
import {
  trackDownloadFormSubmit,
  trackDownloadFormValidationError,
  trackDownloadGeoAllowed,
  trackDownloadGeoCheckLatency,
  trackDownloadGeoUnknown,
  trackDownloadIdentifierType,
  trackDownloadPageView,
  trackDownloadSignupError,
  trackDownloadSignupLatency,
  trackDownloadSignupSuccess,
  trackDownloadVpnBlocked,
  trackDownloadVpnRetry,
} from "@/lib/analytics";
import { checkIranIp, type IpCheckResult } from "@/lib/ip-check";
import {
  FREE_SEATS_TOTAL,
  REGISTERED_COUNT,
  REMAINING_FREE_SEATS,
  faNumber,
} from "@/lib/free-seats";
import { CountUp } from "@/components/site/CountUp";
import { downloadSeo } from "@/lib/seo";

export const Route = createFileRoute("/download")({
  head: () => downloadSeo(),
  component: DownloadPage,
});

type Status = "idle" | "loading" | "success" | "error";
type GeoStatus = "checking" | IpCheckResult["status"];

const phoneRe = /^09\d{9}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FreeSeatsBanner() {
  const filled = Math.min(100, (REGISTERED_COUNT / FREE_SEATS_TOTAL) * 100);
  return (
    <div className="rounded-2xl border border-[color:var(--brand-orange)]/25 bg-[color:var(--brand-orange-light)] px-4 py-3.5 text-start">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-[color:var(--brand-orange)]">
          حساب رایگان مادام‌العمر
        </p>
        <p className="text-[11px] font-semibold text-gray-600">
          {faNumber(REGISTERED_COUNT)} از {faNumber(FREE_SEATS_TOTAL)} نفر
        </p>
      </div>
      <p className="mt-1.5 text-sm font-extrabold text-gray-900">
        فقط{" "}
        <CountUp
          from={FREE_SEATS_TOTAL}
          to={REMAINING_FREE_SEATS}
          duration={1.4}
          className="tabular-nums text-[color:var(--brand-orange)]"
        />{" "}
        نفر دیگر می‌تونن مکانیست رو برای همیشه رایگان بگیرن
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80">
        <motion.div
          className="h-full rounded-full bg-[color:var(--brand-orange)]"
          initial={{ width: 0 }}
          animate={{ width: `${filled}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

function TrustNotes() {
  return (
    <div className="mt-5 space-y-2.5 text-start">
      <div className="flex gap-2.5 text-xs leading-6 text-gray-600">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[color:var(--brand-success)]" />
        <p>
          تعهد ما: از شماره‌ات برای تبلیغات، پیامک تبلیغاتی یا فروش به دیگران استفاده
          نمی‌کنیم. امنیت اطلاعاتت اولویت اول ماست.
        </p>
      </div>
      <div className="flex gap-2.5 text-xs leading-6 text-gray-600">
        <Lock size={16} className="mt-0.5 shrink-0 text-gray-500" />
        <p>
          شماره یا ایمیل فقط برای ارسال لینک ثبت‌نام ذخیره می‌شه؛ دیتابیس ما رمزنگاری‌شده
          (encrypted) است و سرورها فعلاً داخل ایران قرار دارن.
        </p>
      </div>
    </div>
  );
}

function DownloadPage() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("checking");
  const [blockedCountry, setBlockedCountry] = useState<string | undefined>();

  const runGeoCheck = (isRetry = false) => {
    if (isRetry) trackDownloadVpnRetry();
    setGeoStatus("checking");
    const started = performance.now();
    void checkIranIp().then((result) => {
      trackDownloadGeoCheckLatency(performance.now() - started);
      if (result.status === "blocked") {
        setBlockedCountry(result.country);
        setGeoStatus("blocked");
        trackDownloadVpnBlocked(result.country);
        return;
      }
      setBlockedCountry(undefined);
      setGeoStatus(result.status);
      if (result.status === "iran") trackDownloadGeoAllowed();
      else trackDownloadGeoUnknown();
    });
  };

  useEffect(() => {
    trackDownloadPageView();
    runGeoCheck(false);
  }, []);

  const detect = (v: string): { email?: string; phoneNumber?: string } | null => {
    const t = v.trim();
    if (phoneRe.test(t)) return { phoneNumber: t };
    if (emailRe.test(t)) return { email: t };
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (geoStatus === "blocked") return;
    const payload = detect(value);
    if (!payload) {
      setFieldError("لطفاً یک ایمیل یا شماره موبایل معتبر وارد کن");
      trackDownloadFormValidationError("invalid_identifier");
      trackDownloadIdentifierType("invalid");
      return;
    }
    const method = payload.email ? "email" : "phone";
    setFieldError(null);
    setStatus("loading");
    trackDownloadFormSubmit(method);
    trackDownloadIdentifierType(method);
    const started = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/send-identifier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: value.trim() }),
      });
      trackDownloadSignupLatency(performance.now() - started);
      if (!res.ok) {
        trackDownloadSignupError(res.status);
        setStatus("error");
        return;
      }
      setStatus("success");
      trackDownloadSignupSuccess(method);
    } catch {
      trackDownloadSignupLatency(performance.now() - started);
      setStatus("error");
      trackDownloadSignupError();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.2)] md:p-10">
            {status === "success" ? (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color:var(--brand-success-light)]">
                  <Check size={28} className="text-[color:var(--brand-success)]" />
                </div>
                <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
                  جای رایگان‌ت رزرو شد
                </h1>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  یکی از {faNumber(FREE_SEATS_TOTAL)} حساب مادام‌العمر رایگان مال توئه. به‌محض
                  انتشار، لینک ثبت‌نام رو برات می‌فرستیم — بدون تبلیغات و بدون اشتراک‌گذاری
                  شماره‌ات.
                </p>
              </div>
            ) : geoStatus === "checking" ? (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gray-100">
                  <Loader2 size={28} className="animate-spin text-gray-500" />
                </div>
                <h1 className="mt-5 text-2xl font-extrabold tracking-tight">لطفاً صبر کن</h1>
                <p className="mt-3 text-sm leading-7 text-gray-600">در حال بررسی اتصال...</p>
              </div>
            ) : geoStatus === "blocked" ? (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50">
                  <Globe size={28} className="text-amber-600" />
                </div>
                <h1 className="mt-5 text-2xl font-extrabold tracking-tight">VPN رو خاموش کن</h1>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  سرورهای مکانیست فعلاً داخل ایران هستن؛ به‌خاطر همین اگه از خارج از ایران
                  {blockedCountry ? ` (${blockedCountry})` : ""} یا با VPN وصل باشی، ثبت‌نام ممکن
                  نیست. لطفاً یک لحظه VPN رو خاموش کن و دوباره امتحان کن.
                </p>
                <div className="mt-5">
                  <FreeSeatsBanner />
                </div>
                <button
                  type="button"
                  onClick={() => runGeoCheck(true)}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50"
                >
                  دوباره امتحان کن
                </button>
                <p className="mt-4 text-xs leading-6 text-gray-500">
                  به‌زودی سرویس رو برای دسترسی جهانی هم آماده می‌کنیم تا بدون خاموش کردن VPN هم
                  بتونی ثبت‌نام کنی.
                </p>
              </div>
            ) : (
              <>
                <FreeSeatsBanner />
                <h1 className="mt-5 text-2xl font-extrabold tracking-tight md:text-3xl">
                  جای رایگان خودت رو رزرو کن
                </h1>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  ایمیل یا شماره موبایلت رو وارد کن تا لینک ثبت‌نام و دسترسی زودهنگام برات ارسال
                  بشه.
                </p>

                {status === "error" && (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>مشکلی پیش اومد. لطفاً دوباره تلاش کن.</span>
                  </div>
                )}

                <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                  <div>
                    <label htmlFor="contact" className="sr-only">
                      ایمیل یا شماره موبایل
                    </label>
                    <input
                      id="contact"
                      type="text"
                      inputMode="email"
                      dir="auto"
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                        if (fieldError) setFieldError(null);
                        if (status === "error") setStatus("idle");
                      }}
                      onBlur={() => {
                        if (!value) return;
                        const payload = detect(value);
                        if (!payload) {
                          setFieldError("لطفاً یک ایمیل یا شماره موبایل معتبر وارد کن");
                          trackDownloadFormValidationError("blur_invalid_identifier");
                          trackDownloadIdentifierType("invalid");
                          return;
                        }
                        trackDownloadIdentifierType(payload.email ? "email" : "phone");
                      }}
                      aria-invalid={fieldError ? "true" : "false"}
                      aria-describedby={fieldError ? "contact-error" : undefined}
                      placeholder="ایمیل یا شماره موبایل"
                      className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-gray-400 ${
                        fieldError
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-black"
                      }`}
                      required
                    />
                    {fieldError && (
                      <p id="contact-error" className="mt-2 text-xs text-red-600">
                        {fieldError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[color:var(--brand-orange-hover)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      "رزرو حساب رایگان مادام‌العمر"
                    )}
                  </button>
                </form>

                <TrustNotes />
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
