import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";

export interface Project {
  title: string;
  category: string;
  year: string;
  color: string;
  image: string;
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="shrink-0 w-[380px] md:w-[460px] lg:w-[520px]"
      style={{ perspective: 1200 }}
      data-cursor-hover
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-strong relative aspect-[4/5] overflow-hidden rounded-3xl"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${project.color}, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `url(${project.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "luminosity",
          }}
        />
        {/* Reflection sheen */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            transform: "translateZ(40px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(168,85,247,0.15), transparent 40%)",
          }}
        />

        <div
          className="absolute inset-0 flex flex-col justify-between p-8"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-start justify-between">
            <span className="glass rounded-full px-3 py-1 text-xs uppercase tracking-widest text-white/80">
              {project.category}
            </span>
            <span className="text-xs text-white/60">{project.year}</span>
          </div>
          <div>
            <h3
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {project.title}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <span>View case study</span>
              <span className="inline-block h-px w-8 bg-white/40" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}