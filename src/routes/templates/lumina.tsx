import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/templates/lumina")({
  component: LuminaTemplate,
});

const projects = [
  { title: "Aurora Protocol",   category: "Interactive · WebGL",  year: "2026", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" },
  { title: "Neon Cathedral",    category: "Brand · Direction",    year: "2025", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop" },
  { title: "Fluid Bodies",      category: "Motion · 3D",          year: "2025", src: "https://images.unsplash.com/photo-1647891012093-6fbcccad1e54?q=80&w=800&auto=format&fit=crop" },
  { title: "Silk & Static",     category: "Editorial · Art",      year: "2024", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop" },
  { title: "Prism Index",       category: "Identity · System",    year: "2024", src: "https://images.unsplash.com/photo-1633430921741-c2a7cbe2c9d4?q=80&w=800&auto=format&fit=crop" },
  { title: "Chromaform 01",     category: "Product · Film",       year: "2023", src: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop" },
];

const PLASMA = "oklch(0.72 0.24 300)";

/* ── Particle field (CSS-only, replaces canvas component) ── */
function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? PLASMA : "rgba(255,255,255,0.3)",
            opacity: Math.random() * 0.5 + 0.1,
            animation: `float-particle ${Math.random() * 8 + 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <style>{`@keyframes float-particle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }`}</style>
    </div>
  );
}

/* ── Work card (replaces WorkCard component with WebGL filter) ── */
function WorkCard({ title, category, year, src, index }: { title: string; category: string; year: string; src: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
      style={{
        opacity: 0,
        animation: `reveal-card 0.7s ease forwards`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative overflow-hidden aspect-[4/3] mb-6">
        <img src={src} alt={title}
          className="h-full w-full object-cover transition-all duration-700"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)", filter: hovered ? "saturate(1.2)" : "saturate(0.85)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="text-xs text-white/60 uppercase tracking-widest">Enter →</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: PLASMA, fontFamily: "monospace" }}>
            {category}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <span className="text-sm text-white/40">{year}</span>
      </div>
    </article>
  );
}

function LuminaTemplate() {
  useEffect(() => {
    // Reveal observer for .reveal elements
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "oklch(0.10 0.03 280)", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes reveal-card { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .reveal { opacity:0; transform:translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
      `}</style>

      <ParticleField />

      {/* Radial glow overlays */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ background: `radial-gradient(60% 40% at 20% 10%, oklch(0.35 0.2 310 / 0.3), transparent 70%), radial-gradient(50% 40% at 90% 80%, oklch(0.35 0.18 200 / 0.25), transparent 70%)` }} />

      {/* Back link */}
      <Link to="/portfolio-builder" className="fixed left-4 top-4 z-50 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 backdrop-blur transition hover:text-white">← Builder</Link>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
          <a href="#" className="group flex items-center gap-3">
            <span className="relative grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full" style={{ background: PLASMA, boxShadow: `0 0 12px ${PLASMA}` }} />
            </span>
            <span className="text-sm font-bold tracking-widest">NOVA / ARDENT</span>
          </a>
          <nav className="hidden items-center gap-8 text-xs uppercase tracking-widest text-white/40 md:flex">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-widest backdrop-blur-md transition hover:bg-white/10">
            Available Q3
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-32 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div>
          <div className="text-xs uppercase tracking-widest mb-6" style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.4)" }}>
            /// Creative Director & Interaction Designer
          </div>
          <h1 className="text-[clamp(4rem,12vw,12rem)] font-bold leading-[0.9] tracking-tight">
            Design<br />
            <span className="italic font-light" style={{ background: `linear-gradient(120deg, ${PLASMA}, oklch(0.68 0.24 275))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              feels
            </span>
            <br />alive.
          </h1>
          <p className="mt-12 max-w-sm text-white/40 leading-relaxed">
            I collaborate with founders, labels and cultural institutions to build interfaces that feel less like software and more like a physical event.
          </p>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative z-10 overflow-hidden border-y py-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex whitespace-nowrap text-6xl md:text-8xl font-bold"
          style={{ animation: "marquee-scroll 20s linear infinite", width: "200%" }}>
          {["Kinetic","Immersive","Interactive","Sculpted","Fluid","Uncommon","Kinetic","Immersive","Interactive","Sculpted","Fluid","Uncommon"].map((w, i) => (
            <span key={i} className="mx-8 flex items-center gap-8 text-white/30">
              {w}
              <span style={{ color: PLASMA }}>✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* WORK GRID */}
      <section id="work" className="relative z-10 mx-auto max-w-[1400px] px-6 py-32 md:px-10">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4" style={{ fontFamily: "monospace" }}>/// Selected Works</div>
            <h2 className="text-5xl font-bold leading-none md:text-7xl reveal">
              A gallery, <span className="italic font-light" style={{ color: PLASMA }}>floating</span> in space.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/40">Six recent expeditions across brand, motion and interactive design.</p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-24">
          {projects.map((p, i) => <WorkCard key={p.title} index={i} {...p} />)}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 mx-auto max-w-[1400px] px-6 py-32 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-widest text-white/40 mb-4" style={{ fontFamily: "monospace" }}>/// About</div>
            <h2 className="text-5xl font-bold leading-none md:text-6xl reveal">
              An atelier of <span className="italic font-light" style={{ color: PLASMA }}>one</span>.
            </h2>
          </div>
          <div className="space-y-8 md:col-span-7 md:col-start-6">
            <p className="reveal text-2xl leading-snug text-white/80 md:text-3xl">
              I collaborate with founders, labels and cultural institutions to build interfaces that feel less like software and more like a physical event.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-4">
              {[["06+","Years crafting"],["48","Shipped worlds"],["11","Awards & mentions"]].map(([n,l]) => (
                <div key={l} className="reveal border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-4xl font-bold">{n}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-white/40">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="relative z-10 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-6" style={{ fontFamily: "monospace" }}>/// Say hello</div>
          <h2 className="text-[14vw] font-bold leading-[0.9] md:text-[10vw] reveal">
            <span className="italic font-light" style={{ color: PLASMA }}>Let's</span> build<br />
            <span className="italic text-white/30">something</span> weird.
          </h2>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t pt-10 text-sm text-white/30" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <a href="mailto:hello@nova-ardent.studio" className="font-bold text-2xl text-white hover:text-white/70 transition-colors" style={{ color: PLASMA }}>
              hello@nova-ardent.studio →
            </a>
            <div className="text-xs">© 2026 Nova Ardent — All frames handmade.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
