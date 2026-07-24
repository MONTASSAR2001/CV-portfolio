import { motion } from "framer-motion";
import { useState } from "react";

interface ScatterTextProps {
  children: string;
  className?: string;
  as?: "p" | "h2" | "h3";
}

export function ScatterText({ children, className = "", as = "p" }: ScatterTextProps) {
  const [hovered, setHovered] = useState(false);
  const words = children.split(/(\s+)/);

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        return (
          <span key={i} className="inline-block whitespace-pre">
            {word.split("").map((ch, j) => {
              const seed = (i * 13 + j * 7) % 100;
              const dx = hovered ? (seed - 50) * 0.6 : 0;
              const dy = hovered ? Math.sin(seed) * 12 : 0;
              const rot = hovered ? (seed - 50) * 0.4 : 0;
              return (
                <motion.span
                  key={j}
                  className="inline-block"
                  animate={{ x: dx, y: dy, rotate: rot }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 12,
                    delay: hovered ? (i * word.length + j) * 0.008 : 0,
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
