import { motion } from "framer-motion";

export function CellRepairViz() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      <defs>
        <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.86 0.14 195)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="oklch(0.86 0.14 195)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="oklch(0.86 0.14 195)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#cellGrad)" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="oklch(0.86 0.14 195 / 0.4)" strokeWidth="0.6" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="oklch(0.86 0.14 195 / 0.25)" strokeWidth="0.5" strokeDasharray="3 6" className="animate-dash" />
      <circle cx="200" cy="200" r="70" fill="oklch(0.75 0.2 155 / 0.12)" stroke="oklch(0.75 0.2 155 / 0.5)" strokeWidth="0.6" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x = 200 + Math.cos(angle) * 150;
        const y = 200 + Math.sin(angle) * 150;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill="oklch(0.86 0.14 195)"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, delay: i * 0.08, repeat: Infinity }}
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <motion.line
            key={i}
            x1={200}
            y1={200}
            x2={200 + Math.cos(a) * 150}
            y2={200 + Math.sin(a) * 150}
            stroke="oklch(0.86 0.14 195 / 0.3)"
            strokeWidth="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, delay: i * 0.3, repeat: Infinity }}
          />
        );
      })}
    </svg>
  );
}

export function NeuralNetViz() {
  const layers = [4, 6, 6, 3];
  const nodes: { x: number; y: number; layer: number }[] = [];
  layers.forEach((count, li) => {
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: 50 + li * 100,
        y: 50 + (300 / (count + 1)) * (i + 1),
        layer: li,
      });
    }
  });
  const edges: { a: number; b: number }[] = [];
  nodes.forEach((n, i) => {
    nodes.forEach((m, j) => {
      if (m.layer === n.layer + 1) edges.push({ a: i, b: j });
    });
  });

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {edges.map((e, i) => (
        <motion.line
          key={i}
          x1={nodes[e.a].x}
          y1={nodes[e.a].y}
          x2={nodes[e.b].x}
          y2={nodes[e.b].y}
          stroke="oklch(0.75 0.2 155 / 0.35)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 3, delay: (i % 12) * 0.15, repeat: Infinity }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="4"
          fill="oklch(0.86 0.14 195)"
          animate={{ r: [3, 5, 3] }}
          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

export function WaveformViz() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {[0, 1, 2].map((layer) => (
        <motion.path
          key={layer}
          d={`M0 100 ${Array.from({ length: 40 })
            .map((_, i) => {
              const x = (i / 39) * 400;
              const y = 100 + Math.sin(i * 0.6 + layer) * (30 - layer * 8);
              return `L${x} ${y}`;
            })
            .join(" ")}`}
          fill="none"
          stroke={layer === 0 ? "oklch(0.86 0.14 195)" : "oklch(0.75 0.2 155)"}
          strokeWidth={layer === 0 ? 1.5 : 0.8}
          strokeOpacity={0.8 - layer * 0.2}
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 6 + layer, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.rect
          key={i}
          x={i * 10 + 2}
          y={90}
          width={4}
          height={20}
          fill="oklch(0.86 0.14 195 / 0.6)"
          animate={{ height: [10, 40 + Math.sin(i) * 20, 10], y: [95, 80, 95] }}
          transition={{ duration: 1.6, delay: i * 0.04, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}
