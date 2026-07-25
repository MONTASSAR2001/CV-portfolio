import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { createCheckoutSession } from "@/lib/server-fns";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    
    setLoading(true);
    try {
      const url = await createCheckoutSession({ 
        data: { 
          accessToken: session.access_token, 
          returnUrl: window.location.origin + "/dashboard" 
        } 
      });
      if (url) {
        window.location.href = url;
      }
    } catch (e) {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-24">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that best fits your career goals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-xl backdrop-blur-xl"
          >
            <div className="mb-6">
              <h3 className="font-display text-2xl font-semibold text-white">Free</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-white">$0</span>
                <span className="text-sm font-semibold text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Perfect for getting started and building your digital presence.
              </p>
            </div>
            
            <ul className="mb-8 flex-1 space-y-4">
              {["Basic PDF parsing", "3 standard templates", "Standard CareerOS URL", "Manual dashboard updates"].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                  <Check size={16} className="text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/cv-studio"
              className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="absolute -top-4 left-0 right-0 mx-auto flex w-32 items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-950 shadow-lg shadow-emerald-500/20">
              <Sparkles size={12} /> Most Popular
            </div>

            <div className="mb-6">
              <h3 className="font-display text-2xl font-semibold text-white">Pro</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-white">$12</span>
                <span className="text-sm font-semibold text-muted-foreground">/ month</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Everything you need to stand out with AI-powered, premium 3D designs.
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              {[
                "AI Mixo Portfolio Generation",
                "All 10+ Premium & 3D templates",
                "Polywork live timeline features",
                "Custom domain support (coming soon)",
                "Priority email support"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-white">
                  <div className="rounded-full bg-emerald-500/10 p-0.5 text-emerald-400">
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-70"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="relative z-10 flex items-center gap-2">
                {loading ? "Preparing..." : "Upgrade to Pro"} <ArrowRight size={16} />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
