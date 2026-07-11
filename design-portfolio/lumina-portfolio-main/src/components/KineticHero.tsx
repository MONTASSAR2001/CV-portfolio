import { useRef } from "react";

export function KineticHero() {
  return (
    <section className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-between px-6 pt-32 md:px-10">
      <div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-plasma" />
          Portfolio · 2020 — 2026
        </div>

        <h1 className="font-display mt-10 select-none text-[16vw] font-medium leading-[0.82] tracking-tight md:text-[13vw]">
          <KineticWord>Design</KineticWord>{" "}
          <KineticWord accent>in</KineticWord>{" "}
          <span className="block">
            <KineticWord gradient>Motion.</KineticWord>
          </span>
        </h1>
      </div>

      <div className="mt-16 grid gap-10 pb-16 md:grid-cols-3 md:items-end">
        <p className="max-w-md text-balance text-base leading-relaxed text-muted-foreground md:col-span-2 md:text-lg">
          I'm <span className="text-foreground">Nova Ardent</span> — an independent creative director
          crafting immersive digital experiences, kinetic identities and interactive worlds for
          brands that refuse to look like anyone else.
        </p>
        <div className="flex items-center gap-4 md:justify-end">
          <a
            href="#work"
            className="group relative inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm backdrop-blur-md transition hover:border-white/50 hover:bg-white/10"
          >
            <span className="h-2 w-2 rounded-full bg-plasma shadow-[0_0_16px_var(--plasma)]" />
            Explore the universe
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function KineticWord({
  children,
  accent = false,
  gradient = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
  gradient?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--sx", `${px * 14}px`);
    el.style.setProperty("--sy", `${py * 8}px`);
    el.style.setProperty("--sk", `${px * 6}deg`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--sx", "0px");
    el.style.setProperty("--sy", "0px");
    el.style.setProperty("--sk", "0deg");
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor="hover"
      className={`relative inline-block transition-[filter] duration-300 hover:blur-[0.3px] ${
        accent ? "italic text-muted-foreground/80" : ""
      } ${gradient ? "text-gradient" : ""}`}
      style={{
        transform: "translate3d(var(--sx,0),var(--sy,0),0) skewX(var(--sk,0))",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform",
      }}
    >
      {children}
    </span>
  );
}