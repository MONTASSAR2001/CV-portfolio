import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Infinity as InfinityIcon, AlertCircle, Loader2, ShieldX } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: AdminLoginPage,
});

/* ── God-Mode master email ───────────────────────────────────────────────── */
const MASTER_EMAIL = import.meta.env.VITE_MASTER_ADMIN_EMAIL as string | undefined;

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── If already authenticated & authorised, skip to dashboard ── */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;

      if (MASTER_EMAIL && session.user.email !== MASTER_EMAIL) {
        // Somebody else's session lingering — purge it silently
        await supabase.auth.signOut();
        setError("God-Mode Access Denied: this account is not authorised.");
        return;
      }
      navigate({ to: "/" });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    /* ── God-Mode email check ─────────────────────────────────────────── */
    if (MASTER_EMAIL && data.user?.email !== MASTER_EMAIL) {
      await supabase.auth.signOut();
      setError("☠  God-Mode Access Denied. This panel is restricted to the master administrator.");
      setIsSubmitting(false);
      return;
    }

    navigate({ to: "/" });
  };

  return (
    <div className="dark min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* ── Ambient glows ── */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-20 blur-[140px]"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.16 250), transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full opacity-10 blur-[120px]"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 10), transparent 65%)" }}
        aria-hidden="true"
      />

      {/* ── Dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo block */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700/60 bg-gradient-to-br from-zinc-100 to-zinc-400 shadow-[0_0_50px_rgba(255,255,255,0.12)]">
            <InfinityIcon className="h-7 w-7 text-zinc-950" strokeWidth={2.5} />
            {/* God-Mode badge */}
            <span className="absolute -right-2 -top-2 rounded-full border border-red-900/60 bg-red-950 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.4)]">
              GOD
            </span>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-1">
              CareerOS · God Mode
            </p>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
              Master Control Panel
            </h1>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-8 shadow-[0_32px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <form
            id="admin-login-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-rose-900/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-300"
              >
                <ShieldX className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500"
              >
                Master email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceo@infinitybugs.io"
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50"
              />
            </div>

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.08)] transition hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Verifying identity…" : "Enter God Mode"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          Restricted to authorised master account only. All access attempts are logged.
        </p>
      </div>
    </div>
  );
}
