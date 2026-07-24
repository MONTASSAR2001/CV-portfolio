import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const positions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 12 }, () => ({ x: 0, y: 0 })),
  );
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor-hover]")) setHovering(true);
      else setHovering(false);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    let raf = 0;
    let rx = 0,
      ry = 0;
    const loop = () => {
      rx += (target.current.x - rx) * 0.18;
      ry += (target.current.y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      // shift trail positions
      positions.current.unshift({ x: rx, y: ry });
      positions.current.pop();
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = positions.current[i];
        const scale = (1 - i / positions.current.length) * 0.9;
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String((1 - i / positions.current.length) * 0.5);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="pointer-events-none fixed left-0 top-0 z-[9998] h-3 w-3 rounded-full"
          style={{
            background: `radial-gradient(circle, oklch(0.85 0.18 200 / 0.8), transparent 70%)`,
            filter: "blur(4px)",
            mixBlendMode: "screen",
          }}
        />
      ))}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border transition-[width,height,border-color] duration-200 ease-out"
        style={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          borderColor: "oklch(0.65 0.28 300 / 0.9)",
          boxShadow: "0 0 20px oklch(0.65 0.28 300 / 0.6)",
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full"
        style={{
          background: "oklch(0.85 0.18 200)",
          boxShadow: "0 0 10px oklch(0.85 0.18 200)",
        }}
      />
    </>
  );
}