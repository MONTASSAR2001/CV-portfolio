import { useEffect, useState } from "react";
import type { PortfolioData } from "@/components/portfolio-builder/types";

const links = [
  { label: "Practice", href: "#services" },
  { label: "Firm", href: "#firm" },
  { label: "Counsel", href: "#counsel" },
  { label: "Contact", href: "#contact" },
];

export function Header({ data }: { data?: PortfolioData }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "border-b border-white/5 bg-black/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <a href="#top" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-medium tracking-wide text-ivory">
            {data?.personalInfo?.name ?? "Ashford & Vale"}
          </span>
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-xs uppercase tracking-[0.28em] text-ivory/80 transition-colors duration-500 hover:text-gold"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden border border-gold/60 px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-all duration-500 hover:bg-gold hover:text-charcoal md:inline-block"
        >
          Request Consultation
        </a>
      </div>
    </header>
  );
}
