import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { RevealImage } from "./RevealImage";
import type { Project } from "@/lib/projects";

export function Portfolio({
  projects,
  onHoverProject,
}: {
  projects: Project[];
  onHoverProject: (color: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // horizontal translate — desktop only via percentage
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]);
  const smoothX = useSpring(x, { stiffness: 90, damping: 26, mass: 0.6 });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${projects.length * 90}vh` }}
      aria-label="Selected works"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          <motion.div
            ref={trackRef}
            style={{ x: smoothX }}
            className="flex h-full items-center gap-[8vw] pl-[12vw] pr-[20vw] will-change-transform"
          >
            {projects.map((p, i) => {
              const layouts = [
                "h-[72vh] w-[36vw] mt-[-6vh]",
                "h-[54vh] w-[42vw] mt-[10vh]",
                "h-[80vh] w-[32vw] mt-[-2vh]",
                "h-[58vh] w-[44vw] mt-[8vh]",
                "h-[70vh] w-[34vw] mt-[-4vh]",
                "h-[62vh] w-[40vw] mt-[6vh]",
              ];
              return (
                <div key={p.id} className="flex shrink-0 flex-col gap-6">
                  <RevealImage
                    src={p.image}
                    alt={p.title}
                    width={p.w}
                    height={p.h}
                    className={layouts[i % layouts.length]}
                  />
                  <div className="flex items-end justify-between gap-6 pl-1">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")} — {p.year}
                      </div>
                      <h3
                        onMouseEnter={() => onHoverProject(p.color)}
                        className="mt-2 cursor-pointer font-serif text-4xl italic leading-[0.95] text-foreground transition-colors duration-500 hover:text-[var(--gold-deep)] md:text-5xl"
                      >
                        {p.title}
                      </h3>
                    </div>
                    <div className="whitespace-nowrap text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      {p.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* progress rail */}
        <div className="pointer-events-none absolute bottom-10 left-[12vw] right-[12vw] h-px bg-border">
          <motion.div
            className="h-full origin-left bg-[var(--gold-deep)]"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
        <div className="pointer-events-none absolute bottom-14 left-[12vw] text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Selected Works — Scroll
        </div>
      </div>
    </section>
  );
}
