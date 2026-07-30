import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "framer-motion";
import { Check, Droplet, Gauge, Wrench } from "lucide-react";

type Ease = "easeOut" | "easeInOut" | "linear";

function buildKeyframes(steps: Array<{ value: number; seconds: number; ease: Ease }>) {
  const keyframes: number[] = [0];
  const timesSec: number[] = [0];
  const eases: Ease[] = [];
  let t = 0;
  for (const s of steps) {
    keyframes.push(s.value);
    timesSec.push((t += s.seconds));
    eases.push(s.ease);
  }
  return { keyframes, times: timesSec.map((s) => s / t), eases, duration: t };
}

const BOUNCE_HALF = 0.08;
const BOUNCE_DIPS = [0.93, 0.95, 0.93, 0.96, 0.94, 0.95];

/** Three rev phases, matching the three phone checks. */
const REV_PHASES = [
  // Click 1 — soft blip to section 1
  buildKeyframes([
    { value: 1 / 6, seconds: 0.1, ease: "easeOut" },
    { value: 0, seconds: 0.5, ease: "easeInOut" },
  ]),
  // Click 2 — stronger blip to section 3
  buildKeyframes([
    { value: 3 / 6, seconds: 0.2, ease: "easeOut" },
    { value: 0, seconds: 0.9, ease: "easeInOut" },
  ]),
  // Click 3 — full send to cut-off, limiter bounce, wind-down
  buildKeyframes([
    { value: 1, seconds: 0.4, ease: "easeOut" },
    ...BOUNCE_DIPS.flatMap((dip) => [
      { value: dip, seconds: BOUNCE_HALF, ease: "easeInOut" as const },
      { value: 1, seconds: BOUNCE_HALF, ease: "easeInOut" as const },
    ]),
    { value: 0, seconds: 1.5, ease: "easeInOut" },
  ]),
];

