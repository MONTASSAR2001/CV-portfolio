import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Infinity as InfinityIcon, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="dark min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.16 250), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full opacity-10 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.2 280), transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo block */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700/60 bg-gradient-to-br from-zinc-100 to-zinc-400 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
            <InfinityIcon className="h-6 w-6 text-zinc-950" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mb-1">
              Infinity Bugs · Super Admin
            </p>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
              Restricted Access
            </h1>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl">
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
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500"
              >
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@infinitybugs.io"
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
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Authenticating…" : "Sign in to Admin"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-zinc-700">
          Admin accounts are provisioned manually. No public registration.
        </p>
      </div>
    </div>
  );
}
