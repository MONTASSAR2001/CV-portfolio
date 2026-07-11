import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/templates/sterling")({
  component: SterlingTemplate,
});

// Unsplash replacements for all local @/assets/*.jpg
const marbleImg     = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop";
const portraitImg   = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1024&auto=format&fit=crop";
const practice1     = "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=1024&auto=format&fit=crop";
const practice2     = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1024&auto=format&fit=crop";
const practice3     = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1024&auto=format&fit=crop";
const practice4     = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1024&auto=format&fit=crop";
const practice5     = "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1024&auto=format&fit=crop";

const BRONZE = "#c8a96e";

const practiceAreas = [
  { year: "I",   title: "Complex Commercial Disputes",   note: "High-stakes litigation across FTSE 100 boardrooms — shareholder disputes, fraud, and fiduciary claims.", img: practice1 },
  { year: "II",  title: "International Arbitration",      note: "ICC, LCIA, and UNCITRAL tribunals across four continents. Investor-state and commercial seats.", img: practice2 },
  { year: "III", title: "Regulatory & White-Collar",      note: "SFO, FCA, DOJ investigations and enforcement defence for boards and senior officers.", img: practice3 },
  { year: "IV",  title: "Cross-Border M&A Strategy",      note: "Advisory counsel for structural transactions above £500m — hostile takeovers, joint ventures, unwinds.", img: practice4 },
  { year: "V",   title: "Sovereign & Public Law",         note: "Constitutional challenges and judicial review at the highest courts, including the UK Supreme Court.", img: practice5 },
];

const cases = [
  { ref: "2024 · KC-118", client: "Confidential — Energy Major",       verdict: "Dismissed",             value: "£2.4B" },
  { ref: "2023 · KC-097", client: "Sovereign Wealth Fund",             verdict: "Settled — Confidential", value: "$1.1B" },
  { ref: "2023 · KC-084", client: "Global Financial Institution",      verdict: "Judgment for Defendant", value: "€780M" },
  { ref: "2022 · KC-061", client: "Tech Conglomerate (US)",            verdict: "Injunction Granted",    value: "£410M" },
];

