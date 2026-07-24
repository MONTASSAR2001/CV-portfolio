export function CyberBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* deep radial glows */}
      <div className="absolute -left-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute -right-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[120px]" />

      {/* far vertical scrolling grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* perspective floor rushing toward viewer */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 [mask-image:linear-gradient(to_top,black,transparent)]">
        <div className="absolute inset-0 cyber-floor opacity-70" />
      </div>

      {/* subtle scanlines + vignette */}
      <div className="absolute inset-0 scanline opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--background)_100%)]" />
    </div>
  )
}
