import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";

export interface Project {
  title: string;
  category: string;
  year: string;
  gradient: string;
  emoji: string;
  tags: string[];
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 20 });
  const imgZ = useSpring(0, { stiffness: 200, damping: 20 });
  const titleZ = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleEnter = () => {
    imgZ.set(60);
    titleZ.set(40);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    imgZ.set(0);
    titleZ.set(0);
  };

  return (
    <motion.div
      data-spotlight
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="glass group relative overflow-hidden rounded-3xl p-6"
      initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: project.gradient, filter: "blur(60px)", transform: "scale(0.9)" }}
      />

      <div className="relative flex items-start justify-between text-xs uppercase tracking-widest text-white/60">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>

      <motion.div
        style={{ translateZ: imgZ, transformStyle: "preserve-3d" }}
        className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl"
      >
        <div
          className="absolute inset-0"
          style={{ background: project.gradient }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-8xl"
          style={{ translateZ: 30 }}
        >
          {project.emoji}
        </motion.div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
      </motion.div>

      <motion.div style={{ translateZ: titleZ }} className="relative mt-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/70">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="h-5 w-5 text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
}
