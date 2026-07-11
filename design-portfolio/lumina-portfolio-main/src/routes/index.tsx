import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ParticleField } from "@/components/ParticleField";
import { CustomCursor } from "@/components/CustomCursor";
import { KineticHero } from "@/components/KineticHero";
import { WorkCard } from "@/components/WorkCard";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const projects = [
  { title: "Aurora Protocol", category: "Interactive · WebGL", year: "2026", src: work1 },
  { title: "Neon Cathedral", category: "Brand · Direction", year: "2025", src: work2 },
  { title: "Fluid Bodies", category: "Motion · 3D", year: "2025", src: work3 },
  { title: "Silk & Static", category: "Editorial · Art", year: "2024", src: work4 },
  { title: "Prism Index", category: "Identity · System", year: "2024", src: work5 },
  { title: "Chromaform 01", category: "Product · Film", year: "2023", src: work6 },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.animationDelay = `${Math.random() * 120}ms`;
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background layers */}
      <ParticleField />
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-40" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 40% at 20% 10%, oklch(0.35 0.2 310 / 0.35), transparent 70%), radial-gradient(50% 40% at 90% 80%, oklch(0.35 0.18 200 / 0.3), transparent 70%)",
        }}
      />
      <CustomCursor />

      <Nav />
      <KineticHero />

      <Marquee />

      <section id="work" className="relative z-10 mx-auto max-w-[1400px] px-6 py-32 md:px-10">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              /// Selected Works
            </div>
            <h2 className="font-display mt-4 text-5xl leading-none md:text-7xl">
              A gallery, <span className="text-gradient">floating</span> in space.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Six recent expeditions across brand, motion and interactive design. Hover to distort.
            Click to enter.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-24">
          {projects.map((p, i) => (
            <WorkCard
              key={p.title}
              index={i}
              title={p.title}
              category={p.category}
              year={p.year}
              src={p.src}
              filterId={`liquid-${i}`}
            />
          ))}
        </div>
      </section>

      <About />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
      <a href="#" className="group flex items-center gap-3">
        <span className="relative grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-plasma shadow-[0_0_12px_var(--plasma)]" />
          <span className="absolute inset-0 animate-glow-pulse rounded-full border border-plasma/40" />
        </span>
        <span className="font-display text-sm tracking-widest">NOVA / ARDENT</span>
      </a>
      <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-muted-foreground md:flex">
        <a href="#work" className="hover:text-foreground">Work</a>
        <a href="#about" className="hover:text-foreground">About</a>
        <a href="#contact" className="hover:text-foreground">Contact</a>
      </nav>
      <a
        href="#contact"
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs uppercase tracking-widest backdrop-blur-md transition hover:bg-white/10"
      >
        Available Q3
      </a>
    </header>
  );
}

function Marquee() {
  const words = ["Kinetic", "Immersive", "Interactive", "Sculpted", "Fluid", "Uncommon"];
  const row = [...words, ...words, ...words];
  return (
    <section className="relative z-10 overflow-hidden border-y border-white/10 py-8">
      <div className="animate-marquee flex whitespace-nowrap font-display text-6xl md:text-8xl">
        {row.map((w, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 text-muted-foreground">
            {w}
            <span className="text-plasma">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function About() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section id="about" ref={ref} className="relative z-10 mx-auto max-w-[1400px] px-6 py-32 md:px-10">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            /// About
          </div>
          <h2 className="font-display reveal mt-4 text-5xl leading-none md:text-6xl">
            An atelier of <span className="text-gradient">one</span>.
          </h2>
        </div>
        <div className="space-y-8 md:col-span-7 md:col-start-6">
          <p className="reveal text-2xl leading-snug text-foreground/90 md:text-3xl">
            I collaborate with founders, labels and cultural institutions to build interfaces that
            feel less like software and more like a physical event. Every project starts with a
            question: <em className="text-plasma not-italic">how should this move?</em>
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4 md:grid-cols-3">
            {[
              ["06+", "Years crafting"],
              ["48", "Shipped worlds"],
              ["11", "Awards & mentions"],
            ].map(([n, l]) => (
              <div key={l} className="reveal border-t border-white/10 pt-4">
                <div className="font-display text-4xl">{n}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-white/10">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          /// Say hello
        </div>
        <h2 className="font-display reveal mt-6 text-[14vw] leading-[0.9] md:text-[10vw]">
          <span className="text-gradient">Let's</span> build <br />
          <span className="italic text-muted-foreground/70">something</span> weird.
        </h2>
        <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-white/10 pt-10 text-sm text-muted-foreground">
          <a
            href="mailto:hello@nova-ardent.studio"
            className="font-display text-2xl text-foreground hover:text-plasma"
          >
            hello@nova-ardent.studio →
          </a>
          <div className="flex flex-wrap gap-6 uppercase tracking-widest">
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">Are.na</a>
            <a href="#" className="hover:text-foreground">Read.cv</a>
            <a href="#" className="hover:text-foreground">Vimeo</a>
          </div>
          <div className="text-xs">© 2026 Nova Ardent — All frames handmade.</div>
        </div>
      </div>
    </footer>
  );
}
