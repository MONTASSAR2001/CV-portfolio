'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Project = {
  id: string
  title: string
  category: string
  description: string
  metrics: { label: string; value: string }[]
  stack: string[]
}

const PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    title: 'Churn Sentinel',
    category: 'Predictive ML',
    description:
      'Real-time churn prediction engine scoring 12M subscribers nightly, feeding automated retention offers into the lifecycle stack.',
    metrics: [
      { label: 'RECALL', value: '0.91' },
      { label: 'CHURN ↓', value: '23%' },
    ],
    stack: ['XGBoost', 'Airflow', 'BigQuery', 'dbt'],
  },
  {
    id: 'PRJ-002',
    title: 'Attribution Grid',
    category: 'Marketing Analytics',
    description:
      'Markov-chain multi-touch attribution model reallocating a $9M annual ad budget across 14 channels with weekly retraining.',
    metrics: [
      { label: 'ROAS', value: '4.8x' },
      { label: 'WASTE ↓', value: '31%' },
    ],
    stack: ['Python', 'Snowflake', 'Looker', 'Meta API'],
  },
  {
    id: 'PRJ-003',
    title: 'Nova Recommender',
    category: 'Deep Learning',
    description:
      'Two-tower neural recommender powering on-site personalization, lifting average order value across 3M monthly sessions.',
    metrics: [
      { label: 'AOV ↑', value: '18%' },
      { label: 'CTR ↑', value: '2.4x' },
    ],
    stack: ['PyTorch', 'Vertex AI', 'Redis', 'Kafka'],
  },
  {
    id: 'PRJ-004',
    title: 'Pulse Experiments',
    category: 'Causal Inference',
    description:
      'Bayesian experimentation platform running 200+ concurrent A/B/n tests with sequential testing and guardrail metrics.',
    metrics: [
      { label: 'TESTS', value: '200+' },
      { label: 'VELOCITY ↑', value: '3x' },
    ],
    stack: ['Stan', 'React', 'Postgres', 'Growthbook'],
  },
]

function TiltCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - py) * 12
    const rotateY = (px - 0.5) * 12
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(14px)`,
    )
  }

  function reset() {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      className="glass group relative overflow-hidden rounded-lg border border-border transition-shadow duration-300 will-change-transform hover:shadow-[0_0_28px_oklch(0.86_0.24_148/0.28),0_0_1px_1px_oklch(0.86_0.24_148/0.4)]"
    >
      {/* terminal title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {project.id} — {project.title.toLowerCase().replace(/\s/g, '_')}.ipynb
        </span>
        <ArrowUpRight
          size={16}
          className="ml-auto text-muted-foreground transition-colors group-hover:text-primary"
        />
      </div>

      <div className="scanline pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative p-6">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {project.category}
        </span>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-md border border-border bg-background/40 p-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.label}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-primary text-glow">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-border bg-secondary/30 px-2 py-1 font-mono text-[11px] text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {'// 02 — deployed_systems'}
        </span>
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Production dashboards & models
        </h2>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Hover any terminal to inspect it in 3D space. Each window is a shipped system running
          against live revenue.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PROJECTS.map((project) => (
          <TiltCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
