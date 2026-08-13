import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  if (loading) return null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative h-10 w-10">
            <div
              className="absolute inset-0 rounded-xl"
              style={{ background: "conic-gradient(from 0deg, #D4AF37, #C5A059, #D4AF37)" }}
            />
            <div className="absolute inset-[2px] rounded-[10px] bg-white grid place-items-center font-display text-base font-bold text-[#D4AF37]">
              N
            </div>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Welcome back to CareerOS
          </span>
          <p className="text-sm text-muted-foreground">
            Sign in to continue building your career
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground transition hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#D4AF37] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#C5A059] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="relative z-10">{isSubmitting ? "Signing in..." : "Sign in"}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-foreground underline-offset-2 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-muted-foreground transition hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
