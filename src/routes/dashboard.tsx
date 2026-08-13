import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import {
  FileText, Briefcase, Globe, ArrowRight, Loader2,
  ExternalLink, Plus, Clock, History, Rocket, MessageSquarePlus, X
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
  source: "cvs" | "portfolios";
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

        er:bg-white/10 hover:text-foreground text-[10px]"
                            >
                              <ExternalLink size={12} className="mr-1" /> View Live
                            </a>
                          </div>
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
  
  const [updateModalOpen, setUpdateModalOpen] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState("");
  const [postingUpdate, setPostingUpdate] = useState(false);

  const handlePostUpdate = async () => {
    if (!updateModalOpen || !updateText.trim()) return;
    setPostingUpdate(true);
    try {
      const { data: cv, error } = await supabase.from("cvs").select("cv_data_json").eq("id", updateModalOpen).single();
      if (error) throw error;
      
      const currentData = cv.cv_data_json || {};
      const newHighlight = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        content: updateText.trim()
      };
      
      const updatedHighlights = [newHighlight, ...(currentData.highlights || [])];
      const newData = { ...currentData, highlights: updatedHighlights };
      
      const { error: updateError } = await supabase.from("cvs").update({ cv_data_json: newData }).eq("id", updateModalOpen);
      if (updateError) throw updateError;
      
      toast.success("Highlight posted successfully! Your portfolio timeline is updated.");
      setUpdateModalOpen(null);
      setUpdateText("");
    } catch (err) {
      toast.error(`Failed to post update: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setPostingUpdate(false);
    }
  };

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // ── Fetch user stats from Supabase ────────────
  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      setStatsLoading(true);
      try {
        const { data: cvsRes, error } = await supabase
            .from("cvs")
            .select("id")
            .eq("user_id", user!.id);

        if (error) throw error;

        setStats({
          cvCount: cvsRes?.length ?? 0,
          portfolioCount: 0,
          latestPortfolioUrl: null,
          latestPortfolioTemplate: null,
          lastActivityAt: null,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Could not load dashboard data: ${msg}`);
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
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* ── Nav ── */}
      <header className="relative z-10 border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CareerOS Logo" className="h-7 w-auto object-contain" />
            <span className="font-display text-lg font-semibold tracking-tight">CareerOS</span>
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
        <div className="mt-14 grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <StatCard
              icon={FileText}
              label="Saved CVs"
              value={stats.cvCount}
              sub={stats.cvCount === 0 ? "Build your first CV →" : stats.cvCount === 1 ? "1 CV on file" : `${stats.cvCount} CVs on file`}
              hue="0"
              loading={statsLoading}
              href="/cv-studio"
              cta="Open CV Studio"
            />
          </motion.div>
        </div>

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
                hue: "0",
              },
              {
                id: "action-settings",
                icon: Plus,
                label: "Account settings",
                desc: "Manage your email, password, and preferences.",
                href: "/settings" as const,
                hue: "0",
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

      </section>
    </main>
  );
}
