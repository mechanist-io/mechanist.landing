import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, Droplet, Gauge, Minus, Plus, Wrench } from "lucide-react";

const PARTS = [
  { icon: Droplet, name: "تعویض روغن موتور", km: "۵٬۰۰۰", months: "۶ ماه" },
  { icon: Wrench, name: "فیلتر روغن", km: "۱۰٬۰۰۰", months: "۱۲ ماه" },
  { icon: Gauge, name: "لنت ترمز جلو", km: "۴۰٬۰۰۰", months: "۲۴ ماه" },
] as const;

const KM_STEPS = ["۵٬۰۰۰", "۶٬۰۰۰", "۷٬۰۰۰", "۸٬۰۰۰"] as const;
const MONTH_STEPS = ["۶ ماه", "۷ ماه", "۸ ماه", "۹ ماه"] as const;

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-black">
      <span>۹:۴۱</span>
      <span>●●●●●</span>
    </div>
  );
}

type Screen = "list" | "edit";

function CustomizePhoneScreen({
  screen,
  selected,
  km,
  months,
  highlight,
}: {
  screen: Screen;
  selected: number;
  km: string;
  months: string;
  highlight: "km" | "months" | null;
}) {
  return (
    <div className="relative h-full bg-white">
      <StatusBar />
      <AnimatePresence mode="wait">
        {screen === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="p-4"
          >
            <p className="text-sm font-bold text-black">تنظیم عمر قطعات</p>
            <p className="text-[10px] text-gray-400">کیلومتر یا مدت هر قطعه رو شخصی‌سازی کن</p>
            <div className="mt-4 space-y-3">
              {PARTS.map(({ icon: Icon, name, km: defaultKm, months: defaultMonths }, i) => {
                const isSelected = selected === i;
                const displayKm = i === 0 ? km : defaultKm;
                const displayMonths = i === 0 ? months : defaultMonths;
                return (
                  <div
                    key={name}
                    className={`rounded-xl border p-3 transition-all duration-300 ${
                      isSelected
                        ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange-light)]/40 ring-2 ring-[color:var(--brand-orange)]/30"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--brand-orange-light)]">
                        <Icon size={14} className="text-[color:var(--brand-orange)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-black">{name}</p>
                        <p className="text-[10px] text-gray-400">
                          هر {displayKm} یا {displayMonths}
                        </p>
                      </div>
                      <ChevronLeft size={14} className="text-gray-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="p-4"
          >
            <div className="mb-4 flex items-center gap-2">
              <ChevronLeft size={16} className="rotate-180 text-gray-400" />
              <div>
                <p className="text-sm font-bold text-black">تنظیم فاصله سرویس</p>
                <p className="text-[10px] text-gray-400">{PARTS[selected].name}</p>
              </div>
            </div>

            <div
              className={`rounded-xl border p-4 transition-all duration-300 ${
                highlight === "km"
                  ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange-light)]/50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <p className="text-[10px] font-semibold text-gray-400">بر اساس کیلومتر</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-black/5">
                  <Minus size={14} />
                </span>
                <motion.span
                  key={km}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xl font-extrabold tabular-nums text-black"
                >
                  {km}
                  <span className="ms-1 text-xs font-semibold text-gray-400">km</span>
                </motion.span>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full shadow-sm ring-1 ring-black/5 ${
                    highlight === "km"
                      ? "bg-[color:var(--brand-orange)] text-white"
                      : "bg-white text-gray-400"
                  }`}
                >
                  <Plus size={14} />
                </span>
              </div>
            </div>

            <div
              className={`mt-3 rounded-xl border p-4 transition-all duration-300 ${
                highlight === "months"
                  ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange-light)]/50"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <p className="text-[10px] font-semibold text-gray-400">بر اساس مدت زمان</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-black/5">
                  <Minus size={14} />
                </span>
                <motion.span
                  key={months}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xl font-extrabold text-black"
                >
                  {months}
                </motion.span>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full shadow-sm ring-1 ring-black/5 ${
                    highlight === "months"
                      ? "bg-[color:var(--brand-orange)] text-white"
                      : "bg-white text-gray-400"
                  }`}
                >
                  <Plus size={14} />
                </span>
              </div>
            </div>

            <div className="mt-5 grid h-11 place-items-center rounded-xl bg-black text-sm font-bold text-white">
              ذخیره تغییرات
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Phone3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.45 });
  const [screen, setScreen] = useState<Screen>("list");
  const [selected, setSelected] = useState(-1);
  const [km, setKm] = useState(KM_STEPS[0]);
  const [months, setMonths] = useState(MONTH_STEPS[0]);
  const [highlight, setHighlight] = useState<"km" | "months" | null>(null);
  const [cursor, setCursor] = useState({ x: 200, y: 480 });
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    if (!inView) {
      setScreen("list");
      setSelected(-1);
      setKm(KM_STEPS[0]);
      setMonths(MONTH_STEPS[0]);
      setHighlight(null);
      setCursor({ x: 200, y: 480 });
      setPressing(false);
      return;
    }

    let cancelled = false;
    let timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const run = async () => {
      while (!cancelled) {
        setScreen("list");
        setSelected(-1);
        setKm(KM_STEPS[0]);
        setMonths(MONTH_STEPS[0]);
        setHighlight(null);
        setCursor({ x: 200, y: 480 });
        setPressing(false);
        await wait(900);

        // Move to first part and tap
        setCursor({ x: 130, y: 145 });
        await wait(700);
        setPressing(true);
        setSelected(0);
        await wait(180);
        setPressing(false);
        await wait(350);

        // Open edit screen
        setScreen("edit");
        setCursor({ x: 200, y: 200 });
        await wait(600);

        // Tap + on kilometers a few times
        setCursor({ x: 210, y: 195 });
        await wait(500);
        for (let i = 1; i < KM_STEPS.length; i++) {
          if (cancelled) return;
          setPressing(true);
          setHighlight("km");
          await wait(140);
          setKm(KM_STEPS[i]);
          setPressing(false);
          await wait(380);
        }
        setHighlight(null);
        await wait(300);

        // Tap + on months
        setCursor({ x: 210, y: 310 });
        await wait(500);
        for (let i = 1; i < MONTH_STEPS.length; i++) {
          if (cancelled) return;
          setPressing(true);
          setHighlight("months");
          await wait(140);
          setMonths(MONTH_STEPS[i]);
          setPressing(false);
          await wait(380);
        }
        setHighlight(null);
        await wait(300);

        // Tap save
        setCursor({ x: 130, y: 420 });
        await wait(550);
        setPressing(true);
        await wait(180);
        setPressing(false);
        await wait(400);

        // Back to list with updated values
        setScreen("list");
        setSelected(0);
        setCursor({ x: 200, y: 480 });
        await wait(2200);
      }
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex w-full max-w-[340px] justify-center [perspective:1400px]"
    >
      {/* soft floor shadow */}
      <div className="pointer-events-none absolute bottom-2 h-8 w-[70%] rounded-[100%] bg-black/20 blur-xl" />

      <motion.div
        className="relative origin-center"
        animate={
          inView
            ? {
                rotateY: [-12, -8, -12],
                rotateX: [5, 3, 5],
                y: [0, -10, 0],
              }
            : undefined
        }
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-[260px] shrink-0 rounded-[2.5rem] border-[10px] border-black bg-black p-1 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]">
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
          <div className="relative h-[540px] w-full overflow-hidden rounded-[2rem] bg-white">
            <CustomizePhoneScreen
              screen={screen}
              selected={selected}
              km={km}
              months={months}
              highlight={highlight}
            />

            {/* cursor */}
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-20"
              animate={{ x: cursor.x, y: cursor.y, scale: pressing ? 0.78 : 1 }}
              transition={{
                x: { duration: 0.55, ease: "easeInOut" },
                y: { duration: 0.55, ease: "easeInOut" },
                scale: { duration: 0.12 },
              }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-md">
                <path
                  d="M5.5 3.2v17.6c0 .45.54.67.85.35l4.4-4.4a.5.5 0 0 1 .35-.15h6.25c.45 0 .67-.54.35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
                  fill="#000"
                  stroke="#fff"
                  strokeWidth="1.4"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CustomizeParts() {
  return (
    <section className="overflow-hidden border-b border-gray-100 bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 text-sm font-semibold text-[color:var(--brand-orange)]">شخصی‌سازی</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            شخصی سازی عمر قطعات مصرفی خودروی شما
          </h2>
          <p className="mt-4 text-gray-600 leading-7">
            برنامه پیش‌فرض هر قطعه رو می‌تونی عوض کنی — هم بر اساس کیلومتر، هم بر اساس مدت زمان.
            اگه زودتر سرویس می‌کنی یا شرایط رانندگی‌ت متفاوته، فاصله‌ها رو خودت تنظیم کن.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "تغییر سقف کیلومتر هر قطعه مصرفی",
              "تنظیم مدت زمان یادآوری (ماه / سال)",
              "ذخیره سریع و اعمال روی یادآوری بعدی",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-orange)]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Phone3D />
        </motion.div>
      </div>
    </section>
  );
}
