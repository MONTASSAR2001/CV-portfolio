export function GradientBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a0b2e,#05030d)]" />
      <div
        className="blob"
        style={{
          top: "-10%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background: "oklch(0.75 0.25 330)",
        }}
      />
      <div
        className="blob"
        style={{
          top: "20%",
          right: "-15%",
          width: "55vw",
          height: "55vw",
          background: "oklch(0.7 0.2 210)",
          animationDelay: "-5s",
        }}
      />
      <div
        className="blob"
        style={{
          bottom: "-20%",
          left: "20%",
          width: "50vw",
          height: "50vw",
          background: "oklch(0.75 0.22 130)",
          animationDelay: "-10s",
          opacity: 0.4,
        }}
      />
      <div
        className="blob"
        style={{
          bottom: "10%",
          right: "10%",
          width: "40vw",
          height: "40vw",
          background: "oklch(0.6 0.28 300)",
          animationDelay: "-15s",
        }}
      />
      {/* subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
