import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/portfolio-builder")({
  component: PortfolioBuilderPage,
});

function PortfolioBuilderPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.18 210 / 0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
      >
        {/* Badge */}
        <span
          className="rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground"
          style={{ borderColor: "oklch(0.85 0.18 210 / 0.35)" }}
        >
          Path B · Agentic Portfolio Builder
        </span>

        <h1
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.95 0.05 210), oklch(0.72 0.24 210))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Portfolio Builder
        </h1>

        <p className="max-w-md text-base text-muted-foreground">
          This page is under construction. The agentic portfolio builder will
          live here — design, copy, and deploy your live site in seconds.
        </p>

        {/* Animated grid placeholder */}
        <div className="grid grid-cols-6 gap-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 200 }}
              className="aspect-square rounded-md"
              style={{
                background:
                  i % 5 === 0
                    ? "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))"
                    : "oklch(1 0 0 / 0.05)",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            />
          ))}
        </div>

        <Link
          to="/dashboard"
          id="portfolio-builder-back"
          className="glass mt-2 rounded-xl px-5 py-2.5 text-sm font-medium text-foreground/80 transition hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>
      </motion.div>
    </main>
  );
}
