import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import {
  FileText, Briefcase, Globe, ArrowRight, Loader2,
  ExternalLink, Plus, Clock, History, Rocket,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface UserStats {
  cvCount: number;
  portfolioCount: number;
  latestPortfolioUrl: string | null;
  latestPortfolioTemplate: string | null;
  lastActivityAt: string | null;
}

interface DeploymentRow {
  id: string;
  deployed_url: string;
  template_id: string;
  created_at: string;
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, sub, hue, loading, href, cta,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  hue: string;
  loading: boolean;
  href: string;
  cta: string;
}) {
  return (
    <Link to={href as "/"} className="block">
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-strong group rounded-3xl p-7 transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.72_0.24_var(--hue)/0.2)]"
        style={{ "--hue": hue } as React.CSSProperties}
      >
        <div
          className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{
            background: `oklch(0.75 0.22 ${hue} / 0.15)`,
            border: `1px solid oklch(0.75 0.22 ${hue} / 0.3)`,
          }}
        >
          <Icon size={20} style={{ color: `oklch(0.85 0.2 ${hue})` }} />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</p>

        {loading ? (
          <div className="mt-2 flex items-center gap-2">
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading…</span>
          </div>
        ) : (
          <p
            className="mt-1 font-display text-5xl font-bold tracking-tight"
            style={{
              background: `linear-gradient(135deg, oklch(0.95 0.05 ${hue}), oklch(0.75 0.22 ${hue}))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {value}
          </p>
        )}

        {sub && !loading && (
          <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>
        )}

        <div
          className="mt-5 flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
          style={{ color: `oklch(0.85 0.18 ${hue})` }}
        >
          {cta} <ArrowRight size={13} />
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Deployment History Table ───────────────────────────────────────────── */
function DeploymentHistory({
  deployments,
  loading,
}: {
  deployments: DeploymentRow[];
  loading: boolean;
}) {
  const TEMPLATE_HUES: Record<string, string> = {
    vogue: "320", architect: "200", biotech: "160", lumina: "35", sterling: "270",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.6 }}
      className="mt-14"
    >
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: "oklch(0.75 0.22 210 / 0.15)", border: "1px solid oklch(0.75 0.22 210 / 0.3)" }}
        >
          <History size={15} style={{ color: "oklch(0.85 0.2 210)" }} />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Deployment history
        </p>
      </div>

      <div className="glass-strong overflow-hidden rounded-3xl">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            Loading history…
          </div>
        ) : deployments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: "oklch(0.75 0.22 210 / 0.1)", border: "1px solid oklch(0.75 0.22 210 / 0.2)" }}
            >
              <Rocket size={20} style={{ color: "oklch(0.85 0.2 210)" }} />
            </div>
            <p className="text-sm font-medium text-foreground/70">No deployments yet</p>
            <p className="text-xs text-muted-foreground">
              Build and deploy your first portfolio to see it here.
            </p>
            <Link
              to="/portfolio-builder"
              className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground/70 transition hover:bg-white/10 hover:text-foreground"
            >
              <Rocket size={12} /> Deploy a portfolio
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Template
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Live URL
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Deployed
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Open
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {deployments.map((d, i) => {
                    const hue = TEMPLATE_HUES[d.template_id] ?? "210";
                    return (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                        className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                      >
                        {/* Index */}
                        <td className="px-6 py-4 text-xs text-muted-foreground/50 font-mono">
                          {String(deployments.length - i).padStart(2, "0")}
                        </td>

                        {/* Template badge */}
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize"
                            style={{
                              background: `oklch(0.75 0.22 ${hue} / 0.12)`,
                              border: `1px solid oklch(0.75 0.22 ${hue} / 0.3)`,
                              color: `oklch(0.85 0.2 ${hue})`,
                            }}
                          >
                            {d.template_id}
                          </span>
                        </td>

                        {/* URL */}
                        <td className="max-w-[280px] px-6 py-4">
                          <a
                            href={d.deployed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate font-mono text-xs text-foreground/60 transition hover:text-foreground"
                          >
                            {d.deployed_url}
                          </a>
                        </td>

                        {/* Date + time ago */}
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          <span>{formatDate(d.created_at)}</span>
                          <span className="ml-1.5 text-muted-foreground/40">
                            · {timeAgo(d.created_at)}
                          </span>
                        </td>

                        {/* Open button */}
                        <td className="px-6 py-4 text-right">
                          <a
                            href={d.deployed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground/50 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-foreground"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStats>({
    cvCount: 0,
    portfolioCount: 0,
    latestPortfolioUrl: null,
    latestPortfolioTemplate: null,
    lastActivityAt: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [deployments, setDeployments] = useState<DeploymentRow[]>([]);

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // ── Fetch user stats + full deployment history from Supabase ────────────
  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      setStatsLoading(true);
      try {
        const [cvRes, portfolioRes, allPortfoliosRes] = await Promise.all([
          // Count saved CVs
          supabase
            .from("cvs")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user!.id),

          // Count deployed portfolios
          supabase
            .from("portfolios")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user!.id),

          // All portfolios for history table + latest banner
          supabase
            .from("portfolios")
            .select("id, deployed_url, template_id, created_at")
            .eq("user_id", user!.id)
            .order("created_at", { ascending: false }),
        ]);

        // Surface errors via toast instead of silent swallow
        if (cvRes.error) throw cvRes.error;
        if (portfolioRes.error) throw portfolioRes.error;
        if (allPortfoliosRes.error) throw allPortfoliosRes.error;

        const rows = (allPortfoliosRes.data ?? []) as DeploymentRow[];
        const latest = rows[0] ?? null;

        setDeployments(rows);
        setStats({
          cvCount: cvRes.count ?? 0,
          portfolioCount: portfolioRes.count ?? 0,
          latestPortfolioUrl: latest?.deployed_url ?? null,
          latestPortfolioTemplate: latest?.template_id ?? null,
          lastActivityAt: latest?.created_at ?? null,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Could not load dashboard data: ${msg}`, {
          description: "Check your connection or Supabase configuration.",
        });
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) return null;

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : "NA";

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-[-5%] top-[-5%] h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.24 300 / 0.18) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.85 0.18 210 / 0.18) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Nav ── */}
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
            <span className="font-display text-lg font-semibold tracking-tight">Nexus</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="glass rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 transition hover:text-foreground"
            >
              Settings
            </Link>
            <button
              id="dashboard-signout"
              onClick={handleSignOut}
              className="glass rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 transition hover:text-foreground"
            >
              Sign out
            </button>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "linear-gradient(135deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210))" }}
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-32">
        {/* Welcome heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Studio · Dashboard
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome back,{" "}
            <span className="text-gradient">{user.email?.split("@")[0]}.</span>
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            Here's a snapshot of your career assets.
          </p>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <StatCard
              icon={FileText}
              label="Saved CVs"
              value={stats.cvCount}
              sub={stats.cvCount === 0 ? "Build your first CV →" : stats.cvCount === 1 ? "1 CV on file" : `${stats.cvCount} CVs on file`}
              hue="300"
              loading={statsLoading}
              href="/cv-studio"
              cta="Open CV Studio"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
            <StatCard
              icon={Briefcase}
              label="Live Portfolios"
              value={stats.portfolioCount}
              sub={stats.portfolioCount === 0 ? "Deploy your first portfolio →" : `${stats.portfolioCount} deployed`}
              hue="210"
              loading={statsLoading}
              href="/portfolio-builder"
              cta="Portfolio Builder"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>
            <StatCard
              icon={Globe}
              label="Latest Deploy"
              value={stats.portfolioCount > 0 ? "Live" : "—"}
              sub={stats.lastActivityAt ? `Last: ${timeAgo(stats.lastActivityAt)}` : "No deployments yet"}
              hue="275"
              loading={statsLoading}
              href="/portfolio-builder"
              cta="New deployment"
            />
          </motion.div>
        </div>

        {/* ── Latest portfolio URL banner ── */}
        {stats.latestPortfolioUrl && !statsLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-6 py-4"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "oklch(0.75 0.2 150 / 0.15)", border: "1px solid oklch(0.75 0.2 150 / 0.3)" }}
            >
              <Globe size={16} style={{ color: "oklch(0.8 0.2 150)" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Latest live portfolio
                {stats.latestPortfolioTemplate && (
                  <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] capitalize">
                    {stats.latestPortfolioTemplate}
                  </span>
                )}
              </p>
              <a
                href={stats.latestPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 flex items-center gap-1 truncate text-sm text-emerald-300 transition hover:text-white"
              >
                {stats.latestPortfolioUrl} <ExternalLink size={12} />
              </a>
            </div>
            {stats.lastActivityAt && (
              <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                {timeAgo(stats.lastActivityAt)}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Quick action cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12"
        >
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Quick actions
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "action-cv",
                icon: FileText,
                label: stats.cvCount === 0 ? "Create your first CV" : "Edit your CV",
                desc: "AI-powered, ATS-optimised, print-ready PDF.",
                href: "/cv-studio" as const,
                hue: "300",
              },
              {
                id: "action-portfolio",
                icon: Briefcase,
                label: "Build a portfolio",
                desc: "Upload CV → AI generates copy → deploy to Vercel.",
                href: "/portfolio-builder" as const,
                hue: "210",
              },
              {
                id: "action-settings",
                icon: Plus,
                label: "Account settings",
                desc: "Manage your email, password, and preferences.",
                href: "/settings" as const,
                hue: "275",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.id} to={item.href} className="block">
                  <motion.div
                    id={item.id}
                    whileHover={{ y: -4 }}
                    className="glass group cursor-pointer rounded-2xl p-6 transition-all duration-300"
                  >
                    <div
                      className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{
                        background: `oklch(0.75 0.22 ${item.hue} / 0.12)`,
                        border: `1px solid oklch(0.75 0.22 ${item.hue} / 0.25)`,
                      }}
                    >
                      <Icon size={16} style={{ color: `oklch(0.85 0.2 ${item.hue})` }} />
                    </div>
                    <p className="font-display text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    <div
                      className="mt-4 flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                      style={{ color: `oklch(0.85 0.18 ${item.hue})` }}
                    >
                      Get started <ArrowRight size={12} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── Deployment History ── */}
        <DeploymentHistory deployments={deployments} loading={statsLoading} />
      </section>
    </main>
  );
}
