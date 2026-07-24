import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Dr. Vasari treated my mother with a rare grace. Every decision was explained, every risk weighed. Six months on, she is walking the coast again.",
    name: "Amelia R.",
    role: "Family of patient · London",
  },
  {
    quote:
      "I flew in for a second opinion and left with a plan I could actually live with. The clinic feels less like a hospital and more like a study.",
    name: "Marcus D.",
    role: "Cardiac patient · Zurich",
  },
  {
    quote:
      "As a colleague, what impresses me most is the discipline of her research. She holds her practice to the standard of a laboratory.",
    name: "Dr. H. Nakamura",
    role: "Chief of Surgery · Kyoto",
  },
  {
    quote:
      "Calm, unhurried, exact. The regenerative program has given me back a quality of life I had quietly stopped expecting.",
    name: "Sofia P.",
    role: "Pulmonary patient · Milan",
  },
];

import type { PortfolioData } from "@/components/portfolio-builder/types";

export function Testimonials({ data }: { data?: PortfolioData }) {
  const displayItems = data?.experience?.length
    ? data.experience.map(exp => ({
        quote: exp.description,
        name: exp.company,
        role: `${exp.role} · ${exp.duration}`,
      }))
    : testimonials;

  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-azure-soft via-background to-accent" />
        <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-azure/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-azure-deep/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[380px] w-[380px] rounded-full bg-white/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-azure-deep">Patient Testimonials</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-foreground">In their own words.</h2>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {displayItems.map((t, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full px-4 md:px-10">
                <motion.blockquote
                  initial={{ opacity: 0.5, scale: 0.98 }}
                  animate={{ opacity: selected === i ? 1 : 0.5, scale: selected === i ? 1 : 0.98 }}
                  transition={{ duration: 0.6 }}
                  className="glass-panel rounded-3xl p-10 md:p-16 mx-auto max-w-3xl"
                >
                  <div className="font-display text-5xl text-azure-deep/50 leading-none">"</div>
                  <p className="mt-4 font-display text-2xl md:text-3xl text-foreground leading-snug">
                    {t.quote}
                  </p>
                  <footer className="mt-10 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-azure to-azure-deep" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{t.name}</div>
                      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{t.role}</div>
                    </div>
                  </footer>
                </motion.blockquote>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          {displayItems.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${selected === i ? "w-10 bg-azure-deep" : "w-4 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
