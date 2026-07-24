'use client'

import { useCountUp } from '@/hooks/use-count-up'
import { TrendingUp, Target, DollarSign, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Stat = {
  icon: LucideIcon
  label: string
  end: number
  decimals?: number
  prefix?: string
  suffix?: string
  accent?: boolean
  note: string
}

const STATS: Stat[] = [
  {
    icon: TrendingUp,
    label: 'Avg. ROI Uplift',
    end: 412,
    prefix: '+',
    suffix: '%',
    note: 'Across 40+ paid & lifecycle campaigns',
  },
  {
    icon: DollarSign,
    label: 'Revenue Attributed',
    end: 28.6,
    decimals: 1,
    prefix: '$',
    suffix: 'M',
    accent: true,
    note: 'Multi-touch attribution modeling',
  },
  {
    icon: Target,
    label: 'CAC Reduction',
    end: 63,
    prefix: '-',
    suffix: '%',
    note: 'Via predictive audience segmentation',
  },
  {
    icon: Users,
    label: 'Users Modeled',
    end: 94,
    suffix: 'M',
    accent: true,
    note: 'Churn & LTV forecasting pipelines',
  },
]

function StatCard({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.end, 2000, stat.decimals ?? 0)
  const Icon = stat.icon
  const display = stat.decimals ? value.toFixed(stat.decimals) : Math.round(value).toLocaleString()

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="glass neon-border group relative overflow-hidden rounded-lg p-6"
    >
      <div className="scanline absolute inset-0 opacity-30" />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {stat.label}
        </span>
        <Icon
          className={stat.accent ? 'text-accent' : 'text-primary'}
          size={20}
          strokeWidth={1.75}
        />
      </div>
      <div
        className={`relative mt-4 font-mono text-4xl font-bold tabular-nums md:text-5xl ${
          stat.accent ? 'text-accent' : 'text-primary text-glow'
        }`}
      >
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{stat.note}</p>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}

export function StatsSection() {
  return (
    <section id="results" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {'// 01 — results.log'}
        </span>
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Signals, measured. Outcomes, compounded.
        </h2>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Every model ships against a business metric. Here is the aggregate impact across
          experimentation, forecasting, and growth engineering engagements.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  )
}
