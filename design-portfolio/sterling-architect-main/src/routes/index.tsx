import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import marbleImg from "@/assets/hero-marble.jpg";
import bronzeImg from "@/assets/bronze-texture.jpg";
import walnutImg from "@/assets/walnut-texture.jpg";
import portraitImg from "@/assets/lawyer-portrait.jpg";
import practice1 from "@/assets/practice-1.jpg";
import practice2 from "@/assets/practice-2.jpg";
import practice3 from "@/assets/practice-3.jpg";
import practice4 from "@/assets/practice-4.jpg";
import practice5 from "@/assets/practice-5.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const practiceAreas = [
  { year: "I", title: "Complex Commercial Disputes", note: "High-stakes litigation across FTSE 100 boardrooms — shareholder disputes, fraud, and fiduciary claims.", img: practice1 },
  { year: "II", title: "International Arbitration", note: "ICC, LCIA, and UNCITRAL tribunals across four continents. Investor-state and commercial seats.", img: practice2 },
  { year: "III", title: "Regulatory & White-Collar", note: "SFO, FCA, DOJ investigations and enforcement defence for boards and senior officers.", img: practice3 },
  { year: "IV", title: "Cross-Border M&A Strategy", note: "Advisory counsel for structural transactions above £500m — hostile takeovers, joint ventures, unwinds.", img: practice4 },
  { year: "V", title: "Sovereign & Public Law", note: "Constitutional challenges and judicial review at the highest courts, including the UK Supreme Court and Privy Council.", img: practice5 },
];

const cases = [
  { ref: "2024 · KC-118", client: "Confidential — Energy Major", verdict: "Dismissed", value: "£2.4B" },
  { ref: "2023 · KC-097", client: "Sovereign Wealth Fund", verdict: "Settled — Confidential", value: "$1.1B" },
  { ref: "2023 · KC-084", client: "Global Financial Institution", verdict: "Judgment for Defendant", value: "€780M" },
  { ref: "2022 · KC-061", client: "Tech Conglomerate (US)", verdict: "Injunction Granted", value: "£410M" },
];

