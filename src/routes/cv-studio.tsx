import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  LayoutTemplate,
  FolderOpen,
  Bot,
  Settings,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Monitor,
  Smartphone,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/cv-studio")({
  component: CvStudioPage,
});

/* ─── Types ─────────────────────────────────────────────── */
type NavItem = { icon: React.ReactNode; label: string; id: string };
type Step = { id: number; label: string; completed: boolean };

/* ─── Static data ────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { icon: <FileText size={20} />, label: "Builder", id: "builder" },
  { icon: <LayoutTemplate size={20} />, label: "Templates", id: "templates" },
  { icon: <FolderOpen size={20} />, label: "My CVs", id: "mycvs" },
  { icon: <Bot size={20} />, label: "AI Assistant", id: "ai" },
  { icon: <Settings size={20} />, label: "Settings", id: "settings" },
];

const STEPS: Step[] = [
  { id: 1, label: "Personal Information", completed: false },
  { id: 2, label: "Experience", completed: true },
  { id: 3, label: "Education", completed: true },
  { id: 4, label: "Skills", completed: true },
  { id: 5, label: "Choose Template", completed: true },
];

/* ─── Sub-components ─────────────────────────────────────── */

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex w-16 flex-col items-center justify-between border-r border-slate-800 bg-gray-950 py-5">
      {/* Logo */}
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/60">
          <FileText size={17} className="text-white" />
        </div>

        {/* Nav icons */}
        <nav className="mt-6 flex flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                title={item.label}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600/20 text-violet-400 shadow-inner shadow-violet-600/10"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-violet-500" />
                )}
                {item.icon}
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-12 z-50 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro upgrade card */}
      <div className="flex w-12 flex-col items-center gap-2 rounded-xl border border-violet-700/40 bg-violet-950/40 px-1 py-3">
        <Sparkles size={15} className="text-violet-400" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-violet-400 [writing-mode:vertical-rl]">
          Pro
        </span>
        <button className="mt-1 w-8 rounded-lg bg-violet-600 py-1 text-[9px] font-bold text-white shadow shadow-violet-900/50 hover:bg-violet-500 transition-colors">
          ↑
        </button>
      </div>
    </aside>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  span2 = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={
          label === "Full Name"
            ? "Ahmed Ben Khedher"
            : label === "Job Title"
              ? "Full Stack Developer"
              : label === "Email"
                ? "ahmed@example.com"
                : label === "Phone"
                  ? "+216 55 123 456"
                  : label === "Location"
                    ? "Tunis, Tunisia"
                    : label === "LinkedIn"
                      ? "linkedin.com/in/ahmed-bk"
                      : ""
        }
        className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
      />
    </div>
  );
}

