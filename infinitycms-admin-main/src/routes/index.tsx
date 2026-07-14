import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState as useStateCore } from "react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  LayoutDashboard,
  FileStack,
  FileText,
  Users,
  Search,
  LogOut,
  Bell,
  ChevronDown,
  TrendingUp,
  DollarSign,
  UserCheck,
  Briefcase,
  Upload,
  Pencil,
  Ban,
  ShieldOff,
  Settings,
  Infinity as InfinityIcon,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infinity Bugs — Super Admin" },
      { name: "description", content: "Internal control panel for Infinity Bugs SaaS operations." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type View = "overview" | "templates" | "content" | "users";

const nav: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "templates", label: "Template Manager", icon: FileStack },
  { id: "content", label: "Content & Prompts", icon: FileText },
  { id: "users", label: "Users & Billing", icon: Users },
];

const revenueData = [
  { m: "Jan", v: 42000 },
  { m: "Feb", v: 51000 },
  { m: "Mar", v: 48500 },
  { m: "Apr", v: 63200 },
  { m: "May", v: 71800 },
  { m: "Jun", v: 84400 },
  { m: "Jul", v: 92100 },
  { m: "Aug", v: 108900 },
  { m: "Sep", v: 121500 },
  { m: "Oct", v: 134200 },
  { m: "Nov", v: 148900 },
  { m: "Dec", v: 167300 },
];

const recentActivity = [
  { user: "elena.moreno@axiom.io", action: "Generated Portfolio", plan: "Pro", time: "2m ago" },
  { user: "j.tanaka@rift.dev", action: "Generated CV", plan: "Free", time: "6m ago" },
  { user: "hello@marcusdesign.co", action: "Upgraded to Pro", plan: "Pro", time: "14m ago" },
  { user: "sara.kohli@meridian.ai", action: "Generated CV", plan: "Pro", time: "27m ago" },
  { user: "dev@northloop.xyz", action: "Signed up", plan: "Free", time: "41m ago" },
  { user: "priya@lumen.works", action: "Generated Portfolio", plan: "Pro", time: "1h ago" },
];

const templates = [
  { id: "tpl_01", name: "Monolith", type: "CV", status: true, updated: "Nov 04, 2026", accent: "from-zinc-500 to-zinc-700" },
  { id: "tpl_02", name: "Aperture", type: "Portfolio", status: true, updated: "Nov 02, 2026", accent: "from-sky-500 to-indigo-600" },
  { id: "tpl_03", name: "Serif Standard", type: "CV", status: true, updated: "Oct 28, 2026", accent: "from-amber-500 to-rose-500" },
  { id: "tpl_04", name: "Grid Studio", type: "Portfolio", status: false, updated: "Oct 22, 2026", accent: "from-emerald-500 to-teal-600" },
  { id: "tpl_05", name: "Executive", type: "CV", status: true, updated: "Oct 18, 2026", accent: "from-slate-400 to-slate-600" },
  { id: "tpl_06", name: "Kiosk", type: "Portfolio", status: false, updated: "Oct 09, 2026", accent: "from-fuchsia-500 to-purple-700" },
];