function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setY(window.scrollY)); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      clipPath: shown ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
      transform: shown ? "translateY(0)" : "translateY(40px)",
      opacity: shown ? 1 : 0,
      transition: `clip-path 1200ms cubic-bezier(0.2,0.7,0.1,1) ${delay}ms, transform 1100ms cubic-bezier(0.2,0.7,0.1,1) ${delay}ms, opacity 900ms ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function SterlingTemplate() {
  const y = useParallax();

  return (
    <main className="relative bg-[#1a1208] text-[#f5f0e8]" style={{ fontFamily: "'Georgia', serif" }}>
      <style>{`
        .bronze-text { color: ${BRONZE}; }
        .hairline { height: 1px; background: linear-gradient(90deg, transparent, ${BRONZE}40, transparent); }
      `}</style>

      {/* Back link */}
      <Link to="/portfolio-builder" className="fixed left-4 top-4 z-50 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 backdrop-blur transition hover:text-white">← Builder</Link>

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#1a1208]/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm grid place-items-center" style={{ background: `linear-gradient(135deg, ${BRONZE}cc, ${BRONZE}66)`, boxShadow: `0 0 20px ${BRONZE}40` }}>
              <span className="text-[#1a1208] text-lg font-bold">A</span>
            </div>
            <div>
              <div className="text-sm tracking-wide text-[#f5f0e8]">Hollingsworth</div>
              <div className="text-xs uppercase tracking-widest text-[#f5f0e8]/40" style={{ fontFamily: "monospace" }}>Chambers · Est. 1998</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10 text-xs font-mono uppercase tracking-widest text-[#f5f0e8]/40">
            <a href="#practice" className="hover:text-[#f5f0e8] transition-colors">Practice</a>
            <a href="#cases" className="hover:text-[#f5f0e8] transition-colors">Case Register</a>
            <a href="#doctrine" className="hover:text-[#f5f0e8] transition-colors">Doctrine</a>
            <a href="#contact" className="hover:text-[#f5f0e8] transition-colors">Instruct</a>
          </div>
          <a href="#contact" className="hidden md:inline-flex items-center gap-3 px-5 py-2.5 border text-xs font-mono uppercase tracking-widest transition-colors duration-500 hover:text-[#1a1208]"
            style={{ borderColor: `${BRONZE}60`, color: `${BRONZE}dd`, ":hover": { background: BRONZE } }}>
            Consultation <span className="w-8 h-px bg-current inline-block" />
          </a>
        </div>
        <div className="hairline mx-8 lg:mx-14" />
      </nav>

      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden flex items-center pt-20">
        <div className="absolute inset-0 -z-10" style={{ transform: `translate3d(0, ${y * 0.3}px, 0)` }}>
          <img src={marbleImg} alt="" className="w-full h-[120%] object-cover" style={{ opacity: 0.4, filter: "grayscale(0.3)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,18,8,0.4), rgba(26,18,8,0.7) 60%, #1a1208)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #1a1208, rgba(26,18,8,0.3), transparent)" }} />
        </div>

        <div className="relative mx-auto max-w-[1600px] w-full px-8 lg:px-14 py-24">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-8">
              <div className="text-xs uppercase tracking-widest mb-6 flex items-center gap-4" style={{ color: BRONZE, fontFamily: "monospace" }}>
                <span className="w-10 h-px inline-block" style={{ background: BRONZE }} />
                The Architect of Law
              </div>
              <h1 className="text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-tight">
                <span className="block">Alistair</span>
                <span className="block italic font-light" style={{ color: "#f5f0e8cc" }}>Hollingsworth</span>
                <span className="block font-bold" style={{ color: BRONZE }}>KC</span>
              </h1>
              <p className="italic text-xl lg:text-2xl mt-8 max-w-2xl leading-relaxed" style={{ color: "#f5f0e8b3" }}>
                Strategic counsel for sovereigns, institutions, and the extraordinarily complex.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-5">
                <a href="#contact" className="group inline-flex items-center gap-5 px-9 py-5 font-mono text-xs uppercase tracking-widest text-[#1a1208] transition-all duration-500"
                  style={{ background: BRONZE, boxShadow: `0 10px 40px ${BRONZE}40` }}>
                  Instruct Counsel
                  <span className="w-8 h-px bg-current inline-block group-hover:w-14 transition-all duration-500" />
                </a>
                <a href="#practice" className="inline-flex items-center gap-4 px-7 py-5 border font-mono text-xs uppercase tracking-widest transition-colors duration-500"
                  style={{ borderColor: `${BRONZE}40`, color: "#f5f0e8" }}>
                  View Practice
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pl-8">
              <div className="p-8 border border-[#ffffff10] bg-[#f5f0e8]/5 backdrop-blur-md">
                <div className="text-xs uppercase tracking-widest mb-4" style={{ color: BRONZE, fontFamily: "monospace" }}>By the Numbers</div>
                <div className="space-y-5">
                  {[["28","Years at the Bar"],["312","Matters Led"],["£11B+","In Dispute"],["94%","Favourable Outcomes"]].map(([n,l]) => (
                    <div key={l} className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: "rgba(245,240,232,0.15)" }}>
                      <span className="text-4xl font-bold italic" style={{ color: BRONZE }}>{n}</span>
                      <span className="text-xs uppercase tracking-widest text-[#f5f0e8]/50" style={{ fontFamily: "monospace" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCTRINE */}
      <section id="doctrine" className="relative py-40 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <div className="text-xs uppercase tracking-widest mb-6" style={{ color: BRONZE, fontFamily: "monospace" }}>§ I — Doctrine</div>
              <h2 className="text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                Law, <em className="italic" style={{ color: BRONZE }}>rebuilt</em> as strategy.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-8">
            <Reveal delay={120}>
              <div className="p-10 lg:p-14 border border-[#ffffff08] bg-[#f5f0e8]/3 backdrop-blur-md">
                <p className="text-2xl lg:text-[28px] leading-[1.5] text-[#f5f0e8]/80 italic">
                  Litigation is not argument — it is <span className="font-bold not-italic" style={{ color: BRONZE }}>construction</span>.
                  Every submission a load-bearing beam, every deposition a foundation stone.
                </p>
                <div className="hairline my-10" />
                <div className="grid grid-cols-3 gap-8 text-center">
                  {[["312","Matters Led"],["£11B+","In Dispute"],["94%","Favourable"]].map(([n,l]) => (
                    <div key={l}>
                      <div className="text-5xl font-bold italic" style={{ color: BRONZE }}>{n}</div>
                      <div className="text-xs uppercase tracking-widest mt-3 text-[#f5f0e8]/40" style={{ fontFamily: "monospace" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PORTRAIT */}
      <section className="relative py-32 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 grid grid-cols-12 gap-8 items-center">
          <Reveal className="col-span-12 lg:col-span-5 relative">
            <div className="relative">
              <div className="absolute -inset-6 border" style={{ borderColor: `${BRONZE}25`, transform: `translate3d(0, ${(y - 1500) * 0.03}px, 0)` }} />
              <img src={portraitImg} alt="Alistair Hollingsworth KC" className="relative w-full object-cover" style={{ filter: "grayscale(15%)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)" }} />
              <div className="absolute -bottom-4 -right-4 px-5 py-3 text-xs uppercase tracking-widest bg-[#1a1208] border border-[#ffffff10]">
                <span style={{ color: BRONZE }}>Silk · 2011</span>
              </div>
            </div>
          </Reveal>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 space-y-8">
            <Reveal><div className="text-xs uppercase tracking-widest" style={{ color: BRONZE, fontFamily: "monospace" }}>§ II — The Counsel</div></Reveal>
            <Reveal delay={80}><h3 className="text-5xl lg:text-6xl leading-[1] tracking-tight">A discipline of <em style={{ color: BRONZE }}>precision</em>, a temperament of stone.</h3></Reveal>
            <Reveal delay={160}><p className="text-[#f5f0e8]/60 leading-relaxed text-lg max-w-xl">
              Called to the Bar in 1998. Appointed King's Counsel in 2011. Alistair reads jurisdictions as an architect reads sites.
            </p></Reveal>
          </div>
        </div>
      </section>

      {/* PRACTICE */}
      <section id="practice" className="relative py-40 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14">
          <Reveal>
            <div className="flex items-end justify-between mb-20 gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest mb-6" style={{ color: BRONZE, fontFamily: "monospace" }}>§ III — Practice</div>
                <h2 className="text-6xl lg:text-8xl leading-[0.9] tracking-tight max-w-4xl">
                  Five <em style={{ color: BRONZE }}>chambers</em> of expertise.
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="relative">
            <div className="absolute left-8 lg:left-[10%] top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${BRONZE}60, transparent)` }} />
            <ul className="space-y-2">
              {practiceAreas.map((p, i) => (
                <Reveal key={p.year} delay={i * 100}>
                  <li className="group relative grid grid-cols-12 gap-6 items-center py-10 border-t border-[#ffffff08] hover:border-[#c8a96e50] transition-colors duration-700">
                    <div className="absolute left-8 lg:left-[10%] -translate-x-1/2 w-3 h-3 rotate-45 bg-[#1a1208] border group-hover:bg-[#c8a96e] transition-all duration-500" style={{ borderColor: BRONZE }} />
                    <div className="col-span-2 lg:col-span-1 lg:col-start-2 pl-8 lg:pl-12">
                      <span className="text-4xl lg:text-5xl italic font-bold" style={{ color: BRONZE }}>{p.year}</span>
                    </div>
                    <div className="col-span-10 lg:col-span-6 lg:col-start-4">
                      <h3 className="text-3xl lg:text-4xl group-hover:translate-x-3 transition-all duration-500" style={{ transition: "color 0.5s" }}>{p.title}</h3>
                      <p className="text-[#f5f0e8]/40 text-sm mt-2 max-w-md">{p.note}</p>
                    </div>
                    <div className="hidden lg:block col-span-3 col-start-10">
                      <div className="relative aspect-[4/3] overflow-hidden border border-[#ffffff08] group-hover:border-[#c8a96e60] transition-colors duration-500">
                        <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1208]/80 via-[#1a1208]/30 to-transparent group-hover:opacity-40 transition-opacity duration-700" />
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CASE REGISTER */}
      <section id="cases" className="relative py-32">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14">
          <Reveal>
            <div className="flex items-end justify-between mb-16 gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest mb-6" style={{ color: BRONZE, fontFamily: "monospace" }}>§ IV — Case Register</div>
                <h2 className="text-6xl lg:text-7xl leading-[0.9] tracking-tight">Selected <em style={{ color: BRONZE }}>matters</em>.</h2>
              </div>
              <div className="text-xs uppercase tracking-widest text-[#f5f0e8]/30" style={{ fontFamily: "monospace" }}>Redacted per client privilege</div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="border border-[#ffffff05] bg-[#f5f0e8]/2 backdrop-blur-md">
              <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b text-xs uppercase tracking-widest" style={{ borderColor: `${BRONZE}20`, color: BRONZE, fontFamily: "monospace" }}>
                <div className="col-span-2">Reference</div>
                <div className="col-span-5">Client</div>
                <div className="col-span-3">Disposition</div>
                <div className="col-span-2 text-right">Quantum</div>
              </div>
              {cases.map((c) => (
                <div key={c.ref} className="group grid grid-cols-12 gap-4 px-8 py-8 border-b last:border-0 cursor-pointer hover:bg-[#c8a96e08] transition-colors duration-500" style={{ borderColor: "rgba(245,240,232,0.06)" }}>
                  <div className="col-span-2 text-xs text-[#f5f0e8]/40 group-hover:text-[#c8a96e] transition-colors duration-500" style={{ fontFamily: "monospace" }}>{c.ref}</div>
                  <div className="col-span-5 text-2xl italic group-hover:translate-x-2 group-hover:text-[#c8a96e] transition-all duration-500">{c.client}</div>
                  <div className="col-span-3 text-xs uppercase tracking-widest text-[#f5f0e8]/50 self-center" style={{ fontFamily: "monospace" }}>{c.verdict}</div>
                  <div className="col-span-2 text-right text-2xl italic font-bold self-center" style={{ color: BRONZE }}>{c.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: `url(${marbleImg})`, backgroundSize: "cover", opacity: 0.15, transform: `translate3d(0, ${(y - 4500) * 0.1}px, 0)` }} />
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(to bottom, #1a1208, rgba(26,18,8,0.85), #1a1208)" }} />
        <div className="mx-auto max-w-[1400px] px-8 lg:px-14">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-xs uppercase tracking-widest mb-8" style={{ color: BRONZE, fontFamily: "monospace" }}>§ V — Instruct Counsel</div>
              <h2 className="text-6xl lg:text-8xl leading-[0.9] tracking-tight">
                Correspondence <em style={{ color: BRONZE }}>by appointment</em>.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="p-12 lg:p-16 border border-[#ffffff05] bg-[#f5f0e8]/2 backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {[
                  { city: "London",    addr: "18 Fountain Court, Middle Temple, EC4Y 9DH", tel: "+44 20 7583 4000" },
                  { city: "Geneva",    addr: "Rue du Rhône 62, 1204 Genève, Switzerland",   tel: "+41 22 318 6060" },
                  { city: "Singapore", addr: "Maxwell Chambers, 32 Maxwell Rd, 069115",     tel: "+65 6595 4200" },
                ].map((o) => (
                  <div key={o.city} className="space-y-3">
                    <div className="text-3xl italic font-bold" style={{ color: BRONZE }}>{o.city}</div>
                    <div className="hairline w-16" />
                    <p className="text-sm text-[#f5f0e8]/50 leading-relaxed">{o.addr}</p>
                    <p className="text-xs text-[#f5f0e8]/30" style={{ fontFamily: "monospace" }}>{o.tel}</p>
                  </div>
                ))}
              </div>
              <div className="hairline my-14" />
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <p className="italic text-xl text-[#f5f0e8]/50 max-w-md">Instructions accepted through solicitors and by direct professional access.</p>
                <a href="mailto:clerks@hollingsworth-chambers.co.uk" className="group inline-flex items-center gap-5 px-8 py-5 font-mono text-xs uppercase tracking-widest text-[#1a1208] transition-all duration-500"
                  style={{ background: BRONZE }}>
                  Address the Clerks
                  <span className="w-10 h-px bg-current inline-block group-hover:w-16 transition-all duration-500" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-12 border-t border-[#ffffff08]">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest text-[#f5f0e8]/30" style={{ fontFamily: "monospace" }}>
          <div>© MMXXVI · Hollingsworth Chambers</div>
          <div>Regulated by the Bar Standards Board</div>
          <div style={{ color: BRONZE }}>The Architect of Law</div>
        </div>
      </footer>
    </main>
  );
}
