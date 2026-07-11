import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import p1 from "@/assets/project-01.jpg";
import p2 from "@/assets/project-02.jpg";
import p3 from "@/assets/project-03.jpg";
import p4 from "@/assets/project-04.jpg";
import p5 from "@/assets/project-05.jpg";

export const Route = createFileRoute("/")({
  component: SpatialGallery,
});

type Project = {
  index: string;
  title: string;
  year: string;
  location: string;
  typology: string;
  coord: string;
  image: string;
};

const projects: Project[] = [
  { index: "I", title: "House of Silences", year: "MMXXIV", location: "Uji, JP", typology: "Residence", coord: "34.88°N / 135.79°E", image: p2 },
  { index: "II", title: "Chapel of the Slab", year: "MMXXIII", location: "Ronda, ES", typology: "Sacred", coord: "36.74°N / 5.16°W", image: p1 },
  { index: "III", title: "Cabinet of Light", year: "MMXXIII", location: "Bregenz, AT", typology: "Museum", coord: "47.50°N / 9.74°E", image: p3 },
  { index: "IV", title: "Interior, Nº 04", year: "MMXXII", location: "Porto, PT", typology: "Interior", coord: "41.15°N / 8.61°W", image: p4 },
  { index: "V", title: "Vertical Ground", year: "MMXXII", location: "Basel, CH", typology: "Tower", coord: "47.56°N / 7.59°E", image: p5 },
];

function SpatialGallery() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [active, setActive] = useState(0);

  // Translate vertical wheel → horizontal scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
      // active panel based on center of viewport
      const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let dist = Infinity;
      panels.forEach((panel, i) => {
        const mid = panel.offsetLeft + panel.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < dist) { dist = d; closest = i; }
      });
      setActive(closest);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const panel = el.querySelectorAll<HTMLElement>("[data-panel]")[i];
    if (!panel) return;
    el.scrollTo({ left: panel.offsetLeft, behavior: "smooth" });
  };

  const current = projects[active];
  const bearing = Math.round(progress * 360);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground grain">
      {/* Top-left brand */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between px-8 pt-8 md:px-14 md:pt-10">
        <div className="pointer-events-auto">
          <div className="font-display text-2xl leading-none tracking-tight">MONOLITH</div>
          <div className="font-mono-xs mt-2 text-muted-foreground">Architecture · Est. 2011</div>
        </div>
        <div className="pointer-events-auto text-right">
          <div className="font-mono-xs text-muted-foreground">Volume 07</div>
          <div className="font-mono-xs mt-2 text-foreground">Spatial Index — {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</div>
        </div>
      </header>

      {/* Horizontal scroller */}
      <div
        ref={scrollerRef}
        className="scroll-smooth flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Intro panel */}
        <section
          data-panel
          className="relative flex h-full w-screen shrink-0 snap-center items-end px-8 pb-28 md:px-14"
        >
          <div className="max-w-3xl">
            <div className="font-mono-xs text-muted-foreground">— A Spatial Portfolio</div>
            <h1 className="font-display mt-6 text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-tight text-foreground">
              Walk the<br />
              <em className="italic text-concrete-deep">quiet</em> volumes.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              MONOLITH is an architecture studio composing structure, silence and light.
              Scroll horizontally to move through the gallery — each work a room, each room a slab.
            </p>
          </div>

          {/* huge index digit */}
          <div className="pointer-events-none absolute bottom-8 right-8 font-display text-[22vw] leading-none tracking-tighter text-foreground/5 md:right-14">
            00
          </div>
        </section>

        {/* Project panels */}
        {projects.map((p, i) => (
          <ProjectPanel key={p.title} project={p} indexNumber={i + 1} progress={progress} active={active === i} />
        ))}

        {/* Contact / colophon */}
        <section
          data-panel
          className="relative flex h-full w-screen shrink-0 snap-center items-center px-8 md:px-14"
        >
          <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="font-mono-xs text-muted-foreground">— Colophon</div>
              <h2 className="font-display mt-6 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight">
                End of<br />the corridor.
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-8 md:pl-12">
              <div>
                <div className="font-mono-xs text-muted-foreground">Studio</div>
                <div className="mt-2 text-lg">Rue des Volumes 14 · Geneva</div>
              </div>
              <div>
                <div className="font-mono-xs text-muted-foreground">Correspondence</div>
                <div className="mt-2 text-lg">bureau@monolith.arch</div>
              </div>
              <div className="border-t border-border pt-6">
                <div className="font-mono-xs text-muted-foreground">© MMXXVI — All works reserved</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Compass / coordinate HUD */}
      <div className="pointer-events-none absolute bottom-8 left-8 z-40 md:bottom-10 md:left-14">
        <Compass bearing={bearing} progress={progress} label={current?.coord ?? "—"} />
      </div>

      {/* Progress track + panel dots */}
      <div className="pointer-events-none absolute bottom-10 right-8 z-40 flex items-center gap-4 md:right-14">
        <div className="font-mono-xs text-muted-foreground">
          {String(Math.round(progress * 100)).padStart(3, "0")}
        </div>
        <div className="relative h-px w-48 bg-border md:w-72">
          <div
            className="absolute left-0 top-0 h-px bg-foreground transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {Array.from({ length: projects.length + 2 }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to panel ${i + 1}`}
              onClick={() => jumpTo(i)}
              className={`h-2 w-2 border border-foreground transition-all ${active === i ? "bg-foreground" : "bg-transparent hover:bg-foreground/40"}`}
            />
          ))}
        </div>
      </div>

      {/* subtle hint */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <div className="font-mono-xs text-muted-foreground animate-pulse">scroll →</div>
      </div>
    </main>
  );
}

