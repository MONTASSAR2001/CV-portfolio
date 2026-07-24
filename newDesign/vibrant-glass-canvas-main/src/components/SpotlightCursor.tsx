import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function SpotlightCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHover(!!el?.closest("[data-spotlight]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      {/* Global spotlight */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          background: "radial-gradient(300px circle at var(--cx) var(--cy), rgba(255,255,255,0.08), transparent 60%)",
          // @ts-expect-error css vars
          "--cx": sx,
          "--cy": sy,
        }}
      />
      {/* Cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          width: hover ? 56 : 14,
          height: hover ? 56 : 14,
          background: "white",
          transition: "width 0.25s, height 0.25s",
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[69] rounded-full border border-white/40"
        style={{
          x, y,
          translateX: "-50%",
          translateY: "-50%",
          width: 40,
          height: 40,
        }}
      />
    </>
  );
}
