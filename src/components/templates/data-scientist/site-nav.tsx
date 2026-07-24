import { Activity } from 'lucide-react'
import type { PortfolioData } from '@/components/portfolio-builder/types'

const LINKS = [
  { href: '#results', label: 'Results' },
  { href: '#projects', label: 'Systems' },
  { href: '#skills', label: 'Stack' },
  { href: '#contact', label: 'Connect' },
]

export function SiteNav({ data }: { data?: PortfolioData }) {
  const name = data?.personalInfo?.name ?? 'ARIA_VOSS';
  const displayTitle = name.toUpperCase().replace(/\s/g, '_');

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight">
          <Activity className="text-primary" size={18} strokeWidth={2} />
          <span className="text-foreground">{displayTitle}</span>
          <span className="hidden text-muted-foreground sm:inline">/ ds.growth</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-md border border-primary/50 bg-primary/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Hire
        </a>
      </nav>
    </header>
  )
}
