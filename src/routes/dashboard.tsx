import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Guard: redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) return null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-[-5%] top-[-5%] h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.24 300 / 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.18 210 / 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-7">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210), oklch(0.72 0.24 300))",
                }}
              />
              <div className="absolute inset-[2px] rounded-md bg-background/80 grid place-items-center font-display text-sm font-bold text-gradient">
                N
              </div>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Nexus
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {user.email}
            </span>
            <button
              id="dashboard-signout"
              onClick={handleSignOut}
              className="glass rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Studio · Dashboard
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to the{" "}
            <span className="text-gradient">CV &amp; Portfolio Builder.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Your AI-powered career studio is ready. Choose a path to start building.
          </p>
        </motion.div>

        {/* Quick-action cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: "card-cv",
              tag: "Path A",
              title: "Smart CV Studio",
              desc: "Upload a document or paste your LinkedIn URL to generate an ATS-optimised CV.",
              cta: "Open CV Studio →",
              hue: "300",
              href: "/cv-studio" as const,
            },
            {
              id: "card-portfolio",
              tag: "Path B",
              title: "Portfolio Builder",
              desc: "Let the agent design, write copy, and deploy your portfolio to the cloud.",
              cta: "Start building →",
              hue: "210",
              href: "/portfolio-builder" as const,
            },
            {
              id: "card-settings",
              tag: "Account",
              title: "Profile & Settings",
              desc: "Manage your subscription, exports, and personal data.",
              cta: "Go to settings →",
              hue: "275",
              href: "/settings" as const,
            },
          ].map((card, i) => (
            <Link
              key={card.id}
              to={card.href}
              className="block"
            >
              <motion.div
                id={card.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="glass-strong group cursor-pointer rounded-3xl p-8 transition"
              >
                <span
                  className="inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground"
                  style={{ borderColor: `oklch(0.75 0.22 ${card.hue} / 0.3)` }}
                >
                  {card.tag}
                </span>
                <h2
                  className="mt-5 font-display text-2xl font-semibold tracking-tight"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.95 0.05 ${card.hue}), oklch(0.75 0.22 ${card.hue}))`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {card.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">{card.desc}</p>
                <div
                  className="mt-6 text-sm font-semibold transition group-hover:translate-x-1"
                  style={{ color: `oklch(0.85 0.18 ${card.hue})` }}
                >
                  {card.cta}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
