import { Mail, Link as LinkIcon, Globe, Terminal } from 'lucide-react'

export function ContactSection() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="glass neon-border relative overflow-hidden rounded-xl p-8 md:p-14">
        <div className="scanline pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            <Terminal size={14} />
            {'// 04 — open_channel'}
          </span>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Have a metric that needs moving?
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            I partner with data-forward teams to build models and growth systems that ship to
            production. Let&apos;s scope the impact.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:aria@voss.dev"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Mail size={16} />
              aria@voss.dev
            </a>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="rounded-md border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <LinkIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-md border border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 font-mono text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} ARIA_VOSS // all systems operational</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          uptime 99.98%
        </span>
      </footer>
    </section>
  )
}
