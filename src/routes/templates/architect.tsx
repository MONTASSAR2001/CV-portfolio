import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/templates/architect")({
  component: SpatialGallery,
});

// ── Unsplash images replacing local @/assets/*.jpg ──────────
const p1 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
const p2 = "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop";
const p3 = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop";
const p4 = "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop";
const p5 = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop";

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
  { index: "I",   title: "House of Silences",  year: "MMXXIV", location: "Uji, JP",      typology: "Residence", coord: "34.88°N / 135.79°E", image: p2 },
  { index: "II",  title: "Chapel of the Slab", year: "MMXXIII", location: "Ronda, ES",   typology: "Sacred",    coord: "36.74°N / 5.16°W",   image: p1 },
  { index: "III", title: "Cabinet of Light",   year: "MMXXIII", location: "Bregenz, AT", typology: "Museum",    coord: "47.50°N / 9.74°E",   image: p3 },
  { index: "IV",  title: "Interior, Nº 04",    year: "MMXXII",  location: "Porto, PT",   typology: "Interior",  coord: "41.15°N / 8.61°W",   image: p4 },
  { index: "V",   title: "Vertical Ground",    year: "MMXXII",  location: "Basel, CH",   typology: "Tower",     coord: "47.56°N / 7.59°E",   image: p5 },
];

