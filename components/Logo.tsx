export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 26 C10 26 10 14 16 14 S22 6 28 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.1 5.2" />
        <circle cx="28" cy="6" r="3.4" fill="rgb(var(--brand))" />
      </svg>
      sendero
    </span>
  )
}
