/** Endless "Welcome to Barberia's world" ticker. */
export function Marquee({ text }: { text: string }) {
  return (
    <div className="overflow-hidden border-y border-cream/15 bg-background py-[clamp(0.75rem,1.6vw,1.4rem)]">
      <div className="flex w-max animate-[marquee_36s_linear_infinite] whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, dup) => (
          <span
            key={dup}
            aria-hidden={dup === 1}
            className="flex shrink-0 items-center font-display text-[clamp(1.25rem,3.2vw,2.6rem)] uppercase tracking-[0.12em] text-cream/80"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6">{text}</span>
                <span className="text-cream/30">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