function SpatialGallery() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

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
      const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0, dist = Infinity;
      panels.forEach((panel, i) => {
        const mid = panel.offsetLeft + panel.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < dist) { dist = d; closest = i; }
      });
      setActive(closest);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
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
    <main className="relative h-screen w-screen overflow-hidden bg-stone-950 text-stone-100" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Back link */}
      <Link to="/portfolio-builder" className="absolute left-4 top-4 z-50 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 backdrop-blur transition hover:bg-white/20 hover:text-white">
        ← Builder
      </Link>

      {/* Top brand */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between px-8 pt-8 md:px-14 md:pt-10">
        <div className="pointer-events-auto">
          <div className="text-2xl leading-none tracking-tight font-bold">MONOLITH</div>
          <div className="mt-2 text-xs tracking-widest text-stone-400" style={{ fontFamily: "monospace" }}>Architecture · Est. 2011</div>
        </div>
        <div className="pointer-events-auto text-right">
          <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>Volume 07</div>
          <div className="mt-2 text-xs text-stone-100" style={{ fontFamily: "monospace" }}>
            Spatial Index — {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </div>
        </div>
      </header>

      {/* Horizontal scroller */}
      <div
        ref={scrollerRef}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Intro panel */}
        <section data-panel className="relative flex h-full w-screen shrink-0 snap-center items-end px-8 pb-28 md:px-14">
          <div className="max-w-3xl">
            <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>— A Spatial Portfolio</div>
            <h1 className="mt-6 text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-tight font-bold">
              Walk the<br /><em className="italic text-stone-500">quiet</em> volumes.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-stone-400 md:text-lg">
              MONOLITH is an architecture studio composing structure, silence and light.
              Scroll horizontally to move through the gallery.
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-8 right-8 text-[22vw] leading-none tracking-tighter text-stone-100/5 font-bold">00</div>
        </section>

        {/* Project panels */}
        {projects.map((p, i) => {
          const shift = (progress - (i + 1) / 8) * 120;
          const isActive = active === (i + 1);
          return (
            <section key={p.title} data-panel className="relative flex h-full w-screen shrink-0 snap-center items-center px-8 md:px-14">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[38vh] leading-none tracking-tighter text-stone-100/[0.04] font-bold"
                style={{ transform: `translateX(${-shift * 0.4}px)` }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative z-10 grid h-full w-full grid-cols-12 items-center gap-6">
                <div className="col-span-12 flex flex-col justify-center md:col-span-3">
                  <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>Nº {p.index}</div>
                  <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] leading-[0.95] tracking-tight font-bold">{p.title}</h2>
                  <dl className="mt-8 space-y-3 border-t border-stone-700 pt-6 text-sm">
                    {[["Year", p.year], ["Location", p.location], ["Typology", p.typology], ["Coord.", p.coord]].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4">
                        <dt className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>{k}</dt>
                        <dd className="text-sm text-stone-100">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <figure className={`relative mx-auto aspect-[3/4] w-full max-h-[78vh] overflow-hidden border border-stone-700 transition-transform duration-700 ease-out ${isActive ? "translate-y-0" : "translate-y-6"}`}
                    style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.5)" }}>
                    <div className="absolute inset-0 scale-110"
                      style={{
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: `translate3d(${-shift * 0.35}px, 0, 0) scale(1.15)`,
                        filter: "grayscale(0.8) contrast(1.02)",
                      }} />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-stone-950/70 px-4 py-3 text-stone-100 backdrop-blur-sm">
                      <span className="text-xs" style={{ fontFamily: "monospace" }}>{p.location}</span>
                      <span className="text-xs" style={{ fontFamily: "monospace" }}>{p.year}</span>
                    </figcaption>
                  </figure>
                </div>

                <div className="col-span-12 flex flex-col justify-end md:col-span-3">
                  <blockquote className="text-xl leading-snug text-stone-500 md:text-2xl italic">
                    "A wall is not a limit, but the beginning of interior."
                  </blockquote>
                  <div className="mt-6 text-xs text-stone-400" style={{ fontFamily: "monospace" }}>Plate {String(i + 1).padStart(2, "0")} · Silver gelatin, 2024</div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Contact panel */}
        <section data-panel className="relative flex h-full w-screen shrink-0 snap-center items-center px-8 md:px-14">
          <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>— Colophon</div>
              <h2 className="mt-6 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight font-bold">
                End of<br />the corridor.
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-8 md:pl-12">
              <div>
                <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>Studio</div>
                <div className="mt-2 text-lg">Rue des Volumes 14 · Geneva</div>
              </div>
              <div>
                <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>Correspondence</div>
                <div className="mt-2 text-lg">bureau@monolith.arch</div>
              </div>
              <div className="border-t border-stone-700 pt-6">
                <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>© MMXXVI — All works reserved</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Compass HUD */}
      <div className="pointer-events-none absolute bottom-8 left-8 z-40 md:bottom-10 md:left-14">
        <div className="flex items-center gap-4">
          <svg width={96} height={96} viewBox="0 0 96 96" className="text-stone-100">
            <circle cx={48} cy={48} r={44} fill="none" stroke="currentColor" strokeOpacity="0.2" />
            <circle cx={48} cy={48} r={44} fill="none" stroke="currentColor" strokeWidth="1"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
              transform="rotate(-90 48 48)" />
            <g transform={`rotate(${bearing} 48 48)`} style={{ transition: "transform 200ms" }}>
              <line x1={48} y1={48} x2={48} y2={12} stroke="currentColor" strokeWidth="1.25" />
              <circle cx={48} cy={48} r="2.5" fill="currentColor" />
            </g>
            <text x={48} y={0} textAnchor="middle" fill="currentColor" style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.18em" }}>N</text>
          </svg>
          <div>
            <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>Bearing</div>
            <div className="text-xs text-stone-100" style={{ fontFamily: "monospace" }}>{String(bearing).padStart(3, "0")}°</div>
            <div className="mt-2 text-xs text-stone-400" style={{ fontFamily: "monospace" }}>{current?.coord ?? "—"}</div>
          </div>
        </div>
      </div>

      {/* Progress track */}
      <div className="pointer-events-none absolute bottom-10 right-8 z-40 flex items-center gap-4 md:right-14">
        <div className="text-xs text-stone-400" style={{ fontFamily: "monospace" }}>
          {String(Math.round(progress * 100)).padStart(3, "0")}
        </div>
        <div className="relative h-px w-48 bg-stone-700 md:w-72">
          <div className="absolute left-0 top-0 h-px bg-stone-100 transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {Array.from({ length: projects.length + 2 }).map((_, i) => (
            <button key={i} onClick={() => jumpTo(i)}
              className={`h-2 w-2 border border-stone-100 transition-all ${active === i ? "bg-stone-100" : "bg-transparent hover:bg-stone-100/40"}`} />
          ))}
        </div>
      </div>
    </main>
  );
}
