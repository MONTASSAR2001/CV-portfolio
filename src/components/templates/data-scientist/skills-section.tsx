import { Brain, LineChart, Megaphone, Database } from 'lucide-react'
import type { PortfolioData } from '@/components/portfolio-builder/types'

const GROUPS = [
  {
    icon: Brain,
    title: 'Machine Learning',
    items: ['PyTorch', 'XGBoost', 'scikit-learn', 'Bayesian Inference', 'Time-Series', 'NLP'],
  },
  {
    icon: LineChart,
    title: 'Analytics & Experimentation',
    items: ['A/B/n Testing', 'Causal Inference', 'Attribution', 'Cohort Analysis', 'Forecasting'],
  },
  {
    icon: Megaphone,
    title: 'Growth & Marketing',
    items: ['Paid Media', 'Lifecycle', 'SEO/SEM', 'CRO', 'LTV Modeling', 'Segmentation'],
  },
  {
    icon: Database,
    title: 'Data Engineering',
    items: ['Snowflake', 'BigQuery', 'dbt', 'Airflow', 'Kafka', 'Spark'],
  },
]

export function SkillsSection({ data }: { data?: PortfolioData }) {
  const displayGroups = data?.skills?.length
    ? [{
        icon: Brain,
        title: 'Technical Skills',
        items: data.skills,
      }]
    : GROUPS;

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {'// 03 — capability_matrix'}
        </span>
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          A full-stack growth scientist
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {displayGroups.map((group) => {
          const Icon = group.icon
          return (
            <div
              key={group.title}
              className="glass group rounded-lg border border-border p-6 transition-colors hover:border-primary/50"
            >
              <Icon className="text-primary" size={22} strokeWidth={1.75} />
              <h3 className="mt-4 font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
