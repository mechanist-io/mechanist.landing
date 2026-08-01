import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BellRing,
  TrendingUp,
  Wallet,
  History,
  Clock,
  Zap,
  ChevronDown,
  ArrowLeft,
  Bot,
  CarFront,
  Sparkles,
  Gift,
} from "lucide-react";
import { useState } from "react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroGauge } from "@/components/site/HeroGauge";
import { PhoneMockups } from "@/components/site/PhoneMockups";
import { CustomizeParts } from "@/components/site/CustomizeParts";
import { AiAssistantShowcase } from "@/components/site/AiAssistantShowcase";
import { CountUp, ProgressBar } from "@/components/site/CountUp";
import { MockupView, SectionView } from "@/components/site/AnalyticsRuntime";
import { trackDownloadCtaClick, trackFaqOpen, trackHeroCtaSecondary } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مکانیست | دستیار هوشمند سرویس خودرو" },
      {
        name: "description",
        content:
          "با مکانیست، سرویس‌های خودرو، موتورسیکلت، کامیون و تراکتور خود را بر اساس کیلومتر و زمان به‌طور خودکار پیگیری کنید.",
      },
      { property: "og:title", content: "مکانیست | دستیار هوشمند سرویس خودرو" },
      {
        property: "og:description",
        content: "یادآوری هوشمند سرویس خودرو بر اساس کیلومتر و زمان.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "مکانیست" },
      { name: "twitter:description", content: "دستیار هوشمند سرویس خودرو." },
      {
        name: "application/ld+json",
        content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "مکانیست",
          applicationCategory: "Auto",
          operatingSystem: "iOS, Android",
          description:
            "مکانیست بر اساس کیلومتر و زمان، سرویس‌های خودرو، موتورسیکلت، کامیون و تراکتور را به‌طور خودکار پیگیری می‌کند.",
        }),
      },
    ],
  }),
  component: LandingPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
} as const;

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SmartReminder />
        <VehicleDatabase />
        <CustomizeParts />
        <ComingSoon />
        <AiAssistantShowcase />
        <Benefits />
        <Screenshots />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <SectionView id="hero" as="section" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-24 md:grid-cols-2 md:px-8 md:pt-24 md:pb-32">
        <motion.div {...fadeUp}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-orange-light)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-orange)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)]" />
            دستیار هوشمند سرویس خودرو
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight md:text-6xl">
            دیگه هیچوقت سرویس ماشینت
            <br />
            <span className="relative inline-block">
              یادت نمیره
              <span className="absolute inset-x-0 -bottom-1 h-3 -z-0 bg-[color:var(--brand-orange-light)]" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            مکانیست بر اساس کیلومتر و زمان، سرویس‌های خودرو، موتورسیکلت، کامیون یا تراکتور شما رو
            به‌طور خودکار بر اساس عمر هر قطعه پیگیری می‌کنه — دقیق، ساده و همیشه به‌روز.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/download"
              onClick={() => trackDownloadCtaClick("hero")}
              className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(255,140,0,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange-hover)]"
            >
              دانلود اپلیکیشن
              <ArrowLeft size={18} />
            </Link>
            <a
              href="#how-it-works"
              onClick={() => trackHeroCtaSecondary()}
              className="inline-flex items-center rounded-xl border-[1.5px] border-black bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white"
            >
              بیشتر بدانید
            </a>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">
            ۵۰۰ کاربر اول، مادام‌العمر رایگان
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <MockupView id="hero-gauge">
            <HeroGauge />
          </MockupView>
        </motion.div>
      </div>
    </SectionView>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "۱",
      t: "خودروت رو انتخاب کن",
      d: "برند، مدل و سال ساخت خودرو، موتورسیکلت، کامیون یا تراکتورت رو انتخاب کن.",
    },
    {
      n: "۲",
      t: "کیلومتر رو ثبت کن",
      d: "هر وقت خواستی، آخرین کیلومتر نمایش داده‌شده روی خودروت رو وارد کن.",
    },
    {
      n: "۳",
      t: "مکانیست محاسبه می‌کنه",
      d: "اپلیکیشن به‌صورت خودکار مشخص می‌کنه کدوم سرویس‌ها الان لازمن — از روغن موتور و فیلتر روغن تا لنت ترمز، تسمه تایم، فیلتر هوا، شمع، ضدیخ، روغن گیربکس و فیلتر کابین.",
    },
    {
      n: "۴",
      t: "بعد از سرویس، تیک بزن",
      d: "بعد از انجام سرویس، آیتم‌های انجام‌شده رو تیک بزن. تاریخ، کیلومتر و تاریخچه سرویس ذخیره می‌شه و یادآوری بعدی خودکار محاسبه می‌شه.",
    },
  ];

  return (
    <SectionView
      id="how-it-works"
      as="section"
      className="border-t border-gray-100 bg-gray-50 py-20 md:py-28"
    >
      <div id="how-it-works" className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            مکانیست چطور کار می‌کند؟
          </h2>
          <p className="mt-4 text-gray-600">در ۴ مرحله ساده، خیالت از سرویس خودرو راحت می‌شه</p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4 md:gap-6">
          <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-15px_rgba(0,0,0,0.15)]"
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[color:var(--brand-orange)] text-lg font-extrabold text-white">
                {s.n}
              </div>
              <h3 className="text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionView>
  );
}

