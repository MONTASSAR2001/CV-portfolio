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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm px-4"
      >
        {/* Logo / Header */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white">
            <span className="font-display text-lg font-bold text-black tracking-widest">
              CV
            </span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-black">
            CareerOS
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Sign in to your document
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
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
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-[10px] font-bold uppercase tracking-widest text-black"
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
                className="w-full rounded-none border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-[10px] font-bold uppercase tracking-widest text-black"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                >
                  Forgot?
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
                className="w-full rounded-none border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center rounded-none bg-black px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-black underline-offset-2 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
