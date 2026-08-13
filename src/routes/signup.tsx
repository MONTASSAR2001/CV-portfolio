import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
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
    setNotice(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    const { data, error: authError } = await signUp(email, password);

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    // If email confirmation is required, Supabase returns a user but no session
    if (data.session) {
      navigate({ to: "/dashboard" });
    } else {
      setNotice(
        "Almost there! Check your inbox for a confirmation email to activate your account."
      );
      setIsSubmitting(false);
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
            Craft your ultimate CV
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Confirmation notice */}
          {notice ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center"
            >
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center border-2 border-black bg-white"
              >
                <span className="text-xl">✉️</span>
              </div>
              <p className="text-sm font-medium text-black leading-relaxed">{notice}</p>
              <Link
                to="/login"
                className="inline-block text-[10px] font-bold uppercase tracking-widest text-black hover:underline"
              >
                Go to login →
              </Link>
            </motion.div>
          ) : (
            <form
              id="signup-form"
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
                  htmlFor="signup-email"
                  className="block text-[10px] font-bold uppercase tracking-widest text-black"
                >
                  Email
                </label>
                <input
                  id="signup-email"
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
                <label
                  htmlFor="signup-password"
                  className="block text-[10px] font-bold uppercase tracking-widest text-black"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-none border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label
                  htmlFor="signup-confirm"
                  className="block text-[10px] font-bold uppercase tracking-widest text-black"
                >
                  Confirm password
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-none border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Submit */}
              <button
                id="signup-submit"
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center rounded-none bg-black px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          {!notice && (
            <p className="mt-8 text-center text-[11px] text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-black underline-offset-2 hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
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
