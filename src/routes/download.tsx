import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "دریافت اپلیکیشن مکانیست" },
      {
        name: "description",
        content: "ایمیل یا شماره موبایلت رو وارد کن تا لینک دانلود مکانیست برات ارسال بشه.",
      },
      { property: "og:title", content: "دریافت اپلیکیشن مکانیست" },
      {
        property: "og:description",
        content: "لینک دانلود اپلیکیشن مکانیست را با ایمیل یا پیامک دریافت کنید.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DownloadPage,
});

type Status = "idle" | "loading" | "success" | "error";

const phoneRe = /^09\d{9}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function DownloadPage() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const detect = (v: string): { email?: string; phoneNumber?: string } | null => {
    const t = v.trim();
    if (phoneRe.test(t)) return { phoneNumber: t };
    if (emailRe.test(t)) return { email: t };
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = detect(value);
    if (!payload) {
      setFieldError("لطفاً یک ایمیل یا شماره موبایل معتبر وارد کن");
      return;
    }
    setFieldError(null);
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/send-identifier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: value.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
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
                  در لیست انتظار ثبت‌نام کردی
                </h1>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  مکانیست هنوز منتشر نشده — ولی جای تو رو نگه داشتیم. تا چند روز دیگه منتشر می‌شه و
                  لینک دانلود رو برات می‌فرستیم. همراه ما بمون!
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                  دریافت اپلیکیشن
                </h1>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  ایمیل یا شماره موبایلت رو وارد کن تا لینک دانلود برات ارسال بشه.
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
                        if (value && !detect(value)) {
                          setFieldError("لطفاً یک ایمیل یا شماره موبایل معتبر وارد کن");
                        }
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
                      "ارسال لینک"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