const users = [
  { email: "elena.moreno@axiom.io", tier: "Pro", tokens: 8420, joined: "2026-03-11", status: "active" },
  { email: "j.tanaka@rift.dev", tier: "Free", tokens: 120, joined: "2026-09-04", status: "active" },
  { email: "hello@marcusdesign.co", tier: "Pro", tokens: 14210, joined: "2025-11-19", status: "active" },
  { email: "sara.kohli@meridian.ai", tier: "Pro", tokens: 6180, joined: "2026-01-23", status: "active" },
  { email: "dev@northloop.xyz", tier: "Free", tokens: 40, joined: "2026-10-30", status: "active" },
  { email: "priya@lumen.works", tier: "Pro", tokens: 9950, joined: "2026-05-08", status: "flagged" },
  { email: "ops@harborstack.com", tier: "Free", tokens: 0, joined: "2026-08-14", status: "active" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("overview");
  const [authChecked, setAuthChecked] = useStateCore(false);

  // ── Auth guard ──────────────────────────────────────────────
  useEffect(() => {
    // 1. Check if there is an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/login" });
      } else {
        setAuthChecked(true);
      }
    });

    // 2. Listen for auth events (logout from another tab, token expiry, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate({ to: "/login" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // ── Logout handler ──────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  // Block render until session is confirmed — prevents flash of admin UI
  if (!authChecked) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-300" />
          <span className="text-xs text-zinc-600 tracking-widest uppercase">Verifying session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-200 font-sans antialiased">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 flex flex-col">
          <div className="h-16 flex items-center gap-2.5 px-5 border-b border-zinc-800/80">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-zinc-100 to-zinc-400 text-zinc-950 flex items-center justify-center">
              <InfinityIcon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-100 tracking-tight">Infinity Bugs</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Super Admin</div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.14em] text-zinc-600">Workspace</div>
            {nav.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={[
                    "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-zinc-900 text-zinc-50 border border-zinc-800"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100 border border-transparent",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                </button>
              );
            })}

            <div className="px-3 pt-6 pb-2 text-[10px] uppercase tracking-[0.14em] text-zinc-600">System</div>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="border-t border-zinc-800/80 p-3">
            <div className="flex items-center gap-3 rounded-md bg-zinc-900/60 p-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-semibold text-zinc-950">
                DR
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-zinc-100">Daniel Rhodes</div>
                <div className="truncate text-[10px] text-zinc-500">daniel@infinitybugs.io</div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-10 flex items-center gap-4 px-6">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Admin</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-200 capitalize">{labelFor(view)}</span>
            </div>

            <div className="flex-1 max-w-md ml-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  placeholder="Search users, templates, invoices…"
                  className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-16 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-500">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button className="h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 flex items-center justify-center relative">
                <Bell className="h-4 w-4 text-zinc-400" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-400" />
              </button>
              <button className="h-9 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 px-2.5">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-[10px] font-semibold text-zinc-950 flex items-center justify-center">DR</div>
                <span className="text-sm text-zinc-200">Daniel</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
              </button>
              <button
                id="admin-logout"
                onClick={handleLogout}
                className="h-9 px-3 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-rose-950/40 hover:border-rose-900 hover:text-rose-300 text-zinc-400 text-sm flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {view === "overview" && <Overview />}
            {view === "templates" && <Templates />}
            {view === "content" && <ContentManager />}
            {view === "users" && <UsersManager />}
          </main>
        </div>
      </div>
    </div>
  );
}

function labelFor(v: View) {
  return { overview: "Overview", templates: "Template Manager", content: "Content & Prompts", users: "Users & Billing" }[v];
}

/* ============ OVERVIEW ============ */