function AccordionStep({
  step,
  isOpen,
  onToggle,
  children,
}: {
  step: Step;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${isOpen ? "border-violet-600/40 bg-slate-800/60" : "border-slate-800 bg-slate-900/40"}`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-3">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isOpen ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            {step.id}
          </span>
          <span className={`text-sm font-semibold ${isOpen ? "text-slate-100" : "text-slate-400"}`}>
            {step.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {step.completed && !isOpen && (
            <CheckCircle2 size={15} className="text-emerald-500" />
          )}
          <ChevronDown
            size={15}
            className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-700/50 px-4 pb-4 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function FormPane({ openStep, setOpenStep }: { openStep: number; setOpenStep: (n: number) => void }) {
  return (
    <div className="flex w-[380px] shrink-0 flex-col border-r border-slate-800 bg-gray-900">
      {/* Header */}
      <div className="border-b border-slate-800 px-5 py-5">
        <h1 className="font-display text-base font-bold text-slate-100">Build Your CV</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Complete each section to generate your professional CV
        </p>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {STEPS.map((step) => (
          <AccordionStep
            key={step.id}
            step={step}
            isOpen={openStep === step.id}
            onToggle={() => setOpenStep(openStep === step.id ? 0 : step.id)}
          >
            {step.id === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Full Name" placeholder="John Doe" span2={false} />
                  <InputField label="Job Title" placeholder="Developer" />
                  <InputField label="Email" placeholder="you@example.com" type="email" />
                  <InputField label="Phone" placeholder="+1 234 567 890" type="tel" />
                  <InputField label="Location" placeholder="City, Country" />
                  <InputField label="LinkedIn" placeholder="linkedin.com/in/you" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">
                    Summary
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Passionate full-stack developer with 5+ years of experience building scalable web applications..."
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 resize-none"
                  />
                </div>
                <button className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow shadow-violet-900/40 transition hover:bg-violet-500 active:scale-[0.98]">
                  Save & Continue
                </button>
              </div>
            )}
          </AccordionStep>
        ))}
      </div>

      {/* Progress bar sticky footer */}
      <div className="border-t border-slate-800 bg-gray-900 px-5 py-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">CV Completion</span>
          <span className="font-bold text-violet-400">100%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 shadow shadow-violet-500/40"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── CV Template (A4 mock) ──────────────────────────────── */
function CvTemplate() {
  const skills = ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"];
  const langs = [
    { lang: "Arabic", pct: 100 },
    { lang: "English", pct: 90 },
    { lang: "French", pct: 75 },
  ];
  const experience = [
    {
      role: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      period: "2022 – Present",
      bullets: ["Led a team of 5 engineers to rebuild the core platform", "Reduced API latency by 40% via query optimisation"],
    },
    {
      role: "Full Stack Developer",
      company: "StartupHub",
      period: "2020 – 2022",
      bullets: ["Built microservices architecture from scratch", "Shipped 12 features across web & mobile"],
    },
  ];
  const education = [
    { degree: "M.Sc. Software Engineering", school: "Université de Tunis", year: "2020" },
    { degree: "B.Sc. Computer Science", school: "INSAT", year: "2018" },
  ];

  return (
    <div className="flex h-full w-full shadow-2xl shadow-black/60 rounded-lg overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left dark column */}
      <div className="w-[36%] shrink-0 bg-[#1a1a2e] text-white flex flex-col">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-7 pb-5 px-5 border-b border-white/10">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-900/50">
            AB
          </div>
          <p className="mt-3 text-base font-bold tracking-tight">Ahmed Ben Khedher</p>
          <p className="text-[10px] text-violet-300 mt-0.5 uppercase tracking-widest">Full Stack Developer</p>
        </div>

        {/* Contact */}
        <div className="px-5 pt-5 pb-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-violet-400 font-bold mb-3">Contact</p>
          <div className="space-y-2">
            {[
              { Icon: Mail, text: "ahmed@example.com" },
              { Icon: Phone, text: "+216 55 123 456" },
              { Icon: MapPin, text: "Tunis, Tunisia" },
              { Icon: Linkedin, text: "linkedin.com/in/ahmed-bk" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={10} className="text-violet-400 shrink-0" />
                <span className="text-[10px] text-slate-300 leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-[9px] uppercase tracking-[0.2em] text-violet-400 font-bold mb-3">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="rounded-md bg-violet-900/50 border border-violet-700/40 px-2 py-0.5 text-[9px] text-violet-200">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="px-5 pt-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-violet-400 font-bold mb-3">Languages</p>
          <div className="space-y-2.5">
            {langs.map(({ lang, pct }) => (
              <div key={lang}>
                <div className="flex justify-between text-[9px] text-slate-300 mb-1">
                  <span>{lang}</span>
                  <span className="text-violet-300">{pct}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right white column */}
      <div className="flex-1 bg-white text-slate-800 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-7 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ahmed Ben Khedher</h2>
          <p className="text-sm font-medium text-violet-600 mt-0.5">Full Stack Developer</p>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500 max-w-sm">
            Passionate full-stack developer with 5+ years of experience building scalable web applications and leading cross-functional engineering teams.
          </p>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Experience */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 w-1 rounded-full bg-violet-600" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700">Experience</p>
            </div>
            <div className="space-y-4 pl-3 border-l-2 border-slate-100">
              {experience.map((exp) => (
                <div key={exp.role} className="relative pl-4">
                  <div className="absolute -left-[9px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-violet-500 bg-white" />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">{exp.role}</p>
                      <p className="text-[10px] text-violet-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="shrink-0 text-[9px] text-slate-400 mt-0.5">{exp.period}</span>
                  </div>
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-[10px] text-slate-500">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 w-1 rounded-full bg-violet-600" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-700">Education</p>
            </div>
            <div className="space-y-3 pl-3 border-l-2 border-slate-100">
              {education.map((edu) => (
                <div key={edu.degree} className="relative pl-4">
                  <div className="absolute -left-[9px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-violet-500 bg-white" />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">{edu.degree}</p>
                      <p className="text-[10px] text-slate-500">{edu.school}</p>
                    </div>
                    <span className="shrink-0 text-[9px] text-slate-400 mt-0.5">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewPane({ device, setDevice }: { device: "desktop" | "mobile"; setDevice: (d: "desktop" | "mobile") => void }) {
  return (
    <div className="flex flex-1 flex-col bg-[#080810]">
      {/* Action bar */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 p-1">
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${device === "desktop" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Monitor size={13} /> Desktop
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${device === "mobile" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Smartphone size={13} /> Mobile
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-violet-600/50 hover:text-white">
            <Eye size={13} /> Preview
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-violet-900/50 transition hover:bg-violet-500 active:scale-[0.98]">
            <Download size={13} /> Export as PDF
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex flex-1 items-start justify-center overflow-auto p-8 pt-10">
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #a78bfa 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className={`relative transition-all duration-500 ${device === "mobile" ? "w-[340px]" : "w-[680px]"}`}
          style={{ height: device === "mobile" ? "520px" : "900px" }}
        >
          {/* Paper shadow glow */}
          <div className="absolute inset-0 rounded-lg opacity-30 blur-2xl"
            style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)" }} />
          <div className="relative h-full w-full overflow-hidden rounded-lg" style={{ transform: device === "mobile" ? "scale(0.9)" : "scale(1)", transformOrigin: "top center" }}>
            <CvTemplate />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page root ──────────────────────────────────────────── */
function CvStudioPage() {
  const [activeNav] = useState("builder");
  const [openStep, setOpenStep] = useState(1);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 font-sans">
      {/* Back link — floated over sidebar */}
      <div className="absolute left-[72px] top-3 z-20">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 rounded-lg bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur transition hover:text-slate-200"
        >
          <ArrowLeft size={11} /> Dashboard
        </Link>
      </div>

      <Sidebar active={activeNav} />
      <FormPane openStep={openStep} setOpenStep={setOpenStep} />
      <PreviewPane device={device} setDevice={setDevice} />
    </div>
  );
}
