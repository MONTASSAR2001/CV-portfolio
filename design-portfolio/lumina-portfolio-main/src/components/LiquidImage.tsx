import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  filterId: string;
};

// SVG feDisplacementMap-based "liquid" hover distortion.
export function LiquidImage({ src, alt, filterId }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let raf = 0;
    let scale = 0;
    let target = 0;
    let freq = 0.006;
    let targetFreq = 0.006;
    let t = 0;

    const loop = () => {
      target = hover ? 60 : 0;
      targetFreq = hover ? 0.02 : 0.006;
      scale += (target - scale) * 0.08;
      freq += (targetFreq - freq) * 0.08;
      t += 0.008;
      if (dispRef.current) dispRef.current.setAttribute("scale", scale.toFixed(2));
      if (turbRef.current) {
        const fx = freq + Math.sin(t) * 0.002;
        const fy = freq + Math.cos(t * 0.8) * 0.002;
        turbRef.current.setAttribute("baseFrequency", `${fx.toFixed(4)} ${fy.toFixed(4)}`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hover]);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.006 0.006"
              numOctaves="2"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={1400}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out will-change-transform"
        style={{ filter: `url(#${filterId})`, transform: hover ? "scale(1.06)" : "scale(1)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
    </div>
  );
}