import { useEffect, useState } from "react";
import type { PortfolioData } from "@/components/portfolio-builder/types";

const NAV = [
  { id: "work", label: "WORK" },
  { id: "reel", label: "REEL" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];

export function HUD({ data }: { data?: PortfolioData }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* corner brackets */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />

      {/* Top-left: brand + rec */}
      <div className="fixed left-12 top-8 z-50 flex items-center gap-3 mono text-[11px] text-white/70">
        <span className="rec-dot" />
        <span className="tracking-[0.3em]">REC · 24.976 FPS</span>
      </div>

      {/* Top-right: navigation */}
      <nav className="fixed right-12 top-8 z-50 flex items-center gap-6 mono text-[11px] tracking-[0.25em] text-white/70">
        {NAV.map((n, i) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="group relative py-1 transition-colors hover:text-white"
          >
            <span className="mr-2 text-white/40">0{i + 1}</span>
            {n.label}
            <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-500 group-hover:w-full" />
          </a>
        ))}
      </nav>

      {/* Bottom-left: name */}
      <div className="fixed bottom-8 left-12 z-50 mono text-[11px] tracking-[0.3em] text-white/60 uppercase">
        <div className="text-white/40">{data?.personalInfo?.role ?? "DIRECTOR · DP"}</div>
        <div className="mt-1 text-white">{data?.personalInfo?.name ?? "A. VELA"} — STUDIO NOIR</div>
      </div>

      {/* Bottom-right: time + coord */}
      <div className="fixed bottom-8 right-12 z-50 mono text-right text-[11px] tracking-[0.3em] text-white/60">
        <div className="text-white/80">{time || "00:00:00"}</div>
        <div className="mt-1 text-white/40">LAT 34.05 · LON −118.24</div>
      </div>

      {/* Center crosshair (subtle) */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-8 w-8 opacity-30">
          <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white" />
          <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white" />
          <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white" />
          <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white" />
        </div>
      </div>
    </>
  );
}
