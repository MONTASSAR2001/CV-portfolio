import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const sections = [
    { label: "Account", width: 70 },
    { label: "Subscription", width: 55 },
    { label: "Exports", width: 80 },
    { label: "Danger zone", width: 40 },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.22 275 / 0.2) 0%, transparent 70%)",
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
          style={{ borderColor: "oklch(0.75 0.22 275 / 0.35)" }}
        >
          Account · Profile & Settings
        </span>

        <h1
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.95 0.05 275), oklch(0.72 0.22 275))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Settings
        </h1>

        <p className="max-w-md text-base text-muted-foreground">
          This page is under construction. Account management, subscription
          details, and export history will live here.
        </p>

        {/* Placeholder settings rows */}
        <div className="w-full max-w-sm divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {sections.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between px-5 py-4"
            >
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${s.width}px`,
                  background:
                    "linear-gradient(90deg, oklch(0.72 0.24 300), oklch(0.75 0.22 275))",
                  opacity: 0.5,
                }}
              />
            </motion.div>
          ))}
        </div>

        <Link
          to="/dashboard"
          id="settings-back"
          className="glass mt-2 rounded-xl px-5 py-2.5 text-sm font-medium text-foreground/80 transition hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>
      </motion.div>
    </main>
  );
}
