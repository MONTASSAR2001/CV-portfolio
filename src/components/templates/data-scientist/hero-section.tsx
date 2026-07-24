
import { HeroScene } from './hero-scene'
import { MousePointer2 } from 'lucide-react'
import type { PortfolioData } from '@/components/portfolio-builder/types'

export function HeroSection({ data }: { data?: PortfolioData }) {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden">
      {/* 3D scene fills the section */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* readability gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-24">
        <div className="pointer-events-none max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            status: available for Q3 engagements
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-foreground">Turning </span>
            <span className="text-primary text-glow">raw signal</span>
            <span className="text-foreground"> into </span>
            <span className="text-accent">compounding ROI</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            I&apos;m <span className="text-foreground">{data?.personalInfo?.name ?? "Aria Voss"}</span> — {data?.personalInfo?.bio ?? "a data scientist and growth engineer building machine-learning systems that move revenue. From churn models to multi-touch attribution, I ship experiments that pay for themselves."}
          </p>

          <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-md bg-primary px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View Systems
            </a>
            <a
              href="#results"
              className="rounded-md border border-border px-6 py-3 font-mono text-sm uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              See the numbers
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden items-center gap-2 font-mono text-xs text-muted-foreground md:flex">
        <MousePointer2 size={14} className="text-primary" />
        drag to orbit the data city
      </div>
    </section>
  )
}