export function HeroGauge() {
  const cx = 150;
  const cy = 150;
  const radius = 110;
  const c = 2 * Math.PI * radius;
  // Gauge spans 240°: from 8 o'clock (150° from 3 o'clock) clockwise through 12 to 4 o'clock,
  // symmetric around the vertical axis, leaving the bottom (4→8 o'clock) empty.
  const startAngle = 150;
  const sweep = 240;
  const arcFraction = sweep / 360;

  const progress = useMotionValue(0);
  const needleRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const shakeRef = useRef<SVGSVGElement>(null);
  const revControls = useRef<AnimationPlaybackControls | null>(null);

  const [checked, setChecked] = useState([false, false, false]);
  const [cursor, setCursor] = useState(CURSOR_REST);
  const [pressing, setPressing] = useState(false);

  // Keep needle + arc + shake locked to the single progress value.
  useEffect(() => {
    const apply = (p: number) => {
      needleRef.current?.setAttribute("transform", `rotate(${-120 + sweep * p} ${cx} ${cy})`);
      arcRef.current?.setAttribute("stroke-dashoffset", `${c * (1 - arcFraction * p)}`);
      if (shakeRef.current) {
        const intensity = Math.max(0, (p - 0.9) / 0.1);
        shakeRef.current.style.transform =
          intensity > 0
            ? `translate(${(Math.random() - 0.5) * 2.4 * intensity}px, ${(Math.random() - 0.5) * 2.4 * intensity}px)`
            : "";
      }
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, []);

  // Orchestrate: steady gauge → click each task → run matching rev → reset & loop.
  useEffect(() => {
    let cancelled = false;
    let timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const playRev = (phase: number) =>
      new Promise<void>((resolve) => {
        const { keyframes, times, eases, duration } = REV_PHASES[phase];
        progress.set(0);
        revControls.current?.stop();
        revControls.current = animate(progress, keyframes, {
          duration,
          times,
          ease: eases,
          onComplete: () => resolve(),
        });
      });

    const runCycle = async () => {
      while (!cancelled) {
        setChecked([false, false, false]);
        setCursor(CURSOR_REST);
        setPressing(false);
        progress.set(0);
        await wait(800);

        for (let i = 0; i < TASKS.length; i++) {
          if (cancelled) return;
          setCursor({ x: CHECK_X, y: ROW_Y[i] });
          await wait(550);
          if (cancelled) return;
          setPressing(true);
          await wait(150);
          if (cancelled) return;
          setPressing(false);
          setChecked((prev) => prev.map((v, j) => (j === i ? true : v)));
          await playRev(i);
          if (cancelled) return;
          await wait(300);
        }

        setCursor(CURSOR_REST);
        await wait(1200);
      }
    };

    runCycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      revControls.current?.stop();
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg ref={shakeRef} viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#222" />
          </linearGradient>
        </defs>

        {/* outer ring — 240° track starting at 8 o'clock */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#F4F4F5"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          strokeDasharray={`${c * arcFraction} ${c}`}
        />
        <circle
          ref={arcRef}
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#FF8C00"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          strokeDasharray={c}
          strokeDashoffset={c}
        />

        {/* tick marks — only within the 8→4 o'clock sweep */}
        {Array.from({ length: 31 }).map((_, i) => {
          const a = ((startAngle + (i / 30) * sweep) * Math.PI) / 180;
          const x1 = cx + Math.cos(a) * 82;
          const y1 = cy + Math.sin(a) * 82;
          const x2 = cx + Math.cos(a) * (i % 5 === 0 ? 70 : 76);
          const y2 = cy + Math.sin(a) * (i % 5 === 0 ? 70 : 76);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 5 === 0 ? "#18181B" : "#A1A1AA"}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}

        {/* center dial */}
        <circle cx={cx} cy={cy} r="52" fill="url(#ring)" />

        {/* needle — rotation driven imperatively via the SVG transform attribute */}
        <g ref={needleRef} transform={`rotate(-120 ${cx} ${cy})`}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - 82} stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* pivot hub — fixed at dial center, drawn on top */}
        <circle cx={cx} cy={cy} r="8" fill="#FF8C00" />
        <circle cx={cx} cy={cy} r="3" fill="#000" />
      </svg>

      {/* tiny phone with the Mechanist task list */}
      <div className="absolute inset-x-0 -bottom-8 flex justify-center">
        <PhoneTasks checked={checked} cursor={cursor} pressing={pressing} />
      </div>
    </div>
  );
}

const TASKS = [
  { icon: Droplet, name: "تعویض روغن موتور", rem: "۱۲ روز", pct: 82 },
  { icon: Wrench, name: "فیلتر روغن", rem: "۹۰۰ km", pct: 74 },
  { icon: Gauge, name: "لنت ترمز جلو", rem: "۱ ماه", pct: 55 },
] as const;

// Screen-space coordinates (px) of each task's action icon (RTL: right side).
const CHECK_X = 118;
const ROW_Y = [62, 104, 146];
const CURSOR_REST = { x: 28, y: 172 };

function PhoneTasks({
  checked,
  cursor,
  pressing,
}: {
  checked: boolean[];
  cursor: { x: number; y: number };
  pressing: boolean;
}) {
  return (
    <div className="relative h-[200px] w-[152px] shrink-0 rounded-[1.6rem] border-[6px] border-black bg-black p-[2px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]">
      {/* notch — matches PhoneFrame */}
      <div className="absolute left-1/2 top-0 z-20 h-2.5 w-12 -translate-x-1/2 rounded-b-xl bg-black" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] bg-white">
        {/* StatusBar — matches PhoneMockups */}
        <div className="flex items-center justify-between px-2.5 pt-1.5 text-[6px] font-semibold text-black">
          <span>۹:۴۱</span>
          <span>●●●●●</span>
        </div>

        <div className="px-2 pt-1">
          <p className="text-[8px] font-bold leading-tight text-black">سرویس‌های پیش رو</p>
          <p className="text-[6px] leading-tight text-gray-400">۳ آیتم نزدیک به موعد</p>

          <div className="mt-1.5 space-y-1">
            {TASKS.map(({ icon: Icon, name, rem, pct }, i) => (
              <div key={name} className="rounded-lg border border-gray-100 p-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md transition-colors duration-200 ${
                      checked[i] ? "rounded-full bg-[color:var(--brand-success-light)]" : "bg-[color:var(--brand-orange-light)]"
                    }`}
                  >
                    {checked[i] ? (
                      <Check size={9} className="text-[color:var(--brand-success)]" />
                    ) : (
                      <Icon size={9} className="text-[color:var(--brand-orange)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[7px] font-semibold leading-tight transition-colors duration-200 ${
                        checked[i] ? "text-gray-300 line-through" : "text-black"
                      }`}
                    >
                      {name}
                    </p>
                    <p className="text-[6px] leading-tight text-gray-400">
                      {checked[i] ? "انجام شد" : `${rem} مانده`}
                    </p>
                  </div>
                </div>
                {!checked[i] && (
                  <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[color:var(--brand-orange)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* animated mouse pointer */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-10"
          animate={{ x: cursor.x, y: cursor.y, scale: pressing ? 0.75 : 1 }}
          transition={{
            x: { duration: 0.5, ease: "easeInOut" },
            y: { duration: 0.5, ease: "easeInOut" },
            scale: { duration: 0.12 },
          }}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 drop-shadow-sm">
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
  );
}
