import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Plus, Trash2, X, User, Briefcase, GraduationCap, Zap } from "lucide-react";
import type { CvState, PersonalInfo, Experience, Education } from "./types";

interface CVFormPanelProps {
  cvData: CvState;
  setCvData: React.Dispatch<React.SetStateAction<CvState>>;
}

/* ─── Styled field primitives ────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
      />
    </div>
  );
}

/* ─── Section tab button ─────────────────────────────────────────────────── */
const TABS = [
  { id: 0, label: "Personal",   icon: User },
  { id: 1, label: "Experience", icon: Briefcase },
  { id: 2, label: "Education",  icon: GraduationCap },
  { id: 3, label: "Skills",     icon: Zap },
] as const;

/* ─── Main component ─────────────────────────────────────────────────────── */
export function CVFormPanel({ cvData, setCvData }: CVFormPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [skillInput, setSkillInput] = useState("");

  const info = cvData.personalInfo;
  const setInfo = (field: keyof PersonalInfo, v: string) =>
    setCvData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: v } }));

  const addExp = () => setCvData(p => ({ ...p, experience: [...p.experience, { id: Date.now().toString(), role: "", company: "", period: "", bullets: "" }] }));
  const setExp = (id: string, field: keyof Experience, v: string) => setCvData(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [field]: v } : e) }));
  const delExp = (id: string) => setCvData(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));

  const addEdu = () => setCvData(p => ({ ...p, education: [...p.education, { id: Date.now().toString(), degree: "", school: "", year: "" }] }));
  const setEdu = (id: string, field: keyof Education, v: string) => setCvData(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [field]: v } : e) }));
  const delEdu = (id: string) => setCvData(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!cvData.skills.includes(skillInput.trim())) setCvData(p => ({ ...p, skills: [...p.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };
  const delSkill = (s: string) => setCvData(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const completedTabs = [
    !!(info.fullName && info.jobTitle),
    cvData.experience.length > 0,
    cvData.education.length > 0,
    cvData.skills.length > 0,
  ];
  const totalDone = completedTabs.filter(Boolean).length;
  const pct = Math.round((totalDone / 4) * 100);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 backdrop-blur-xl">
      {/* ── Tab bar ── */}
      <div className="border-b border-gray-200 px-4 pt-4 pb-0">
        <div className="flex gap-0.5">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const done = completedTabs[tab.id];
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex flex-1 flex-col items-center gap-1 rounded-t-xl px-2 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${active ? "bg-white text-black border-t border-l border-r border-gray-200" : "text-gray-500 hover:text-black"}`}
              >
                {active && <motion.div layoutId="tab-indicator" className="absolute top-0 left-0 right-0 h-0.5 rounded-t-full bg-black" />}
                <div className="relative">
                  <Icon size={15} />
                  {done && !active && <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-black" />}
                </div>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "thin", scrollbarColor: "oklch(1 0 0 / 0.1) transparent" }}>
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div key="personal" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name" value={info.fullName} onChange={v => setInfo("fullName", v)} placeholder="Jane Smith" />
                <Field label="Job Title" value={info.jobTitle} onChange={v => setInfo("jobTitle", v)} placeholder="Software Engineer" />
                <Field label="Email" value={info.email} onChange={v => setInfo("email", v)} placeholder="jane@example.com" type="email" />
                <Field label="Phone" value={info.phone} onChange={v => setInfo("phone", v)} placeholder="+1 234 567 890" type="tel" />
                <Field label="Location" value={info.location} onChange={v => setInfo("location", v)} placeholder="City, Country" />
                <Field label="LinkedIn" value={info.linkedin} onChange={v => setInfo("linkedin", v)} placeholder="linkedin.com/in/jane" />
                <Field label="GitHub URL" value={info.github || ""} onChange={v => setInfo("github", v)} placeholder="github.com/jane" />
                <Field label="Portfolio URL" value={info.portfolioUrl || ""} onChange={v => setInfo("portfolioUrl", v)} placeholder="mysite.com or https://…" />
              </div>
              <TextArea label="Professional Summary" value={info.summary} onChange={v => setInfo("summary", v)} rows={4} placeholder="Brief professional bio…" />
              <button onClick={() => setActiveTab(1)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-[0.98]">
                Next: Experience <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div key="experience" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }} className="space-y-4">
              {cvData.experience.map((exp, i) => (
                <div key={exp.id} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black">Role {i + 1}</span>
                    <button onClick={() => delExp(exp.id)} className="rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Role" value={exp.role} onChange={v => setExp(exp.id, "role", v)} placeholder="Software Engineer" />
                    <Field label="Company" value={exp.company} onChange={v => setExp(exp.id, "company", v)} placeholder="Acme Inc." />
                  </div>
                  <Field label="Dates" value={exp.period} onChange={v => setExp(exp.id, "period", v)} placeholder="2022 – Present" />
                  <TextArea label="Bullet points (one per line)" value={exp.bullets} onChange={v => setExp(exp.id, "bullets", v)} rows={3} placeholder="Led team of 5 engineers…" />
                </div>
              ))}
              <button onClick={addExp} className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-black transition">
                <Plus size={14} /> Add Experience
              </button>
              <button onClick={() => setActiveTab(2)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-[0.98]">
                Next: Education <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div key="education" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }} className="space-y-4">
              {cvData.education.map((edu, i) => (
                <div key={edu.id} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black">Degree {i + 1}</span>
                    <button onClick={() => delEdu(edu.id)} className="rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
                  </div>
                  <Field label="Degree" value={edu.degree} onChange={v => setEdu(edu.id, "degree", v)} placeholder="B.Sc. Computer Science" />
                  <Field label="Institution" value={edu.school} onChange={v => setEdu(edu.id, "school", v)} placeholder="University Name" />
                  <Field label="Year" value={edu.year} onChange={v => setEdu(edu.id, "year", v)} placeholder="2018 – 2022" />
                </div>
              ))}
              <button onClick={addEdu} className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-black transition">
                <Plus size={14} /> Add Education
              </button>
              <button onClick={() => setActiveTab(3)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-[0.98]">
                Next: Skills <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div key="skills" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Add Skill</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter…"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map(s => (
                  <motion.span key={s} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-bold text-black">
                    {s}
                    <button onClick={() => delSkill(s)} className="ml-0.5 text-gray-500 hover:text-black transition"><X size={11} /></button>
                  </motion.span>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <TextArea label="Additional Information (Languages, Certifications, etc.)" value={cvData.additionalInfo || ""} onChange={v => setCvData(p => ({ ...p, additionalInfo: v }))} rows={4} placeholder="Fluent in English and Spanish. AWS Certified Solutions Architect..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress footer ── */}
      <div className="border-t border-gray-200 px-5 py-4 bg-white">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-bold">CV Completion</span>
          <span className="font-bold text-black">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div className="h-full rounded-full bg-black" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>
    </div>
  );
}