function ProjectPanel({
  project,
  indexNumber,
  progress,
  active,
}: {
  project: Project;
  indexNumber: number;
  progress: number;
  active: boolean;
}) {
  // parallax: shift the inner image based on global progress
  const shift = (progress - indexNumber / 8) * 120; // px, background moves slower feel
  return (
    <section
      data-panel
      className="relative flex h-full w-screen shrink-0 snap-center items-center px-8 md:px-14"
    >
      {/* massive silent index in background */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-display text-[38vh] leading-none tracking-tighter text-foreground/[0.04] md:pl-10"
        style={{ transform: `translateX(${-shift * 0.4}px)` }}
      >
        {String(indexNumber).padStart(2, "0")}
      </div>

      <div className="relative z-10 grid h-full w-full grid-cols-12 items-center gap-6">
        {/* meta column */}
        <div className="col-span-12 flex flex-col justify-center md:col-span-3">
          <div className="font-mono-xs text-muted-foreground">Nº {project.index}</div>
          <h2 className="font-display mt-4 text-[clamp(2rem,4.2vw,3.5rem)] leading-[0.95] tracking-tight">
            {project.title}
          </h2>
          <dl className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
            <Row k="Year" v={project.year} />
            <Row k="Location" v={project.location} />
            <Row k="Typology" v={project.typology} />
            <Row k="Coord." v={project.coord} />
          </dl>
        </div>

        {/* monolithic image slab with parallax */}
        <div className="col-span-12 md:col-span-6">
          <figure
            className={`relative mx-auto aspect-[3/4] w-full max-h-[78vh] overflow-hidden border border-border bg-secondary transition-transform duration-700 ease-out ${active ? "translate-y-0" : "translate-y-6"}`}
            style={{
              boxShadow: "0 40px 80px -30px oklch(0 0 0 / 0.35), 0 10px 30px -10px oklch(0 0 0 / 0.15)",
            }}
          >
            {/* background layer moves slower */}
            <div
              className="absolute inset-0 scale-110"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translate3d(${-shift * 0.35}px, 0, 0) scale(1.15)`,
                filter: "grayscale(1) contrast(1.02)",
              }}
              aria-hidden
            />
            {/* foreground frame with subtle counter-shift */}
            <div
              className="absolute inset-6 border border-bone/40 mix-blend-overlay"
              style={{ transform: `translate3d(${shift * 0.15}px, 0, 0)` }}
              aria-hidden
            />
            {/* caption strip */}
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 px-4 py-3 text-bone backdrop-blur-sm">
              <span className="font-mono-xs">{project.location}</span>
              <span className="font-mono-xs">{project.year}</span>
            </figcaption>
          </figure>
        </div>

        {/* right column — quiet notes */}
        <div className="col-span-12 flex flex-col justify-end md:col-span-3">
          <blockquote className="font-display text-xl leading-snug text-concrete-deep md:text-2xl">
            “A wall is not a limit, but the beginning of interior.”
          </blockquote>
          <div className="font-mono-xs mt-6 text-muted-foreground">Plate {String(indexNumber).padStart(2, "0")} · Silver gelatin, 2024</div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-mono-xs text-muted-foreground">{k}</dt>
      <dd className="text-sm text-foreground">{v}</dd>
    </div>
  );
}

function Compass({ bearing, progress, label }: { bearing: number; progress: number; label: string }) {
  const size = 96;
  const r = 44;
  const c = size / 2;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-foreground">
        <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeOpacity="0.2" />
        <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeWidth="1"
          strokeDasharray={`${2 * Math.PI * r}`}
          strokeDashoffset={`${2 * Math.PI * r * (1 - progress)}`}
          transform={`rotate(-90 ${c} ${c})`}
        />
        {/* cardinal ticks */}
        {[0, 90, 180, 270].map((deg) => (
          <line key={deg}
            x1={c} y1={c - r} x2={c} y2={c - r + 6}
            stroke="currentColor" strokeOpacity="0.5"
            transform={`rotate(${deg} ${c} ${c})`}
          />
        ))}
        {/* needle */}
        <g transform={`rotate(${bearing} ${c} ${c})`} className="transition-transform duration-200">
          <line x1={c} y1={c} x2={c} y2={c - r + 8} stroke="currentColor" strokeWidth="1.25" />
          <line x1={c} y1={c} x2={c} y2={c + r - 14} stroke="currentColor" strokeOpacity="0.35" />
          <circle cx={c} cy={c} r="2.5" fill="currentColor" />
        </g>
        <text x={c} y={c - r - 4} textAnchor="middle" className="fill-current" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.18em" }}>N</text>
      </svg>
      <div>
        <div className="font-mono-xs text-muted-foreground">Bearing</div>
        <div className="font-mono-xs text-foreground">{String(bearing).padStart(3, "0")}°</div>
        <div className="font-mono-xs mt-2 text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
