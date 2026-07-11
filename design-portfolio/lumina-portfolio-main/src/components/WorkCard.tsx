import { useRef, useState } from "react";
import { LiquidImage } from "./LiquidImage";

type Props = {
  index: number;
  title: string;
  category: string;
  year: string;
  src: string;
  filterId: string;
};

export function WorkCard({ index, title, category, year, src, filterId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 10, ry: px * 14 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  const offset = index % 2 === 0 ? "md:translate-y-0" : "md:translate-y-24";

  return (
    <div className={`reveal group ${offset}`}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative [perspective:1400px]"
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-card shadow-[0_40px_120px_-30px_rgba(120,60,255,0.5)] transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <LiquidImage src={src} alt={title} filterId={filterId} />
          <div
            className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between"
            style={{ transform: "translateZ(60px)" }}
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {category} · {year}
              </div>
              <h3 className="font-display mt-2 text-3xl font-medium leading-none text-foreground md:text-4xl">
                {title}
              </h3>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition group-hover:bg-white/15">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
        </div>
      </div>
    </div>
  );
}