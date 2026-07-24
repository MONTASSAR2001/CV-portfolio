import { motion } from "framer-motion";

const credentials = [
  ["Board Certification", "American Board of Thoracic Surgery"],
  ["Fellowship", "Cleveland Clinic — Structural Heart"],
  ["Doctorate", "Regenerative Medicine, Karolinska Institutet"],
  ["Faculty", "Johns Hopkins School of Medicine"],
  ["Affiliations", "ACS · ESC · ISHLT · AATS"],
];

export function About() {
  return (
    <section id="about" className="py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <div className="text-xs uppercase tracking-[0.3em] text-azure-deep">A Note from the Practice</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-foreground leading-[1.1]">
            Medicine practiced at the quietest possible register.
          </h2>
        </div>
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="text-lg text-foreground/80 leading-relaxed font-light"
          >
            I built this practice around a simple conviction: state-of-the-art care
            should feel unhurried. Every patient is met by the same small team,
            in the same room, from consultation through recovery. The technology
            is invisible until it needs to be seen. The plan is written in language
            you can carry home.
          </motion.p>
          <div className="mt-14 divide-y divide-border/60 border-y border-border/60">
            {credentials.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[160px_1fr] gap-8 py-5">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground pt-1">{k}</div>
                <div className="text-foreground font-display text-lg">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
