import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

type Status = "idle" | "loading" | "success" | "error";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      // After clicking the link in the email, Supabase redirects here.
      // The user lands on /login where they can enter a new password
      // (or you can later add a /reset-password route for the update flow).
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/login`,
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* ── Background orbs ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.18 210 / 0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.24 275 / 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md px-4"
      >
        {/* ── Logo ── */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative h-10 w-10">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.72 0.24 300), oklch(0.85 0.18 210), oklch(0.72 0.24 300))",
              }}
            />
            <div className="absolute inset-[2px] rounded-[10px] bg-background/80 grid place-items-center font-display text-base font-bold text-gradient">
              N
            </div>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Reset your password
          </span>
          <p className="text-sm text-muted-foreground">
            We'll send a secure link to your inbox
          </p>
        </div>

        {/* ── Card ── */}
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-5 text-center"
              >
                {/* Animated check */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "oklch(0.75 0.2 150 / 0.15)",
                    border: "1px solid oklch(0.75 0.2 150 / 0.4)",
                    boxShadow: "0 0 40px oklch(0.75 0.2 150 / 0.3)",
                  }}
                >
                  <CheckCircle2
                    size={30}
                    style={{ color: "oklch(0.8 0.2 150)" }}
                  />
                </motion.div>

                <div className="space-y-1.5">
                  <p className="text-base font-semibold text-foreground">
                    Check your inbox
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If an account exists for{" "}
                    <span className="font-medium text-foreground">{email}</span>
                    , a reset link has been sent. It expires in 60 minutes.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-2 hover:underline"
                >
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.form
                key="form"
                id="forgot-password-form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Error banner */}
                <AnimatePresence>
                  {status === "error" && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                      role="alert"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-white/25 focus:ring-1 focus:ring-white/15"
                    />
                    <Mail
                      size={14}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="forgot-password-submit"
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="btn-kinetic glow-pulse relative mt-2 w-full rounded-2xl py-3.5 font-display text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="btn-kinetic-sweep" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending reset link…
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </span>
                </button>

                {/* Footer link */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-foreground underline-offset-2 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* ── Back to home ── */}
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
