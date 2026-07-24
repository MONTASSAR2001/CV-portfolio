import { motion } from "framer-motion";

const links = [
  { label: "Expertise", href: "#expertise" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-gradient-to-br from-azure to-azure-deep grid place-items-center shadow-glow">
            <span className="text-primary-foreground font-display text-lg leading-none">V</span>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg text-foreground">Dr. Elena Vasari</span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">MD · PhD · FACS</span>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 backdrop-blur px-5 py-2 text-sm text-foreground hover:bg-card transition-colors shadow-soft">
          Request Consultation
        </a>
      </div>
    </motion.header>
  );
}
