import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function RevealImage({
  src,
  alt,
  className = "",
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-10 bg-ivory"
        initial={{ y: "0%" }}
        animate={inView ? { y: "-101%" } : { y: "0%" }}
        transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1] }}
      />
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        className="h-full w-full object-cover"
        initial={{ scale: 1.25 }}
        animate={inView ? { scale: 1 } : { scale: 1.25 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
