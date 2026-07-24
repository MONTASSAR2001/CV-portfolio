import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Scale, Shield, Landmark, Gavel } from "lucide-react";
import heroScales from "@/assets/hero-scales.jpg";
import { Header } from "@/components/Header";
import { ServiceCard } from "@/components/ServiceCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ashford & Vale — Counsel in Law, Finance & Fiduciary Affairs" },
      {
        name: "description",
        content:
          "A distinguished firm advising on corporate law, auditing, and enforcement. Discretion, precision, and enduring trust since 1912.",
      },
      { property: "og:title", content: "Ashford & Vale — Counsel of Distinction" },
      {
        property: "og:description",
        content:
          "Corporate law, auditing, and enforcement counsel for institutions and private clients.",
      },
      { name: "twitter:title", content: "Ashford & Vale" },
      {
        name: "twitter:description",
        content: "Counsel in law, finance, and fiduciary affairs.",
      },
    ],
  }),
  component: Index,
});

function useScrollProgress() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return y;
}

function Hero() {
  const y = useScrollProgress();
  const heroRef = useRef<HTMLDivElement>(null);

  // Deliberate, slow parallax + subtle 3D tilt tied to scroll
  const translateY = Math.min(y * 0.25, 220);
  const rotateY = Math.min(y * 0.03, 12);
  const rotateX = Math.min(y * -0.015, -6);
  const shineX = Math.min(y * 0.4, 400);
  const scale = 1 + Math.min(y * 0.00025, 0.06);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-charcoal"
    >
      {/* Ambient midnight gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, oklch(0.28 0.08 262 / 0.9), transparent 60%), radial-gradient(ellipse at 10% 90%, oklch(0.18 0.05 260 / 0.8), transparent 55%), linear-gradient(180deg, oklch(0.13 0.02 260), oklch(0.09 0.01 260))",
        }}
      />

      {/* Vertical gold pillar accent lines */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
        <div className="absolute right-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-8 pt-32 lg:grid-cols-[1.1fr_1fr]">
        {/* Copy */}
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Est. MCMXII
            </span>
          </div>
          <h1 className="font-serif text-5xl leading-[1.05] text-ivory md:text-7xl lg:text-[5.5rem]">
            Counsel of
            <br />
            <span className="italic text-gold">enduring</span> distinction.
          </h1>
          <p className="mt-10 max-w-lg text-base leading-relaxed text-muted-foreground">
            For more than a century, Ashford &amp; Vale has advised sovereign
            institutions, private estates, and the world's most discerning
            enterprises on matters of consequence.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <a
              href="#services"
              className="group inline-flex items-center gap-4 border border-gold px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-gold transition-all duration-700 hover:bg-gold hover:text-charcoal"
            >
              Our Practice
              <span className="h-px w-6 bg-gold transition-all duration-700 group-hover:w-10 group-hover:bg-charcoal" />
            </a>
            <a
              href="#contact"
              className="text-[11px] uppercase tracking-[0.35em] text-ivory/70 transition-colors duration-500 hover:text-gold"
            >
              Private Consultation
            </a>
          </div>
        </div>

        {/* Sculptural hero visual */}
        <div className="relative flex h-[600px] items-center justify-center [perspective:1600px]">
          {/* Marble pillar backdrop */}
          <div
            className="absolute left-1/2 top-1/2 h-[560px] w-[220px] -translate-x-1/2 -translate-y-1/2 border border-gold/20"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.25 0.04 260) 0%, oklch(0.14 0.02 260) 100%)",
              boxShadow:
                "inset 0 0 80px oklch(0 0 0 / 0.6), 0 40px 120px oklch(0 0 0 / 0.5)",
              transform: `translate(-50%, -50%) rotateY(${rotateY * 0.5}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.1s linear",
            }}
          >
            {/* Pillar capital */}
            <div className="absolute -top-4 left-1/2 h-4 w-[260px] -translate-x-1/2 bg-gradient-to-b from-gold/40 to-transparent" />
            <div className="absolute -bottom-4 left-1/2 h-4 w-[260px] -translate-x-1/2 bg-gradient-to-t from-gold/40 to-transparent" />
            {/* Vertical fluting */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full w-px bg-white/5"
                style={{ left: `${(i + 1) * 14}%` }}
              />
            ))}
            {/* Moving shine */}
            <div
              className="pointer-events-none absolute inset-y-0 w-40"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.9 0.1 88 / 0.15), transparent)",
                transform: `translateX(${shineX - 200}px)`,
                transition: "transform 0.1s linear",
              }}
            />
          </div>

          {/* Golden scales, parallaxed + tilted */}
          <div
            className="relative z-10 w-[420px]"
            style={{
              transform: `translateY(${-translateY * 0.4}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
              transformStyle: "preserve-3d",
              transition: "transform 0.1s linear",
              filter:
                "drop-shadow(0 30px 60px oklch(0 0 0 / 0.6)) drop-shadow(0 0 40px oklch(0.78 0.13 82 / 0.25))",
            }}
          >
            <img
              src={heroScales}
              alt="Golden scales of justice"
              width={1536}
              height={1536}
              className="h-auto w-full select-none"
              style={{
                mixBlendMode: "screen",
                maskImage:
                  "radial-gradient(ellipse at center, black 55%, transparent 85%)",
              }}
              draggable={false}
            />
          </div>

          {/* Floor reflection */}
          <div
            className="absolute bottom-0 left-1/2 h-32 w-[500px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center top, oklch(0.78 0.13 82 / 0.2), transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Bottom marker */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[9px] uppercase tracking-[0.5em] text-ivory/40">
          Scroll
        </span>
        <span className="h-12 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      number: "I",
      title: "Corporate Law",
      description:
        "Mergers, acquisitions, and governance for multinational institutions. Strategic counsel through boardrooms and cross-border transactions of the highest complexity.",
      icon: <Landmark className="h-6 w-6" strokeWidth={1} />,
    },
    {
      number: "II",
      title: "Auditing & Assurance",
      description:
        "Forensic financial review, statutory audit, and fiduciary reporting. Precision instruments for institutions where the margin for error is zero.",
      icon: <Shield className="h-6 w-6" strokeWidth={1} />,
    },
    {
      number: "III",
      title: "Enforcement",
      description:
        "Regulatory defence, litigation, and asset recovery. Discreet, resolute representation before tribunals, commissions, and international arbiters.",
      icon: <Gavel className="h-6 w-6" strokeWidth={1} />,
    },
  ];

  return (
    <section id="services" className="relative bg-charcoal py-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                Our Practice
              </span>
            </div>
            <h2 className="font-serif text-5xl leading-tight text-ivory md:text-6xl">
              Three disciplines.
              <br />
              <span className="italic text-gold/90">One standard.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Each engagement is led by a named partner. Each brief is treated
            as a matter of the firm's own reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/5 md:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { k: "112", l: "Years of practice" },
    { k: "$48B", l: "Assets under advisement" },
    { k: "37", l: "Named partners" },
    { k: "14", l: "Jurisdictions" },
  ];
  return (
    <section id="firm" className="relative border-y border-white/5 bg-midnight-deep py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="border-l border-gold/30 pl-6">
            <div className="font-serif text-5xl text-gold">{s.k}</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ivory/60">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Counsel() {
  return (
    <section id="counsel" className="relative bg-charcoal py-32">
      <div className="mx-auto max-w-5xl px-8 text-center">
        <Scale className="mx-auto mb-10 h-10 w-10 text-gold" strokeWidth={1} />
        <p className="font-serif text-3xl italic leading-relaxed text-ivory md:text-4xl">
          "We do not chase the fashions of the profession. We measure our work
          by the century, not the quarter."
        </p>
        <div className="mt-10 flex flex-col items-center gap-2">
          <span className="h-px w-16 bg-gold" />
          <span className="mt-4 text-[10px] uppercase tracking-[0.4em] text-gold">
            Sir Nathaniel Ashford, KC
          </span>
          <span className="text-xs text-ivory/50">Senior Partner</span>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative bg-midnight-deep py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-8 lg:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Contact
            </span>
          </div>
          <h2 className="font-serif text-5xl leading-tight text-ivory md:text-6xl">
            A private
            <br />
            <span className="italic text-gold/90">consultation.</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Enquiries are handled personally by the office of the senior
            partner. All correspondence is treated in absolute confidence.
          </p>

          <div className="mt-12 space-y-6 text-sm text-ivory/80">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
                London
              </div>
              <div className="mt-2">14 Lincoln's Inn Fields, WC2A 3PP</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
                Geneva
              </div>
              <div className="mt-2">Quai du Mont-Blanc 3, 1201</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
                Direct
              </div>
              <div className="mt-2">+44 (0)20 7946 0912</div>
            </div>
          </div>
        </div>

        <form className="space-y-8 border border-white/10 bg-charcoal/60 p-10 backdrop-blur-sm">
          {["Full name", "Institution", "Electronic address"].map((f) => (
            <div key={f}>
              <label className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-gold/70">
                {f}
              </label>
              <input
                type="text"
                className="w-full border-b border-white/20 bg-transparent py-3 text-ivory outline-none transition-colors duration-500 focus:border-gold"
              />
            </div>
          ))}
          <div>
            <label className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-gold/70">
              Matter
            </label>
            <textarea
              rows={4}
              className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-ivory outline-none transition-colors duration-500 focus:border-gold"
            />
          </div>
          <button
            type="button"
            className="group inline-flex items-center gap-4 border border-gold bg-transparent px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-gold transition-all duration-700 hover:bg-gold hover:text-charcoal"
          >
            Submit in Confidence
            <span className="h-px w-6 bg-gold transition-all duration-700 group-hover:w-10 group-hover:bg-charcoal" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-charcoal py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 md:flex-row">
        <div className="font-serif text-lg text-ivory">
          Ashford <span className="text-gold">&</span> Vale
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">
          © MMXXVI · All rights reserved · Regulated by the SRA
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <Counsel />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
