import { Check, Droplet, Gauge, Wrench, Car, Bell } from "lucide-react";

function PhoneFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[260px] shrink-0 rounded-[2.5rem] border-[10px] border-black bg-black p-1 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
        <div className="h-[540px] w-full overflow-hidden rounded-[2rem] bg-white">
          {children}
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600">{title}</p>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-black">
      <span>۹:۴۱</span>
      <span>●●●●●</span>
    </div>
  );
}

function DashboardScreen() {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="h-full bg-gray-50">
      <StatusBar />
      <div className="p-4">
        <div className="rounded-2xl bg-black p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400">خودروی من</p>
              <p className="mt-0.5 text-sm font-bold">پژو ۲۰۶ · ۱۴۰۰</p>
            </div>
            <div className="rounded-lg bg-white/10 px-2 py-1 text-[10px]">۴۵,۲۰۰ km</div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-28 w-28">
              <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r={r}
                stroke="#FF8C00"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={c}
                strokeDashoffset={c * 0.32}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="58" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">
                ۶۸٪
              </text>
              <text x="60" y="74" textAnchor="middle" fill="#A1A1AA" fontSize="8">
                سلامت خودرو
              </text>
            </svg>
          </div>
        </div>

        <p className="mt-4 mb-2 text-[11px] font-semibold text-gray-600">سرویس‌های پیش رو</p>
        <div className="space-y-2">
          {[
            { name: "تعویض روغن موتور", rem: "۱۲ روز مانده" },
            { name: "فیلتر هوا", rem: "۱,۲۰۰ km مانده" },
            { name: "لنت ترمز", rem: "۴۵ روز مانده" },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-3 rounded-xl bg-white p-3">
              <span className="h-2 w-2 rounded-full bg-[color:var(--brand-orange)]" />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-black">{s.name}</p>
                <p className="text-[10px] text-gray-400">{s.rem}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpcomingScreen() {
  const items = [
    { icon: Droplet, name: "تعویض روغن موتور", rem: "۱۲ روز", pct: 82 },
    { icon: Wrench, name: "فیلتر روغن", rem: "۹۰۰ km", pct: 74 },
    { icon: Gauge, name: "لنت ترمز جلو", rem: "۱ ماه", pct: 55 },
    { icon: Bell, name: "شمع موتور", rem: "۳ ماه", pct: 30 },
  ];
  return (
    <div className="h-full bg-white">
      <StatusBar />
      <div className="p-4">
        <p className="text-sm font-bold text-black">سرویس‌های پیش رو</p>
        <p className="text-[10px] text-gray-400">۴ آیتم نزدیک به موعد</p>
        <div className="mt-4 space-y-3">
          {items.map(({ icon: Icon, name, rem, pct }) => (
            <div key={name} className="rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--brand-orange-light)]">
                  <Icon size={14} className="text-[color:var(--brand-orange)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-black">{name}</p>
                  <p className="text-[10px] text-gray-400">{rem} مانده</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[color:var(--brand-orange)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoneScreen() {
  const items = [
    { name: "تعویض روغن موتور", date: "۱۴۰۳/۱۱/۰۵", km: "۴۲,۰۰۰ km" },
    { name: "فیلتر کابین", date: "۱۴۰۳/۰۹/۲۲", km: "۴۰,۵۰۰ km" },
    { name: "ضدیخ رادیاتور", date: "۱۴۰۳/۰۷/۱۰", km: "۳۷,۸۰۰ km" },
    { name: "تسمه تایم", date: "۱۴۰۳/۰۳/۱۸", km: "۳۰,۰۰۰ km" },
  ];
  return (
    <div className="h-full bg-white">
      <StatusBar />
      <div className="p-4">
        <p className="text-sm font-bold text-black">سرویس‌های انجام‌شده</p>
        <p className="text-[10px] text-gray-400">تاریخچه کامل خودرو</p>
        <div className="mt-4 space-y-2">
          {items.map((s) => (
            <div key={s.name} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--brand-success-light)]">
                <Check size={14} className="text-[color:var(--brand-success)]" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-black">{s.name}</p>
                <p className="text-[10px] text-gray-400">
                  {s.date} · {s.km}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoScreen() {
  return (
    <div className="h-full bg-white">
      <StatusBar />
      <div className="p-4">
        <p className="text-sm font-bold text-black">اطلاعات خودرو</p>
        <div className="mt-3 grid h-32 w-full place-items-center rounded-2xl bg-gradient-to-br from-black to-gray-900">
          <Car size={44} className="text-white/70" />
        </div>
        <div className="mt-4 space-y-3">
          {[
            ["برند", "پژو"],
            ["مدل", "۲۰۶ تیپ ۵"],
            ["سال ساخت", "۱۴۰۰"],
            ["کارکرد فعلی", "۴۵,۲۰۰ km"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-[11px] text-gray-400">{k}</span>
              <span className="text-[11px] font-semibold text-black">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhoneMockups() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 lg:grid-cols-4">
      <div className="snap-center"><PhoneFrame title="داشبورد"><DashboardScreen /></PhoneFrame></div>
      <div className="snap-center"><PhoneFrame title="سرویس‌های پیش رو"><UpcomingScreen /></PhoneFrame></div>
      <div className="snap-center"><PhoneFrame title="سرویس‌های انجام‌شده"><DoneScreen /></PhoneFrame></div>
      <div className="snap-center"><PhoneFrame title="اطلاعات خودرو"><InfoScreen /></PhoneFrame></div>
    </div>
  );
}
