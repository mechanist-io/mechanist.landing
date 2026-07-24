export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 16 L23 10"
          stroke="#FF8C00"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">مکانیست</span>
    </div>
  );
}