function useParallax() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
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
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: shown ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
        transform: shown ? "translateY(0)" : "translateY(40px)",
        opacity: shown ? 1 : 0,
        transition: `clip-path 1200ms cubic-bezier(0.2,0.7,0.1,1) ${delay}ms, transform 1100ms cubic-bezier(0.2,0.7,0.1,1) ${delay}ms, opacity 900ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Index() {
  const y = useParallax();

  return (
    <main className="relative bg-background text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-bronze-light to-bronze-deep grid place-items-center shadow-[0_0_30px_-5px_var(--bronze)]">
              <span className="serif text-charcoal-deep text-lg font-semibold">A</span>
            </div>
            <div className="leading-tight">
              <div className="serif text-[15px] tracking-wide">Hollingsworth</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Chambers · Est. 1998</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
            <a href="#practice" className="kinetic kinetic-hover">Practice</a>
            <a href="#cases" className="kinetic kinetic-hover">Case Register</a>
            <a href="#doctrine" className="kinetic kinetic-hover">Doctrine</a>
            <a href="#contact" className="kinetic kinetic-hover">Instruct</a>
          </div>
          <a href="#contact" className="hidden md:inline-flex items-center gap-3 px-5 py-2.5 border border-bronze/40 text-bronze-light text-[11px] font-mono uppercase tracking-[0.28em] hover:bg-bronze hover:text-charcoal-deep transition-colors duration-500">
            Consultation
            <span className="w-8 h-px bg-current" />
          </a>
        </div>
        <div className="hairline mx-8 lg:mx-14" />
      </nav>

      <section className="relative min-h-[100svh] overflow-hidden grain flex items-center">
        <div
          className="absolute inset-0 -z-10"
          style={{ transform: `translate3d(0, ${y * 0.3}px, 0) scale(${1 + y * 0.0002})` }}
        >
          <img src={marbleImg} alt="" width={1920} height={1280} className="w-full h-[120%] object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/30 via-charcoal-deep/55 to-charcoal-deep" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-charcoal-deep/40 to-transparent" />
        </div>

        <div
          className="absolute right-0 top-1/4 w-[38vw] h-[55vh] hidden md:block -z-10"
          style={{
            transform: `translate3d(0, ${-y * 0.15}px, 0)`,
            backgroundImage: `url(${bronzeImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.28,
            clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
            filter: "blur(1px)",
          }}
        />

        <div className="absolute top-0 inset-x-0 mx-auto max-w-[1600px] px-8 lg:px-14 pt-28 flex items-start justify-between gap-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bronze rise">
            <div>N° 001 / Portfolio</div>
            <div className="text-muted-foreground mt-1">London · Geneva · Singapore</div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground text-right rise">
            <div>Volume XXVII</div>
            <div>MMXXVI</div>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1600px] w-full px-8 lg:px-14 py-24">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-8 curtain-reveal">
              <div className="font-mono text-[11px] uppercase tracking-[0.45em] text-bronze mb-6 flex items-center gap-4">
                <span className="w-10 h-px bg-bronze" />
                The Architect of Law
              </div>
              <h1 className="serif text-[clamp(3.25rem,9vw,9rem)] leading-[0.9] tracking-[-0.03em] text-ivory">
                <span className="block">Alistair</span>
                <span className="block italic font-light text-ivory/85">Hollingsworth</span>
                <span className="block bronze-text font-medium">KC</span>
              </h1>
              <p className="serif text-xl lg:text-2xl italic text-ivory/70 mt-8 max-w-2xl leading-relaxed">
                Strategic counsel for sovereigns, institutions, and the extraordinarily complex — where the outcome must be constructed, not merely argued.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-5">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-5 px-9 py-5 bg-bronze text-charcoal-deep font-mono text-[11px] uppercase tracking-[0.32em] hover:bg-bronze-light transition-all duration-500 shadow-[var(--shadow-bronze)]"
                >
                  Instruct Counsel
                  <span className="w-8 h-px bg-current group-hover:w-14 transition-all duration-500" />
                </a>
                <a
                  href="#practice"
                  className="inline-flex items-center gap-4 px-7 py-5 border border-bronze/40 text-ivory font-mono text-[11px] uppercase tracking-[0.32em] hover:border-bronze hover:text-bronze-light transition-colors duration-500"
                >
                  View Practice
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pl-8">
              <div className="glass-paper p-8 grain">
                <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-bronze mb-4">By the Numbers</div>
                <div className="space-y-5">
                  {[
                    ["28", "Years at the Bar"],
                    ["312", "Matters Led"],
                    ["£11B+", "In Dispute"],
                    ["94%", "Favourable Outcomes"],
                  ].map(([n, l]) => (
                    <div key={l} className="flex items-baseline justify-between border-b border-border/40 pb-3 last:border-0">
                      <span className="serif text-4xl bronze-text">{n}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ivory/60">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 inset-x-0 mx-auto max-w-[1600px] px-8 lg:px-14 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.35em] text-ivory/50">
          <span className="w-10 h-px bg-bronze" />
          Scroll to enter
        </div>
      </section>

      {/* DOCTRINE */}
      <section id="doctrine" className="relative py-40 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage: `url(${walnutImg})`,
            backgroundSize: "cover",
            transform: `translate3d(0, ${(y - 800) * 0.1}px, 0)`,
          }}
        />
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bronze mb-6">§ I — Doctrine</div>
              <h2 className="serif text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                Law, <em className="text-bronze-light">rebuilt</em> as strategy.
              </h2>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-8">
            <Reveal delay={120}>
              <div className="glass-paper rounded-sm p-10 lg:p-14 grain">
                <p className="serif text-2xl lg:text-[28px] leading-[1.5] text-foreground/90">
                  Litigation is not argument — it is <span className="bronze-text font-medium">construction</span>.
                  Every submission a load-bearing beam, every deposition a foundation stone. The architect does not react to the site; he studies it, until the building appears inevitable.
                </p>
                <div className="hairline my-10" />
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="serif text-5xl bronze-text">312</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-3">Matters Led</div>
                  </div>
                  <div>
                    <div className="serif text-5xl bronze-text">£11B+</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-3">In Dispute</div>
                  </div>
                  <div>
                    <div className="serif text-5xl bronze-text">94%</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-3">Favourable Outcomes</div>
                  </div>
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
              <div
                className="absolute -inset-6 border border-bronze/25"
                style={{ transform: `translate3d(0, ${(y - 1500) * 0.03}px, 0)` }}
              />
              <img
                src={portraitImg}
                alt="Alistair Hollingsworth KC in chambers"
                width={1024}
                height={1408}
                loading="lazy"
                className="relative w-full object-cover grayscale-[15%] shadow-[var(--shadow-elegant)]"
              />
              <div className="absolute -bottom-4 -right-4 glass-paper px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em]">
                <span className="text-bronze">Silk · 2011</span>
              </div>
            </div>
          </Reveal>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7 space-y-8">
            <Reveal>
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bronze">§ II — The Counsel</div>
            </Reveal>
            <Reveal delay={80}>
              <h3 className="serif text-5xl lg:text-6xl leading-[1] tracking-tight">
                A discipline of <em className="text-bronze-light">precision</em>, a temperament of stone.
              </h3>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-foreground/70 leading-relaxed text-lg max-w-xl">
                Called to the Bar in 1998. Appointed King's Counsel in 2011. Alistair reads jurisdictions as an architect reads sites — for their bearings, their fractures, and the load a structure must be built to carry.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <ul className="space-y-4 pt-4">
                {[
                  ["Middle Temple", "Bencher, 2018"],
                  ["Oxford · Balliol", "MA Jurisprudence, First"],
                  ["Harvard Law School", "LL.M., Kirkland Fellow"],
                  ["Chatham House", "Senior Consulting Fellow"],
                ].map(([k, v]) => (
                  <li key={k} className="grid grid-cols-2 gap-4 py-3 border-b border-border/40 kinetic kinetic-hover">
                    <span className="serif text-lg">{k}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground text-right self-center">{v}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRACTICE / TIMELINE */}
      <section id="practice" className="relative py-40 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at 30% 40%, oklch(0.55 0.10 55 / 0.12), transparent 60%)",
            transform: `translate3d(0, ${(y - 2400) * 0.15}px, 0)`,
          }}
        />
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14">
          <Reveal>
            <div className="flex items-end justify-between mb-20 gap-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bronze mb-6">§ III — Practice</div>
                <h2 className="serif text-6xl lg:text-8xl leading-[0.9] tracking-tight max-w-4xl">
                  Five <em className="text-bronze-light">chambers</em> of expertise.
                </h2>
              </div>
              <div className="hidden lg:block font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground max-w-[16rem] text-right">
                A vertical register. Each pillar a discipline honed over decades of adversarial construction.
              </div>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-8 lg:left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-bronze/60 to-transparent" />
            <ul className="space-y-2">
              {practiceAreas.map((p, i) => (
                <Reveal key={p.year} delay={i * 100}>
                  <li className="group relative grid grid-cols-12 gap-6 items-center py-10 border-t border-border/30 hover:border-bronze/50 transition-colors duration-700">
                    <div className="absolute left-8 lg:left-[10%] -translate-x-1/2 w-3 h-3 rotate-45 bg-charcoal-deep border border-bronze group-hover:bg-bronze transition-all duration-500 group-hover:scale-150" />
                    <div className="col-span-2 lg:col-span-1 lg:col-start-2 pl-8 lg:pl-12">
                      <span className="serif text-4xl lg:text-5xl italic bronze-text">{p.year}</span>
                    </div>
                    <div className="col-span-10 lg:col-span-6 lg:col-start-4">
                      <h3 className="serif text-3xl lg:text-4xl kinetic group-hover:translate-x-3 group-hover:text-bronze-light transition-all duration-500">
                        {p.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2 max-w-md">{p.note}</p>
                    </div>
                    <div className="hidden lg:block col-span-3 col-start-10">
                      <div className="relative aspect-[4/3] overflow-hidden border border-border/40 group-hover:border-bronze/60 transition-colors duration-500">
                        <img
                          src={p.img}
                          alt={p.title}
                          width={1024}
                          height={768}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[800ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-deep/80 via-charcoal-deep/30 to-transparent group-hover:opacity-40 transition-opacity duration-700" />
                        <div className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.28em] text-bronze-light">
                          View discipline →
                        </div>
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative py-40 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `url(${marbleImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translate3d(0, ${(y - 3200) * 0.2}px, 0)`,
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="mx-auto max-w-[1800px] px-8 lg:px-14">
          <div className="space-y-2 serif text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-[-0.03em]">
            {[
              { t: "Precision.", cls: "text-foreground" },
              { t: "Discretion.", cls: "italic text-muted-foreground/70 pl-[15%]" },
              { t: "Consequence.", cls: "bronze-text pl-[8%]" },
              { t: "Resolution.", cls: "italic text-muted-foreground/60 pl-[24%]" },
            ].map((w, i) => (
              <Reveal key={w.t} delay={i * 120}>
                <div className={`${w.cls} kinetic kinetic-hover cursor-default block`}>{w.t}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CASE REGISTER */}
      <section id="cases" className="relative py-32">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14">
          <Reveal>
            <div className="flex items-end justify-between mb-16 gap-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bronze mb-6">§ IV — Case Register</div>
                <h2 className="serif text-6xl lg:text-7xl leading-[0.9] tracking-tight">
                  Selected <em className="text-bronze-light">matters</em>.
                </h2>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                Redacted per client privilege
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="glass-paper grain">
              <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-bronze/20 font-mono text-[10px] uppercase tracking-[0.3em] text-bronze">
                <div className="col-span-2">Reference</div>
                <div className="col-span-5">Client</div>
                <div className="col-span-3">Disposition</div>
                <div className="col-span-2 text-right">Quantum</div>
              </div>
              {cases.map((c) => (
                <div
                  key={c.ref}
                  className="group grid grid-cols-12 gap-4 px-8 py-8 border-b border-border/30 last:border-0 hover:bg-bronze/[0.04] transition-colors duration-500 cursor-pointer"
                >
                  <div className="col-span-2 font-mono text-xs text-muted-foreground group-hover:text-bronze transition-colors duration-500">
                    {c.ref}
                  </div>
                  <div className="col-span-5 serif text-2xl kinetic group-hover:translate-x-2 group-hover:text-bronze-light transition-all duration-500">
                    {c.client}
                  </div>
                  <div className="col-span-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/70 self-center">
                    {c.verdict}
                  </div>
                  <div className="col-span-2 text-right serif text-2xl bronze-text self-center">
                    {c.value}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-40 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${walnutImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
            transform: `translate3d(0, ${(y - 4500) * 0.1}px, 0)`,
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/85 to-background" />
        <div className="mx-auto max-w-[1400px] px-8 lg:px-14">
          <Reveal>
            <div className="text-center mb-16">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bronze mb-8">§ V — Instruct Counsel</div>
              <h2 className="serif text-6xl lg:text-8xl leading-[0.9] tracking-tight">
                Correspondence <em className="text-bronze-light">by appointment</em>.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass-paper p-12 lg:p-16 grain">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {[
                  { city: "London", addr: "18 Fountain Court, Middle Temple, EC4Y 9DH", tel: "+44 20 7583 4000" },
                  { city: "Geneva", addr: "Rue du Rhône 62, 1204 Genève, Switzerland", tel: "+41 22 318 6060" },
                  { city: "Singapore", addr: "Maxwell Chambers, 32 Maxwell Rd, 069115", tel: "+65 6595 4200" },
                ].map((o) => (
                  <div key={o.city} className="space-y-3">
                    <div className="serif text-3xl bronze-text">{o.city}</div>
                    <div className="hairline w-16" />
                    <p className="text-sm text-foreground/70 leading-relaxed">{o.addr}</p>
                    <p className="font-mono text-xs text-muted-foreground">{o.tel}</p>
                  </div>
                ))}
              </div>

              <div className="hairline my-14" />

              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <p className="serif text-xl italic text-foreground/70 max-w-md text-center lg:text-left">
                  Instructions accepted through solicitors and by direct professional access.
                </p>
                <a
                  href="mailto:clerks@hollingsworth-chambers.co.uk"
                  className="group inline-flex items-center gap-5 px-8 py-5 bg-bronze text-charcoal-deep font-mono text-[11px] uppercase tracking-[0.3em] hover:bg-bronze-light transition-all duration-500 shadow-[var(--shadow-bronze)]"
                >
                  Address the Clerks
                  <span className="w-10 h-px bg-current group-hover:w-16 transition-all duration-500" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="relative py-12 border-t border-border/40">
        <div className="mx-auto max-w-[1600px] px-8 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div>© MMXXVI · Hollingsworth Chambers</div>
          <div>Regulated by the Bar Standards Board</div>
          <div className="text-bronze">The Architect of Law</div>
        </div>
      </footer>
    </main>
  );
}
