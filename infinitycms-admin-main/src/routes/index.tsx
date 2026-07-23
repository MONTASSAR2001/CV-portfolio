import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Megaphone, Layers, Users,
  LogOut, Infinity as InfinityIcon, TrendingUp,
  UserCheck, FileText, Briefcase, ToggleLeft, ToggleRight,
  Tag, Bell, ChevronRight, Star, ShieldCheck, Loader2, Ban
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast, Toaster } from "sonner";

const MASTER_EMAIL = import.meta.env.VITE_MASTER_ADMIN_EMAIL as string | undefined;

type View = "overview" | "marketing" | "templates" | "users";

const NAV: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview & Analytics", icon: LayoutDashboard },
  { id: "marketing", label: "Marketing & Promos",   icon: Megaphone },
  { id: "templates", label: "Template Engine",      icon: Layers },
  { id: "users",     label: "User Accounts",        icon: Users },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "God Mode — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView]         = useState<View>("overview");
  const [ready, setReady]       = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      supabase.auth.getSession().then(async ({ data: { session }, error }) => {
        if (error) console.error("Session error:", error);
        if (!session) { navigate({ to: "/login" }); return; }
        if (MASTER_EMAIL && session.user.email !== MASTER_EMAIL) {
          await supabase.auth.signOut();
          navigate({ to: "/login" });
          return;
        }
        setAdminEmail(session.user.email ?? "");
        setReady(true);
      }).catch(err => console.error("Session catch error:", err));
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
        if (!s) navigate({ to: "/login" });
      });
      return () => subscription.unsubscribe();
    } catch (e) {
      console.error("Auth check error:", e);
    }
  }, [isMounted, navigate]);

  if (!isMounted) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (!ready) return (
    <div className="dark flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
        <span className="text-[11px] uppercase tracking-widest text-zinc-600">God-Mode Verifying…</span>
      </div>
    </div>
  );

  return (
    <div className="dark flex min-h-screen bg-zinc-950 text-zinc-200">
      <Toaster theme="dark" position="bottom-right" />
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-zinc-800/80">
        <div className="flex h-14 items-center gap-2.5 px-4 border-b border-zinc-800/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-400">
            <InfinityIcon className="h-4 w-4 text-zinc-950" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-zinc-100">God Mode</div>
            <div className="text-[9px] uppercase tracking-widest text-zinc-500">Master Admin</div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = view === id;
            return (
              <button key={id} onClick={() => setView(id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                  active ? "bg-zinc-800 text-zinc-50 border border-zinc-700" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {active && <ChevronRight className="h-3 w-3 text-zinc-500" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800/80 p-3">
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-zinc-900/60 px-2.5 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-500 text-[10px] font-bold text-white">
              {adminEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[11px] font-semibold text-zinc-100">{adminEmail}</div>
              <div className="flex items-center gap-1 text-[9px] text-rose-400">
                <ShieldCheck className="h-2.5 w-2.5" /> God Mode
              </div>
            </div>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-500 hover:bg-rose-950/40 hover:text-rose-300 transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur px-6 gap-3 sticky top-0 z-10">
          <span className="text-xs text-zinc-500">God Mode</span>
          <span className="text-zinc-700">/</span>
          <span className="text-xs font-semibold text-zinc-200 capitalize">{NAV.find(n => n.id === view)?.label}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full border border-rose-900/50 bg-rose-950/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
              ☠ God Mode Active
            </span>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
              <Bell className="h-3.5 w-3.5 text-zinc-400" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {view === "overview"  && <OverviewView />}
          {view === "marketing" && <MarketingView />}
          {view === "templates" && <TemplatesView />}
          {view === "users"     && <UsersView />}
        </main>
      </div>
    </div>
  );
}

/* ── Overview ──────────────────────────────────────────────────────────────── */
function OverviewView() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([
    { label: "Total Signups (30d)", value: "0", delta: "", up: true,  icon: UserCheck },
    { label: "CVs Saved (30d)",     value: "0", delta: "", up: true,  icon: FileText  },
    { label: "Portfolios (30d)",    value: "0", delta: "", up: true,  icon: Briefcase },
    { label: "MRR",                 value: "$0", delta: "N/A", up: true, icon: TrendingUp },
  ]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [usersRes, cvsRes, portsRes] = await Promise.all([
          supabase.from('admin_signups_per_day').select('*'),
          supabase.from('admin_cvs_per_day').select('*'),
          supabase.from('admin_portfolios_per_day').select('*'),
        ]);

        if (usersRes.error) console.error("Signups query error:", usersRes.error);
        if (cvsRes.error) console.error("CVs query error:", cvsRes.error);
        if (portsRes.error) console.error("Portfolios query error:", portsRes.error);

        const totalSignups = usersRes.data?.reduce((acc, row) => acc + Number(row.signups), 0) || 0;
        const totalCVs = cvsRes.data?.reduce((acc, row) => acc + Number(row.cvs_saved), 0) || 0;
        const totalPorts = portsRes.data?.reduce((acc, row) => acc + Number(row.portfolios_deployed), 0) || 0;

        const recentSignups = usersRes.data?.slice(-7).map(row => ({
          d: new Date(row.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          v: Number(row.signups)
        })) || [];

        setKpis([
          { label: "Total Signups (30d)", value: totalSignups.toLocaleString(), delta: "", up: true,  icon: UserCheck },
          { label: "CVs Saved (30d)",     value: totalCVs.toLocaleString(), delta: "", up: true,  icon: FileText  },
          { label: "Portfolios (30d)",    value: totalPorts.toLocaleString(), delta: "", up: true, icon: Briefcase },
          { label: "MRR",                 value: "$0", delta: "N/A", up: true, icon: TrendingUp },
        ]);
        setChartData(recentSignups);
      } catch (e) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview & Analytics" sub="Platform snapshot — last 30 days." />
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map(k => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500">{k.label}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                      <Icon className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-bold text-zinc-50 tabular-nums">{k.value}</div>
                  <div className={`mt-1 text-xs font-semibold ${k.up ? "text-emerald-400" : "text-rose-400"}`}>{k.delta}</div>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="mb-1 text-sm font-semibold text-zinc-100">Daily Signups (last 7 days)</h3>
            <p className="mb-4 text-xs text-zinc-500">New user registrations per day</p>
            <div className="h-56">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-zinc-500 text-sm">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="d" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12, color: "#e4e4e7" }} />
                    <Area type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={2} fill="url(#sg)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Marketing ─────────────────────────────────────────────────────────────── */
function MarketingView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [promoOn,  setPromoOn]  = useState(false);
  const [promoLabel, setPromoLabel] = useState("Happy Week");
  const [discount, setDiscount] = useState(30);
  
  const [announcement, setAnnouncement] = useState("");
  const [annOn, setAnnOn] = useState(false);

  const [pricingTiers, setPricingTiers] = useState<any[]>([
    { name: "Starter", price_monthly: 0 },
    { name: "Pro",     price_monthly: 19 },
    { name: "Enterprise", price_monthly: 49 },
  ]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) console.error("Site settings error:", error);
        if (data) {
          const promo = data.find(d => d.key === 'active_promo')?.value;
          if (promo) {
            setPromoOn(promo.enabled);
          setPromoLabel(promo.label);
          setDiscount(promo.discount_pct);
        }
        const ann = data.find(d => d.key === 'announcement_bar')?.value;
        if (ann) {
          setAnnOn(ann.enabled);
          setAnnouncement(ann.message);
        }
        const pricing = data.find(d => d.key === 'pricing_tiers')?.value;
        if (pricing && Array.isArray(pricing)) {
          setPricingTiers(pricing);
        }
      }
      } catch (err) {
        console.error("Site settings fetch exception:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const save = async () => { 
    setSaving(true);
    
    const promoData = { enabled: promoOn, label: promoLabel, discount_pct: discount, expires_at: null };
    const annData = { enabled: annOn, message: announcement, color: "emerald" };

    const { error: err1 } = await supabase.from('site_settings').update({ value: promoData }).eq('key', 'active_promo');
    const { error: err2 } = await supabase.from('site_settings').update({ value: annData }).eq('key', 'announcement_bar');

    if (err1 || err2) {
      toast.error("Failed to update settings");
    } else {
      toast.success("Settings published successfully");
    }
    setSaving(false); 
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Marketing & Promos" sub="Control active promotions and site-wide announcements." />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
        </div>
      ) : (
        <>
          {/* Promo card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Active Promotion</h3>
              </div>
              <Toggle on={promoOn} onToggle={() => setPromoOn(p => !p)} />
            </div>
            {promoOn && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                <Field label="Promo Label">
                  <input value={promoLabel} onChange={e => setPromoLabel(e.target.value)}
                    className="admin-input" placeholder="e.g. Happy Week" />
                </Field>
                <Field label="Discount %">
                  <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))}
                    className="admin-input" min={0} max={100} />
                </Field>
              </div>
            )}
            {promoOn && (
              <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-xs text-amber-300">
                ⚡ <strong>{promoLabel}</strong> — {discount}% off is currently live on the pricing page.
              </div>
            )}
          </div>

          {/* Announcement bar */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Announcement Bar</h3>
              </div>
              <Toggle on={annOn} onToggle={() => setAnnOn(p => !p)} />
            </div>
            <Field label="Message">
              <input value={announcement} onChange={e => setAnnouncement(e.target.value)}
                className="admin-input" placeholder="We're launching new templates this week! 🚀" />
            </Field>
          </div>

          {/* Pricing tiers */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="mb-4 text-sm font-semibold text-zinc-100">Pricing Tiers</h3>
            <div className="grid grid-cols-3 gap-3">
              {pricingTiers.map(t => (
                <div key={t.name} className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{t.name}</div>
                  <div className="mt-2 text-2xl font-bold text-zinc-50">${t.price_monthly}<span className="text-xs text-zinc-500">/mo</span></div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-zinc-600">Edit pricing in <code className="text-zinc-400">site_settings.pricing_tiers</code> via Supabase SQL editor.</p>
          </div>

          <div className="flex justify-end">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 transition-colors disabled:opacity-50">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : "Publish changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Templates ─────────────────────────────────────────────────────────────── */
function TemplatesView() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('dynamic_templates').select('*').order('sort_order', { ascending: true });
        if (error) console.error("Templates error:", error);
        if (data) setRows(data);
      } catch (err) {
        console.error("Templates fetch exception:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, []);

  const toggle = async (id: string, field: "status" | "is_premium") => {
    const template = rows.find(r => r.id === id);
    if (!template) return;
    const newValue = !template[field];
    
    // Optimistic update
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: newValue } : r));
    
    const { error } = await supabase.from('dynamic_templates').update({ [field]: newValue }).eq('id', id);
    if (error) {
      toast.error(`Failed to update ${template.name}`);
      // Revert on error
      setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: !newValue } : r));
    } else {
      toast.success(`${template.name} updated successfully`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Template Engine" sub="Enable, disable, and mark templates as premium on the fly." />
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-3">Template</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-center">Premium</th>
                <th className="px-5 py-3 text-center">Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(t => (
                <tr key={t.id} className="border-b border-zinc-800/50 last:border-none hover:bg-zinc-900/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-zinc-100">{t.name}</div>
                    <div className="text-[11px] text-zinc-500">{t.id}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      t.category === "CV" ? "border-sky-900/60 bg-sky-950/40 text-sky-300" : "border-fuchsia-900/60 bg-fuchsia-950/40 text-fuchsia-300"
                    }`}>{t.category}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => toggle(t.id, "is_premium")} title="Toggle premium">
                      <Star className={`mx-auto h-4 w-4 transition-colors ${t.is_premium ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Toggle on={t.status} onToggle={() => toggle(t.id, "status")} small />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Users ─────────────────────────────────────────────────────────────────── */
function UsersView() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-users');
      if (data && data.users) {
        setUsers(data.users);
      } else if (error) {
        console.error("List users error:", error);
        toast.error("Failed to load users: " + error.message);
      }
    } catch (err: any) {
      console.error("List users exception:", err);
      toast.error("Failed to load users: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const banUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete user ${email}?`)) return;
    setActionUserId(id);
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { target_user_id: id }
    });
    if (error) {
      toast.error(`Failed to ban ${email}: ${error.message}`);
    } else {
      toast.success(`${email} deleted successfully`);
      loadUsers();
    }
    setActionUserId(null);
  };

  const filtered = users.filter(u => u.email?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="User Accounts" sub="All registered accounts on the Nexus platform." />
      
      {loading && users.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Filter by email…"
              className="admin-input max-w-xs" />
            <span className="ml-auto text-xs text-zinc-500 tabular-nums">{filtered.length} / {users.length} users</span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-left text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-zinc-800/50 last:border-none hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                          {u.email?.slice(0, 2).toUpperCase() || "??"}
                        </div>
                        <span className="text-zinc-100">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 tabular-nums">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => banUser(u.id, u.email)} disabled={actionUserId === u.id}
                        className="inline-flex items-center gap-1.5 rounded bg-rose-950/30 px-2 py-1 text-[11px] font-medium text-rose-400 hover:bg-rose-900/50 transition-colors disabled:opacity-50">
                        {actionUserId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Ban className="h-3 w-3" />}
                        Ban
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                   <tr>
                     <td colSpan={3} className="px-5 py-8 text-center text-zinc-500">No users found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Shared helpers ────────────────────────────────────────────────────────── */
function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-2">
      <h1 className="text-lg font-semibold text-zinc-50 tracking-tight">{title}</h1>
      <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle, small }: { on: boolean; onToggle: () => void; small?: boolean }) {
  return (
    <button onClick={onToggle}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors ${small ? "h-4 w-7" : "h-5 w-9"} ${on ? "bg-emerald-500" : "bg-zinc-700"}`}>
      <span className={`inline-block rounded-full bg-white shadow transition-transform ${small ? "h-3 w-3" : "h-4 w-4"} ${on ? (small ? "translate-x-3.5" : "translate-x-4") : "translate-x-0.5"}`} />
    </button>
  );
}

/* Inject a global admin-input style (safe for SSR) */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `.admin-input{width:100%;border-radius:.5rem;border:1px solid #3f3f46;background:#18181b;padding:.5rem .75rem;font-size:.875rem;color:#f4f4f5;outline:none;transition:border-color .15s}.admin-input:focus{border-color:#71717a}`;
  document.head.appendChild(style);
}
