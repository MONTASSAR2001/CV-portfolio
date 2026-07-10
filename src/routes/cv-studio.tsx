import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/cv-studio")({
  component: CvStudioPage,
});

function CvStudioPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.24 300 / 0.2) 0%, transparent 70%)",
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
          style={{ borderColor: "oklch(0.72 0.24 300 / 0.35)" }}
        >
          Path A · Smart CV Studio
        </span>

        <h1
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.95 0.05 300), oklch(0.72 0.24 300))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CV Studio
        </h1>

        <p className="max-w-md text-base text-muted-foreground">
          This page is under construction. The AI-powered CV generation studio
          will live here — paste your LinkedIn URL or upload a document to get
          started.
        </p>

        {/* Animated placeholder bar */}
        <div className="w-full max-w-sm space-y-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          {[80, 60, 72, 50].map((w, i) => (
            <motion.div
              key={i}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: `${w}%`, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.9, ease: "easeOut" }}
              className="h-2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))",
              }}
            />
          ))}
        </div>

        <Link
          to="/dashboard"
          id="cv-studio-back"
          className="glass mt-2 rounded-xl px-5 py-2.5 text-sm font-medium text-foreground/80 transition hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>
      </motion.div>
    </main>
  );
}