function SmartReminder() {
  return (
    <SectionView id="smart-reminder" as="section" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            یادآوری هوشمند، بر اساس کیلومتر و زمان
          </h2>
          <p className="mt-4 max-w-lg text-gray-600">
            مکانیست همیشه هر دو شرط رو با هم بررسی می‌کنه و هر کدوم زودتر برسه، بهت یادآوری می‌کنه.
          </p>
        </motion.div>

        <motion.div {...fadeUp}>
          <div className="rounded-3xl bg-black p-6 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">آیتم سرویس</p>
                <h3 className="mt-1 text-xl font-bold">لاستیک‌ها</h3>
              </div>
              <span className="rounded-full bg-[color:var(--brand-orange)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--brand-orange)]">
                نزدیک موعد
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              تعویض هر ۶۰,۰۰۰ کیلومتر یا ۵ سال — هر کدوم زودتر برسه
            </p>

            <div className="mt-6 space-y-5">
              <ProgressBar value={100} label="کیلومتر (۷۲,۰۰۰ / ۶۰,۰۰۰)" valueText="٪۱۲۰" />
              <ProgressBar value={58} label="زمان (۲ سال و ۹ ماه / ۵ سال)" valueText="٪۵۸" />
            </div>
          </div>
        </motion.div>
      </div>
    </SectionView>
  );
}

function VehicleDatabase() {
  const stats = [
    { to: 5000, prefix: "+", label: "مدل خودرو" },
    { to: 200, prefix: "+", label: "برند" },
    { to: 5, label: "دسته وسیله نقلیه" },
  ];
  return (
    <SectionView
      id="vehicle-database"
      as="section"
      className="border-y border-gray-100 bg-gray-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            پایگاه داده‌ی بزرگ خودروها
          </h2>
          <p className="mt-4 text-gray-600">
            مکانیست از قبل برنامه سرویس هزاران خودرو، موتورسیکلت، کامیون و تراکتور از برندها و
            سال‌های مختلف رو داره. کافیه خودروت رو انتخاب کنی — نیازی به تنظیم دستی نیست.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              className="rounded-2xl bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="text-5xl font-extrabold tracking-tight text-black md:text-6xl">
                <CountUp to={s.to} prefix={s.prefix ?? ""} />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionView>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-orange-light)] px-3 py-1 text-xs font-bold text-[color:var(--brand-orange)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand-orange)]" />
      به زودی
    </span>
  );
}

