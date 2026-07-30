import { useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";

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

  // A single 0→1 progress value drives both the needle and the arc so they never
  // drift apart. Needle rotation goes through the SVG transform attribute so the
  // pivot stays at the dial center.
  const progress = useMotionValue(0);
  const needleRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const shakeRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const apply = (p: number) => {
      needleRef.current?.setAttribute("transform", `rotate(${-120 + sweep * p} ${cx} ${cy})`);
      arcRef.current?.setAttribute("stroke-dashoffset", `${c * (1 - arcFraction * p)}`);
      // Near the cut-off the whole meter vibrates slightly, like an engine on the limiter.
      if (shakeRef.current) {
        const intensity = Math.max(0, (p - 0.9) / 0.1);
        shakeRef.current.style.transform =
          intensity > 0
            ? `translate(${(Math.random() - 0.5) * 2.4 * intensity}px, ${(Math.random() - 0.5) * 2.4 * intensity}px)`
            : "";
      }
    };
    apply(progress.get());
    const unsubscribe = progress.on("change", apply);
    // Rev cycle: two small throttle blips (to section 1, then section 3 of 6),
    // then sprint to the cut-off, bounce off the limiter 6 times, wind down
    // back to idle, short rest, repeat.
    const revDuration = 0.4;
    const dropDuration = 1.5;
    const idleDuration = 0.4;
    const bounceHalf = 0.08; // seconds per dip/return half of a bounce
    const bounceDips = [0.93, 0.95, 0.93, 0.96, 0.94, 0.95];

    type Ease = "easeOut" | "easeInOut" | "linear";
    const keyframes: number[] = [0];
    const timesSec: number[] = [0];
    const eases: Ease[] = [];
    let t = 0;
    const step = (value: number, seconds: number, ease: Ease) => {
      keyframes.push(value);
      timesSec.push((t += seconds));
      eases.push(ease);
    };

    step(1 / 6, 0.1, "easeOut"); // first blip: up to section 1
    step(0, 0.5, "easeInOut");
    step(3 / 6, 0.2, "easeOut"); // second blip: up to section 3
    step(0, 0.9, "easeInOut");
    step(1, revDuration, "easeOut"); // full send to the cut-off
    for (const dip of bounceDips) {
      step(dip, bounceHalf, "easeInOut");
      step(1, bounceHalf, "easeInOut");
    }
    step(0, dropDuration, "easeInOut");
    step(0, idleDuration, "linear");

    const controls = animate(progress, keyframes, {
      duration: t,
      times: timesSec.map((s) => s / t),
      ease: eases,
      repeat: Infinity,
    });
    return () => {
      unsubscribe();
      controls.stop();
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

      {/* checkpoint timeline */}
      <div className="absolute inset-x-0 -bottom-4 mx-auto flex items-center justify-center gap-6">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  i === 2 ? "bg-[color:var(--brand-orange)] ring-4 ring-[color:var(--brand-orange-light)]" : "bg-gray-200"
                }`}
              />
              {i < 3 && <span className="h-px w-6 bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
