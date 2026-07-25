import { motion } from "framer-motion";

export function HeroGauge() {
  const cx = 150;
  const cy = 150;
  const radius = 110;
  const c = 2 * Math.PI * radius;
  const progress = 0.68;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#000" />
            <stop offset="100%" stopColor="#222" />
          </linearGradient>
        </defs>

        {/* outer ring */}
        <circle cx={cx} cy={cy} r={radius} stroke="#F4F4F5" strokeWidth="14" fill="none" />
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="#FF8C00"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${cx} ${cy})`}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - progress) }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }}
        />

        {/* tick marks */}
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
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

        {/* needle — SVG-native rotate so pivot stays at dial center (CSS transforms break in RTL) */}
        <motion.g
          initial={{ rotate: -110 }}
          animate={{ rotate: 62 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          transformTemplate={({ rotate }) => `rotate(${rotate} ${cx} ${cy})`}
        >
          <line x1={cx} y1={cy} x2={cx} y2={cy - 82} stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

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
