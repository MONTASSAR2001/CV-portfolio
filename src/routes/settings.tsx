import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import {
  User, Lock, Mail, ArrowLeft, Loader2,
  CheckCircle2, Eye, EyeOff, ShieldCheck, Send,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw redirect({ to: "/login" });
    }
  },
  component: SettingsPage,
});

/* ─── Section wrapper ───────────────────────────────────────────────────── */
function Section({
  icon: Icon,
  title,
  subtitle,
  children,
  hue = "300",
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  hue?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong rounded-3xl p-8"
    >
      <div className="mb-6 flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `oklch(0.75 0.22 ${hue} / 0.12)`,
            border: `1px solid oklch(0.75 0.22 ${hue} / 0.25)`,
          }}
        >
          <Icon size={18} style={{ color: `oklch(0.85 0.2 ${hue})` }} />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Input ─────────────────────────────────────────────────────────────── */
function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  hint,
  suffix,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-white/25 focus:ring-1 focus:ring-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ── Password form state ───────────────────────────────────────────────
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdDone, setPwdDone] = useState(false);

  // ── Email update state ────────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailDone, setEmailDone] = useState(false);

  // ── Auth guard ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  // ── Change password ───────────────────────────────────────────────────
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdDone(false);

    if (newPass.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Passwords do not match.");
      return;
    }

    setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setPwdLoading(false);

    if (error) {
      toast.error(`Password update failed: ${error.message}`);
    } else {
      toast.success("Password updated successfully!");
      setPwdDone(true);
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => setPwdDone(false), 4000);
    }
  };

  // ── Update email ──────────────────────────────────────────────────────
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newEmail === user.email) {
      toast.error("Please enter a different email address.");
      return;
    }
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailLoading(false);

    if (error) {
      toast.error(`Email update failed: ${error.message}`);
    } else {
      toast.success("Confirmation email sent! Check your new inbox to verify the change.");
      setEmailDone(true);
      setNewEmail("");
      setTimeout(() => setEmailDone(false), 6000);
    }
  };

  // Derive display info
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[-5%] h-[500px] w-[500px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.22 275 / 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] h-[350px] w-[350px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.24 300 / 0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Nav ── */}
      <header className="relative z-10 border-b border-white/5">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Link
            to="/dashboard"
            id="settings-back"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs text-muted-foreground">Settings</span>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-14 space-y-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2"
        >
          <span
            className="rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground"
            style={{ borderColor: "oklch(0.75 0.22 275 / 0.35)" }}
          >
            Account · Settings
          </span>
          <h1
            className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.95 0.05 275), oklch(0.72 0.22 275))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Account
          </h1>
        </motion.div>

        {/* ── Section 1: Account Info ── */}
        <Section
          icon={User}
          title="Account Information"
          subtitle="Your identity on CareerOS."
          hue="275"
        >
          <div className="space-y-4">
            <InputField
              label="Current email"
              id="settings-email"
              type="email"
              value={user.email ?? ""}
              disabled
              hint="This is your current verified email address."
              suffix={
                <Mail size={15} className="text-muted-foreground/60" />
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Member since
                </p>
                <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground/80">
                  {createdAt}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Last sign-in
                </p>
                <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground/80">
                  {lastSignIn}
                </p>
              </div>
            </div>

            {/* Auth provider badge */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span className="text-sm text-muted-foreground">
                Auth provider:{" "}
                <span className="font-semibold text-foreground">
                  {user.app_metadata?.provider === "email" || !user.app_metadata?.provider
                    ? "Email / Password"
                    : user.app_metadata.provider}
                </span>
              </span>
            </div>
          </div>
        </Section>

        {/* ── Section 2: Update Email ── */}
        <Section
          icon={Mail}
          title="Update Email"
          subtitle="A confirmation link will be sent to your new address before the change takes effect."
          hue="210"
        >
          <form
            id="settings-email-form"
            onSubmit={handleEmailChange}
            className="space-y-4"
            noValidate
          >
            <InputField
              label="New email address"
              id="settings-new-email"
              type="email"
              value={newEmail}
              onChange={setNewEmail}
              placeholder="new@example.com"
              suffix={
                <Mail size={15} className="text-muted-foreground/60" />
              }
            />
            <button
              id="settings-update-email"
              type="submit"
              disabled={emailLoading || emailDone || !newEmail.trim()}
              className="btn-kinetic glow-pulse relative mt-2 w-full rounded-2xl py-3.5 font-display text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                // Override gradient to use the 210 hue for this section
                background: emailDone
                  ? "oklch(0.75 0.2 150 / 0.15)"
                  : undefined,
              }}
            >
              <span className="btn-kinetic-sweep" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {emailLoading ? (
                  <><Loader2 size={15} className="animate-spin" />Sending verification…</>
                ) : emailDone ? (
                  <><CheckCircle2 size={15} />Verification sent!</>
                ) : (
                  <><Send size={15} />Send verification email</>
                )}
              </span>
            </button>
          </form>
        </Section>

        {/* ── Section 2: Change Password ── */}
        <Section
          icon={Lock}
          title="Change Password"
          subtitle="Choose a strong password. Min. 8 characters."
          hue="300"
        >
          <form
            id="settings-password-form"
            onSubmit={handlePasswordChange}
            className="space-y-4"
            noValidate
          >
            <InputField
              label="New password"
              id="settings-new-password"
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={setNewPass}
              placeholder="Min. 8 characters"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="text-muted-foreground/60 transition hover:text-muted-foreground"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <InputField
              label="Confirm new password"
              id="settings-confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={setConfirmPass}
              placeholder="Repeat new password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="text-muted-foreground/60 transition hover:text-muted-foreground"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            {/* Password strength indicator */}
            {newPass.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[8, 12, 16].map((threshold, i) => (
                    <div
                      key={threshold}
                      className="h-1 flex-1 rounded-full transition-all duration-500"
                      style={{
                        background:
                          newPass.length >= threshold
                            ? i === 0
                              ? "oklch(0.75 0.2 150)"
                              : i === 1
                              ? "oklch(0.85 0.18 210)"
                              : "oklch(0.72 0.24 300)"
                            : "oklch(1 0 0 / 0.08)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {newPass.length < 8
                    ? "Too short"
                    : newPass.length < 12
                    ? "Fair — try adding more characters"
                    : newPass.length < 16
                    ? "Good"
                    : "Strong ✓"}
                </p>
              </div>
            )}

            <button
              id="settings-save-password"
              type="submit"
              disabled={pwdLoading || pwdDone || newPass.length === 0}
              className="btn-kinetic glow-pulse relative mt-2 w-full rounded-2xl py-3.5 font-display text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="btn-kinetic-sweep" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {pwdLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Updating…
                  </>
                ) : pwdDone ? (
                  <>
                    <CheckCircle2 size={15} />
                    Password updated!
                  </>
                ) : (
                  "Update password"
                )}
              </span>
            </button>
          </form>
        </Section>

        {/* ── Section 3: Danger Zone ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8"
        >
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10">
              <ShieldCheck size={18} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Danger Zone
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Irreversible actions. Proceed with caution.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-red-500/15 bg-red-500/5 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Delete account</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              id="settings-delete-account"
              onClick={async () => {
                if (!confirm("Are you absolutely sure you want to permanently delete your account and all associated data? This action cannot be undone.")) return;
                
                toast.loading("Deleting account...");
                const { error } = await supabase.functions.invoke('delete-user', {
                  body: { target_user_id: user.id }
                });
                
                if (error) {
                  toast.dismiss();
                  toast.error(`Failed to delete account: ${error.message}`);
                } else {
                  toast.dismiss();
                  await supabase.auth.signOut();
                  navigate({ to: "/" });
                }
              }}
              className="ml-4 shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 active:scale-95"
            >
              Delete account
            </button>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground/60">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
