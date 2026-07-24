export function Contact() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-gradient-to-b from-background to-accent">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-azure-deep">Consultations</div>
        <h2 className="mt-4 font-display text-4xl md:text-6xl text-foreground leading-[1.05]">
          Begin with a conversation.
        </h2>
        <p className="mt-6 text-muted-foreground max-w-xl mx-auto leading-relaxed">
          A private 45-minute consultation, in person or by encrypted video.
          A member of the practice will respond within one business day.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="mailto:practice@vasari.md" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-azure-deep to-azure px-7 py-3.5 text-sm text-primary-foreground shadow-glow">
            practice@vasari.md
          </a>
          <a href="tel:+18885550101" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm text-foreground shadow-soft">
            +1 888 555 0101
          </a>
        </div>
      </div>
      <footer className="mt-24 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <span>© 2026 Vasari Medical Practice</span>
          <span>Baltimore · London · Milan</span>
        </div>
      </footer>
    </section>
  );
}