function AiAssistantPreview() {
  return (
    <div className="mt-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 text-start shadow-sm">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2.5 text-xs leading-6 text-gray-800">
          موقع ترمز گرفتن از جلو صدای سوت میاد و پدال نرم‌تر شده
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white">
          <Bot size={14} />
        </div>
        <div className="min-w-0 flex-1 rounded-2xl rounded-br-md border border-gray-100 bg-gray-50 px-3.5 py-3">
          <p className="text-[11px] font-bold text-gray-900">علت‌های محتمل</p>
          <ul className="mt-2 space-y-1.5 text-[11px] leading-5 text-gray-600">
            <li>• لنت ترمز جلو فرسوده یا روغنی شده</li>
            <li>• دیسک ترمز خراش‌دار یا تاب‌دار</li>
            <li>• کمبود مایع ترمز</li>
          </ul>
          <div className="mt-3 rounded-xl bg-[color:var(--brand-orange-light)] px-3 py-2">
            <p className="text-[10px] font-semibold text-[color:var(--brand-orange)]">
              برآورد هزینه تعمیر
            </p>
            <p className="mt-0.5 text-sm font-extrabold text-gray-900">۲ تا ۶ میلیون تومان</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoon() {
  const features = [
    {
      icon: CarFront,
      title: "حالت خودروی عمومی",
      description:
        "اگه خودروی شما هنوز توی پایگاه داده‌ی ما نیست، به‌زودی می‌تونی برنامه سرویس اون رو خودت به‌صورت دستی تعریف کنی.",
    },
    {
      icon: Sparkles,
      title: "دستیار هوش مصنوعی تعمیرات",
      description:
        "مشکل خودروت رو با زبان ساده توضیح بده؛ هوش مصنوعی علت‌های محتمل رو برات پیدا می‌کنه و یک بازه تقریبی برای هزینه تعمیر نشون می‌ده — قبل از رفتن به مکانیک، بدون چی در انتظارت هست.",
      preview: <AiAssistantPreview />,
    },
  ];

  return (
    <SectionView id="coming-soon" as="section" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeUp} className="mx-auto mb-10 max-w-2xl text-center">
          <ComingSoonBadge />
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            ویژگی‌های در راه
          </h2>
          <p className="mt-3 text-gray-600">
            داریم مکانیست رو کامل‌تر می‌کنیم تا علاوه بر پیگیری سرویس، در تشخیص مشکلات هم کنارت
            باشه.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {features.map(({ icon: Icon, title, description, preview }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-10"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-black text-white">
                <Icon size={20} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900">{title}</h3>
              <p className="mt-3 text-gray-600">{description}</p>
              {preview}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionView>
  );
}

function Benefits() {
  const items = [
    {
      icon: Gift,
      t: "۵۰۰ کاربر اول، مادام‌العمر رایگان",
      d: "۵۰۰ نفر اول مکانیست رو برای همیشه و بدون هزینه اشتراک استفاده می‌کنن — همین الان جای خودت رو رزرو کن.",
    },
    {
      icon: BellRing,
      t: "هیچوقت سرویس رو فراموش نکن",
      d: "یادآوری‌های دقیق و به‌موقع، همیشه یک قدم جلوتر باش.",
    },
    {
      icon: TrendingUp,
      t: "عمر خودروت رو افزایش بده",
      d: "سرویس منظم یعنی خودروی سالم‌تر برای مدت طولانی‌تر.",
    },
    { icon: Wallet, t: "هزینه تعمیرات رو کم کن", d: "پیشگیری همیشه ارزون‌تر از تعمیرات بزرگه." },
    { icon: History, t: "تاریخچه کامل سرویس", d: "تمام سرویس‌های انجام‌شده رو در یک‌جا نگه دار." },
    {
      icon: Clock,
      t: "یادآوری خودکار",
      d: "بدون نیاز به یادداشت یا حافظه، مکانیست یادت می‌ندازه.",
    },
    { icon: Zap, t: "ساده و سریع", d: "چند لحظه برای ثبت کیلومتر، خیالت تمام سال راحت." },
  ];
  return (
    <SectionView id="features" as="section" className="py-20 md:py-28">
      <div id="features" className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.h2
          {...fadeUp}
          className="text-center text-3xl font-extrabold tracking-tight md:text-5xl"
        >
          چرا مکانیست؟
        </motion.h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-gray-100 p-6 transition-all hover:-translate-y-1 hover:border-black hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-black text-white transition-colors group-hover:bg-[color:var(--brand-orange)]">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionView>
  );
}

function Screenshots() {
  return (
    <SectionView
      id="screenshots"
      as="section"
      className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">نگاهی به اپلیکیشن</h2>
          <p className="mt-4 text-gray-600">رابط تمیز و سریع، طراحی‌شده برای استفاده روزمره</p>
        </motion.div>
        <MockupView id="screenshots">
          <PhoneMockups />
        </MockupView>
      </div>
    </SectionView>
  );
}

const faqs = [
  {
    q: "مکانیست چطور برنامه سرویس خودروی من رو می‌دونه؟",
    a: "مکانیست از پایگاه داده‌ای شامل هزاران مدل خودرو استفاده می‌کنه که برنامه سرویس استاندارد هر کدوم از قبل توش تعریف شده. کافیه برند، مدل و سال خودروت رو انتخاب کنی.",
  },
  {
    q: "می‌تونم چند تا خودرو رو هم‌زمان مدیریت کنم؟",
    a: "بله، می‌تونی هر تعداد خودرو، موتورسیکلت، کامیون یا تراکتور که داری رو در مکانیست اضافه کنی و همه رو جداگانه پیگیری کنی.",
  },
  {
    q: "آیا از موتورسیکلت هم پشتیبانی می‌کنه؟",
    a: "بله، مکانیست علاوه بر خودرو، از موتورسیکلت، کامیون، تراکتور و ماشین‌آلات سنگین هم پشتیبانی می‌کنه.",
  },
  {
    q: "آیا مکانیست بدون اینترنت هم کار می‌کنه؟",
    a: "اطلاعات خودرو و سرویس‌ها روی گوشی شما ذخیره می‌شه و می‌تونی بدون اینترنت هم به اونا دسترسی داشته باشی. برای همگام‌سازی و به‌روزرسانی به اتصال اینترنت نیاز داری.",
  },
  {
    q: "یادآوری‌ها چطور محاسبه می‌شن؟",
    a: "هر آیتم سرویس بر اساس دو معیار کیلومتر و زمان بررسی می‌شه. هر کدوم زودتر به آستانه تعیین‌شده برسه، مکانیست بهت یادآوری می‌کنه.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionView id="faq" as="section" className="py-20 md:py-28">
      <div id="faq" className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.h2
          {...fadeUp}
          className="text-center text-3xl font-extrabold tracking-tight md:text-5xl"
        >
          سوالات متداول
        </motion.h2>
        <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isOpen) trackFaqOpen(f.q, i);
                    setOpen(isOpen ? null : i);
                  }}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start"
                  aria-expanded={isOpen}
                  aria-label={f.q}
                >
                  <span className="text-sm font-bold md:text-base">{f.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-gray-600">{f.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionView>
  );
}

function FinalCTA() {
  return (
    <SectionView id="final-cta" as="section" className="bg-black py-20 text-white md:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <motion.h2 {...fadeUp} className="text-3xl font-extrabold tracking-tight md:text-5xl">
          همین حالا خیالت از سرویس خودروت راحت بشه
        </motion.h2>
        <motion.p {...fadeUp} className="mt-5 text-gray-400">
          مکانیست رو دانلود کن — ۵۰۰ کاربر اول، مادام‌العمر رایگان.
        </motion.p>
        <motion.div {...fadeUp} className="mt-10">
          <Link
            to="/download"
            onClick={() => trackDownloadCtaClick("final_cta")}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-8 py-4 text-base font-bold text-white shadow-[0_20px_60px_-15px_rgba(255,140,0,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-orange-hover)]"
          >
            دانلود اپلیکیشن
            <ArrowLeft size={18} />
          </Link>
        </motion.div>
      </div>
    </SectionView>
  );
}