function Overview() {
  const metrics = [
    { label: "Total Revenue", value: "$1.2M", delta: "+18.4%", up: true, icon: DollarSign, hint: "vs. prev. quarter" },
    { label: "Active Users", value: "24,891", delta: "+6.1%", up: true, icon: UserCheck, hint: "30-day rolling" },
    { label: "Generated CVs", value: "84,203", delta: "+12.7%", up: true, icon: FileText, hint: "all time" },
    { label: "Generated Portfolios", value: "31,540", delta: "-2.3%", up: false, icon: Briefcase, hint: "30-day rolling" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle="Operational snapshot across the Infinity Bugs platform." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="group rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-zinc-500">{m.label}</span>
                <div className="h-8 w-8 rounded-md bg-zinc-800/70 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="text-2xl font-semibold text-zinc-50 tracking-tight tabular-nums">{m.value}</div>
                <span
                  className={[
                    "flex items-center gap-1 text-xs font-medium",
                    m.up ? "text-emerald-400" : "text-rose-400",
                  ].join(" ")}
                >
                  {m.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {m.delta}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">{m.hint}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Revenue growth</h3>
              <p className="text-xs text-zinc-500">Monthly recurring revenue — 12 months</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-400">USD</span>
              <span className="rounded-md border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +298.3%
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid #27272a",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#e4e4e7",
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-100">Plan mix</h3>
            <span className="text-xs text-zinc-500">Active</span>
          </div>
          {[
            { name: "Pro Annual", pct: 46, color: "bg-emerald-500" },
            { name: "Pro Monthly", pct: 31, color: "bg-sky-500" },
            { name: "Free", pct: 19, color: "bg-zinc-500" },
            { name: "Trial", pct: 4, color: "bg-amber-500" },
          ].map((row) => (
            <div key={row.name} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-300">{row.name}</span>
                <span className="text-zinc-500 tabular-nums">{row.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
              </div>
            </div>
          ))}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-500">Churn (30d)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-zinc-100 tabular-nums">2.4%</span>
              <span className="text-xs text-emerald-400">-0.6pp</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Recent activity</h3>
            <p className="text-xs text-zinc-500">Latest events across the platform</p>
          </div>
          <button className="text-xs text-zinc-400 hover:text-zinc-100">View all →</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
              <th className="font-medium px-5 py-3">User</th>
              <th className="font-medium px-5 py-3">Action</th>
              <th className="font-medium px-5 py-3">Plan</th>
              <th className="font-medium px-5 py-3 text-right">When</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((r) => (
              <tr key={r.user} className="border-b border-zinc-800/60 last:border-none hover:bg-zinc-900/60 transition-colors">
                <td className="px-5 py-3.5 text-zinc-200">{r.user}</td>
                <td className="px-5 py-3.5 text-zinc-400">{r.action}</td>
                <td className="px-5 py-3.5">
                  <PlanPill tier={r.plan as "Pro" | "Free"} />
                </td>
                <td className="px-5 py-3.5 text-right text-zinc-500 tabular-nums">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ TEMPLATES ============ */

function Templates() {
  const [rows, setRows] = useState(templates);
  const toggle = (id: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: !r.status } : r)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Manager"
        subtitle="Manage CV and Portfolio templates available on the public SaaS."
        action={
          <button className="h-9 px-3.5 rounded-md bg-zinc-100 text-zinc-950 text-sm font-medium hover:bg-white flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload template
          </button>
        }
      />

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800 bg-zinc-950/40">
              <th className="font-medium px-5 py-3 w-20">Preview</th>
              <th className="font-medium px-5 py-3">Name</th>
              <th className="font-medium px-5 py-3">Type</th>
              <th className="font-medium px-5 py-3">Updated</th>
              <th className="font-medium px-5 py-3">Status</th>
              <th className="font-medium px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-zinc-800/60 last:border-none hover:bg-zinc-900/60 transition-colors">
                <td className="px-5 py-3">
                  <div className={`h-10 w-8 rounded-sm bg-gradient-to-br ${t.accent} shadow-inner ring-1 ring-white/5`} />
                </td>
                <td className="px-5 py-3">
                  <div className="text-zinc-100 font-medium">{t.name}</div>
                  <div className="text-[11px] text-zinc-500">{t.id}</div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      t.type === "CV"
                        ? "border-sky-900/60 bg-sky-950/40 text-sky-300"
                        : "border-fuchsia-900/60 bg-fuchsia-950/40 text-fuchsia-300",
                    ].join(" ")}
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-zinc-400 tabular-nums">{t.updated}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggle(t.id)}
                    className={[
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      t.status ? "bg-emerald-500/90" : "bg-zinc-700",
                    ].join(" ")}
                    aria-pressed={t.status}
                  >
                    <span
                      className={[
                        "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                        t.status ? "translate-x-4" : "translate-x-0.5",
                      ].join(" ")}
                    />
                  </button>
                  <span className={`ml-2.5 text-xs ${t.status ? "text-emerald-400" : "text-zinc-500"}`}>
                    {t.status ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="h-8 px-2.5 rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs flex items-center gap-1.5">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button className="h-8 px-2.5 rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </button>
                    <button className="h-8 w-8 rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 flex items-center justify-center">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ CONTENT ============ */

function ContentManager() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content & Prompt Manager"
        subtitle="Edit the copy and AI prompts that power the public SaaS."
        action={
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 1600);
            }}
            className="h-9 px-3.5 rounded-md bg-emerald-500 text-emerald-950 text-sm font-medium hover:bg-emerald-400"
          >
            {saved ? "Saved ✓" : "Publish changes"}
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Panel title="Landing page" hint="Primary marketing copy on infinitybugs.io">
            <Field label="Landing Page Headline" hint="Max 80 characters. Appears above the fold.">
              <input
                defaultValue="Build a portfolio that gets you hired — in minutes."
                className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </Field>
            <Field label="Subheadline">
              <input
                defaultValue="AI-crafted CVs and portfolios for the world's most ambitious engineers and designers."
                className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </Field>
          </Panel>

          <Panel title="Pricing" hint="Tier names shown on /pricing and in checkout">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Pricing Tier 1 Name">
                <input
                  defaultValue="Starter"
                  className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </Field>
              <Field label="Pricing Tier 2 Name">
                <input
                  defaultValue="Pro"
                  className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </Field>
              <Field label="Pricing Tier 3 Name">
                <input
                  defaultValue="Enterprise"
                  className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="System AI Prompt"
            hint="Controls the agentic behavior across CV and Portfolio generation. Handle with care."
          >
            <Field
              label="System Prompt"
              hint="Injected as the system role for every generation request. Supports {{variables}}."
            >
              <textarea
                rows={10}
                defaultValue={`You are Infinity, the writing engine behind Infinity Bugs.\n\nYour job is to transform a candidate's raw experience into a concise, high-signal CV or portfolio narrative. Prioritize measurable outcomes, seniority signals, and clarity. Never invent employers, dates, or metrics. Match the tone requested by {{template_tone}}.\n\nOutput must be valid JSON conforming to {{schema}}.`}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 font-mono leading-relaxed focus:outline-none focus:border-zinc-600 resize-y"
              />
            </Field>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Model: <span className="text-zinc-300">gpt-infinity-4o</span></span>
              <span>Last edited by daniel@infinitybugs.io · 2h ago</span>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Deployment">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Environment</span>
              <span className="text-zinc-100">Production</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Content version</span>
              <span className="text-zinc-100 tabular-nums">v128</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Last publish</span>
              <span className="text-zinc-100">Nov 09, 06:41</span>
            </div>
          </Panel>
          <Panel title="Safety flags" hint="Global content guardrails">
            {[
              { k: "Block hallucinated employers", on: true },
              { k: "Enforce PII redaction", on: true },
              { k: "Require citation for metrics", on: false },
            ].map((f) => (
              <label key={f.k} className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-zinc-300">{f.k}</span>
                <ToggleStatic on={f.on} />
              </label>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ============ USERS ============ */

function UsersManager() {
  const [q, setQ] = useState("");
  const filtered = users.filter((u) => u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Billing"
        subtitle="Access control, subscription tier, and token balances for every account."
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by email…"
            className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
        <button className="h-9 px-3 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-sm text-zinc-300">All tiers</button>
        <button className="h-9 px-3 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-sm text-zinc-300">Status</button>
        <div className="ml-auto text-xs text-zinc-500 tabular-nums">
          {filtered.length} of {users.length}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800 bg-zinc-950/40">
              <th className="font-medium px-5 py-3">Email</th>
              <th className="font-medium px-5 py-3">Tier</th>
              <th className="font-medium px-5 py-3 text-right">Tokens left</th>
              <th className="font-medium px-5 py-3">Joined</th>
              <th className="font-medium px-5 py-3">Status</th>
              <th className="font-medium px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.email} className="border-b border-zinc-800/60 last:border-none hover:bg-zinc-900/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300 flex items-center justify-center">
                      {u.email.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-zinc-100">{u.email}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <PlanPill tier={u.tier as "Pro" | "Free"} />
                </td>
                <td className="px-5 py-3.5 text-right text-zinc-200 tabular-nums">{u.tokens.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-zinc-400 tabular-nums">{u.joined}</td>
                <td className="px-5 py-3.5">
                  {u.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Flagged
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="h-8 px-2.5 rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs flex items-center gap-1.5">
                      <ShieldOff className="h-3.5 w-3.5" /> Revoke
                    </button>
                    <button className="h-8 px-2.5 rounded-md border border-rose-900/60 bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs flex items-center gap-1.5">
                      <Ban className="h-3.5 w-3.5" /> Ban
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ SHARED ============ */

function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-300">{label}</label>
      {hint && <div className="text-[11px] text-zinc-500 mb-1.5">{hint}</div>}
      <div className={hint ? "" : "mt-1.5"}>{children}</div>
    </div>
  );
}

function PlanPill({ tier }: { tier: "Pro" | "Free" }) {
  return tier === "Pro" ? (
    <span className="inline-flex items-center rounded-full border border-emerald-900/60 bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
      Pro
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
      Free
    </span>
  );
}

function ToggleStatic({ on }: { on: boolean }) {
  const [state, setState] = useState(on);
  return (
    <button
      onClick={() => setState((s) => !s)}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        state ? "bg-emerald-500/90" : "bg-zinc-700",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          state ? "translate-x-4" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}
