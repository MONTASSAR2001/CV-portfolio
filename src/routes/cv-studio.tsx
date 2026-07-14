import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, forwardRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useReactToPrint } from "react-to-print";
import {
  FileText, LayoutTemplate, FolderOpen, Bot, Settings, Sparkles,
  ChevronDown, CheckCircle2, Monitor, Smartphone, Eye, Download,
  Mail, Phone, MapPin, Linkedin, ArrowLeft, Plus, Trash2, X,
  Cloud, Loader2,
} from "lucide-react";
import {
  MinimalistTemplate,
  CorporateTemplate,
  TechTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  StartupTemplate,
  AcademicTemplate,
  EditorialTemplate,
  DarkBoldTemplate,
  VisualTemplate,
} from "@/components/cv-templates";

export const Route = createFileRoute("/cv-studio")({
  component: CvStudioPage,
});

/* ─── Types ─────────────────────────────────────────────── */
type NavItem = { icon: React.ReactNode; label: string; id: string };

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  year: string;
};

export type CvState = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
};

/* ─── Static Data ────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { icon: <FileText size={20} />, label: "Builder", id: "builder" },
  { icon: <LayoutTemplate size={20} />, label: "Templates", id: "templates" },
  { icon: <FolderOpen size={20} />, label: "My CVs", id: "mycvs" },
  { icon: <Bot size={20} />, label: "AI Assistant", id: "ai" },
  { icon: <Settings size={20} />, label: "Settings", id: "settings" },
];

const initialState: CvState = {
  personalInfo: {
    fullName: "Ahmed Ben Khedher",
    jobTitle: "Full Stack Developer",
    email: "ahmed@example.com",
    phone: "+216 55 123 456",
    location: "Tunis, Tunisia",
    linkedin: "linkedin.com/in/ahmed-bk",
    summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications and leading cross-functional engineering teams.",
  },
  experience: [
    {
      id: "1",
      role: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      period: "2022 – Present",
      bullets: "Led a team of 5 engineers to rebuild the core platform\nReduced API latency by 40% via query optimisation",
    },
    {
      id: "2",
      role: "Full Stack Developer",
      company: "StartupHub",
      period: "2020 – 2022",
      bullets: "Built microservices architecture from scratch\nShipped 12 features across web & mobile",
    }
  ],
  education: [
    { id: "1", degree: "M.Sc. Software Engineering", school: "Université de Tunis", year: "2020" },
    { id: "2", degree: "B.Sc. Computer Science", school: "INSAT", year: "2018" },
  ],
  skills: ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
};

/* ─── Sub-components ─────────────────────────────────────── */

function Sidebar({ active }: { active: string }) {
  return (
    <aside className="flex w-16 flex-col items-center justify-between border-r border-slate-800 bg-gray-950 py-5">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/60">
          <FileText size={17} className="text-white" />
        </div>
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
                {isActive && <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-violet-500" />}
                {item.icon}
                <span className="pointer-events-none absolute left-12 z-50 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex w-12 flex-col items-center gap-2 rounded-xl border border-violet-700/40 bg-violet-950/40 px-1 py-3">
        <Sparkles size={15} className="text-violet-400" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-violet-400 [writing-mode:vertical-rl]">Pro</span>
        <button className="mt-1 w-8 rounded-lg bg-violet-600 py-1 text-[9px] font-bold text-white shadow shadow-violet-900/50 hover:bg-violet-500 transition-colors">↑</button>
      </div>
    </aside>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", span2 = false }: any) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
      />
    </div>
  );
}

function AccordionStep({ stepId, label, completed, isOpen, onToggle, children }: any) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${isOpen ? "border-violet-600/40 bg-slate-800/60" : "border-slate-800 bg-slate-900/40"}`}>
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isOpen ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            {stepId}
          </span>
          <span className={`text-sm font-semibold ${isOpen ? "text-slate-100" : "text-slate-400"}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {completed && !isOpen && <CheckCircle2 size={15} className="text-emerald-500" />}
          <ChevronDown size={15} className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      {isOpen && <div className="border-t border-slate-700/50 px-4 pb-4 pt-4">{children}</div>}
    </div>
  );
}

function FormPane({ openStep, setOpenStep, cvData, setCvData }: { openStep: number, setOpenStep: (n: number) => void, cvData: CvState, setCvData: React.Dispatch<React.SetStateAction<CvState>> }) {
  
  const updateInfo = (field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateExp = (id: string, field: keyof Experience, value: string) => {
    setCvData(prev => ({ ...prev, experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) }));
  };
  const addExp = () => setCvData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), role: "", company: "", period: "", bullets: "" }] }));
  const removeExp = (id: string) => setCvData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));

  const updateEdu = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({ ...prev, education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) }));
  };
  const addEdu = () => setCvData(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), degree: "", school: "", year: "" }] }));
  const removeEdu = (id: string) => setCvData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));

  const [skillInput, setSkillInput] = useState("");
  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!cvData.skills.includes(skillInput.trim())) {
        setCvData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      }
      setSkillInput("");
    }
  };
  const removeSkill = (skill: string) => setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  // Steps completion logic
  const isInfoDone = !!(cvData.personalInfo.fullName && cvData.personalInfo.jobTitle);
  const isExpDone = cvData.experience.length > 0;
  const isEduDone = cvData.education.length > 0;
  const isSkillsDone = cvData.skills.length > 0;

  const totalSteps = 4;
  const completedCount = [isInfoDone, isExpDone, isEduDone, isSkillsDone].filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="flex w-[380px] shrink-0 flex-col border-r border-slate-800 bg-gray-900">
      <div className="border-b border-slate-800 px-5 py-5">
        <h1 className="font-display text-base font-bold text-slate-100">Build Your CV</h1>
        <p className="mt-0.5 text-xs text-slate-500">Complete each section to generate your professional CV</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {/* Step 1: Personal Info */}
        <AccordionStep stepId={1} label="Personal Information" completed={isInfoDone} isOpen={openStep === 1} onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Full Name" value={cvData.personalInfo.fullName} onChange={(e: any) => updateInfo("fullName", e.target.value)} placeholder="John Doe" />
              <InputField label="Job Title" value={cvData.personalInfo.jobTitle} onChange={(e: any) => updateInfo("jobTitle", e.target.value)} placeholder="Developer" />
              <InputField label="Email" value={cvData.personalInfo.email} onChange={(e: any) => updateInfo("email", e.target.value)} placeholder="you@example.com" type="email" />
              <InputField label="Phone" value={cvData.personalInfo.phone} onChange={(e: any) => updateInfo("phone", e.target.value)} placeholder="+1 234 567 890" type="tel" />
              <InputField label="Location" value={cvData.personalInfo.location} onChange={(e: any) => updateInfo("location", e.target.value)} placeholder="City, Country" />
              <InputField label="LinkedIn" value={cvData.personalInfo.linkedin} onChange={(e: any) => updateInfo("linkedin", e.target.value)} placeholder="linkedin.com/in/you" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">Summary</label>
              <textarea
                value={cvData.personalInfo.summary}
                onChange={(e) => updateInfo("summary", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 resize-none"
              />
            </div>
            <button onClick={() => setOpenStep(2)} className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow shadow-violet-900/40 transition hover:bg-violet-500 active:scale-[0.98]">
              Save & Continue
            </button>
          </div>
        </AccordionStep>

        {/* Step 2: Experience */}
        <AccordionStep stepId={2} label="Experience" completed={isExpDone} isOpen={openStep === 2} onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}>
          <div className="space-y-4">
            {cvData.experience.map((exp, i) => (
              <div key={exp.id} className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-violet-400 tracking-widest">Role {i + 1}</span>
                  <button onClick={() => removeExp(exp.id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 size={13}/></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Role" value={exp.role} onChange={(e: any) => updateExp(exp.id, "role", e.target.value)} placeholder="Software Engineer" />
                  <InputField label="Company" value={exp.company} onChange={(e: any) => updateExp(exp.id, "company", e.target.value)} placeholder="Acme Corp" />
                </div>
                <InputField label="Dates" value={exp.period} onChange={(e: any) => updateExp(exp.id, "period", e.target.value)} placeholder="2020 - Present" />
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">Description (Newlines for bullets)</label>
                  <textarea
                    value={exp.bullets}
                    onChange={(e) => updateExp(exp.id, "bullets", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 resize-none"
                  />
                </div>
              </div>
            ))}
            <button onClick={addExp} className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-violet-500/40 text-violet-400 rounded-lg text-xs font-semibold hover:bg-violet-500/10 transition">
              <Plus size={14} /> Add Experience
            </button>
            <button onClick={() => setOpenStep(3)} className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow shadow-violet-900/40 transition hover:bg-violet-500 active:scale-[0.98]">
              Save & Continue
            </button>
          </div>
        </AccordionStep>

        {/* Step 3: Education */}
        <AccordionStep stepId={3} label="Education" completed={isEduDone} isOpen={openStep === 3} onToggle={() => setOpenStep(openStep === 3 ? 0 : 3)}>
          <div className="space-y-4">
            {cvData.education.map((edu, i) => (
              <div key={edu.id} className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-violet-400 tracking-widest">Degree {i + 1}</span>
                  <button onClick={() => removeEdu(edu.id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 size={13}/></button>
                </div>
                <InputField label="Degree" value={edu.degree} onChange={(e: any) => updateEdu(edu.id, "degree", e.target.value)} placeholder="B.Sc. Computer Science" />
                <InputField label="Institution" value={edu.school} onChange={(e: any) => updateEdu(edu.id, "school", e.target.value)} placeholder="University Name" />
                <InputField label="Year" value={edu.year} onChange={(e: any) => updateEdu(edu.id, "year", e.target.value)} placeholder="2018 - 2022" />
              </div>
            ))}
            <button onClick={addEdu} className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-violet-500/40 text-violet-400 rounded-lg text-xs font-semibold hover:bg-violet-500/10 transition">
              <Plus size={14} /> Add Education
            </button>
            <button onClick={() => setOpenStep(4)} className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow shadow-violet-900/40 transition hover:bg-violet-500 active:scale-[0.98]">
              Save & Continue
            </button>
          </div>
        </AccordionStep>

        {/* Step 4: Skills */}
        <AccordionStep stepId={4} label="Skills" completed={isSkillsDone} isOpen={openStep === 4} onToggle={() => setOpenStep(openStep === 4 ? 0 : 4)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-slate-500">Add Skill</label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type skill & press Enter..."
                className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1 rounded-md bg-violet-900/40 border border-violet-500/30 px-2 py-1 text-xs text-violet-200">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-violet-400 hover:text-white transition"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
        </AccordionStep>
      </div>

      {/* Progress Footer */}
      <div className="border-t border-slate-800 bg-gray-900 px-5 py-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">CV Completion</span>
          <span className="font-bold text-violet-400">{progressPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 shadow shadow-violet-500/40 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── CV Template (A4 format) ────────────────────────────── */
const CvTemplate = forwardRef<HTMLDivElement, { data: CvState }>(({ data }, ref) => {
  return (
    <div ref={ref} className="cv-print-wrapper flex h-full w-full bg-white text-slate-800 shadow-2xl shadow-black/60 rounded-lg overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .cv-print-wrapper { 
            width: 210mm !important; 
            height: 297mm !important; 
            box-shadow: none !important; 
            transform: none !important; 
            margin: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
      
      {/* Left dark column */}
      <div className="w-[36%] shrink-0 bg-[#1a1a2e] text-white flex flex-col">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-8 pb-6 px-5 border-b border-white/10">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-violet-900/50">
            {data.personalInfo.fullName ? data.personalInfo.fullName.substring(0, 2).toUpperCase() : "CV"}
          </div>
          <p className="mt-4 text-lg font-bold tracking-tight text-center leading-tight">{data.personalInfo.fullName || "Your Name"}</p>
          <p className="text-[11px] text-violet-300 mt-1 uppercase tracking-widest text-center">{data.personalInfo.jobTitle || "Your Title"}</p>
        </div>

        {/* Contact */}
        <div className="px-6 pt-6 pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400 font-bold mb-4">Contact</p>
          <div className="space-y-3">
            {data.personalInfo.email && (
              <div className="flex items-center gap-3">
                <Mail size={12} className="text-violet-400 shrink-0" />
                <span className="text-[11px] text-slate-300 truncate">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone size={12} className="text-violet-400 shrink-0" />
                <span className="text-[11px] text-slate-300 truncate">{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-3">
                <MapPin size={12} className="text-violet-400 shrink-0" />
                <span className="text-[11px] text-slate-300 truncate">{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-3">
                <Linkedin size={12} className="text-violet-400 shrink-0" />
                <span className="text-[11px] text-slate-300 truncate">{data.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="px-6 pt-4 pb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400 font-bold mb-4">Skills</p>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span key={s} className="rounded-md bg-violet-900/50 border border-violet-700/40 px-2 py-1 text-[10px] text-violet-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right white column */}
      <div className="flex-1 bg-white text-slate-800 flex flex-col h-full">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 pt-10 pb-8 shrink-0">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{data.personalInfo.fullName || "Your Name"}</h2>
          <p className="text-sm font-bold text-violet-600 mt-1 uppercase tracking-wider">{data.personalInfo.jobTitle || "Your Title"}</p>
          {data.personalInfo.summary && (
            <p className="mt-4 text-xs leading-relaxed text-slate-600 max-w-lg">
              {data.personalInfo.summary}
            </p>
          )}
        </div>

        <div className="px-8 py-6 space-y-8 flex-1 overflow-hidden">
          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1.5 rounded-full bg-violet-600" />
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-700">Experience</p>
              </div>
              <div className="space-y-5 pl-4 border-l-2 border-slate-100">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-5">
                    <div className="absolute -left-[11px] top-1.5 h-3 w-3 rounded-full border-[3px] border-violet-500 bg-white" />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{exp.role || "Role"}</p>
                        <p className="text-xs text-violet-600 font-bold mt-0.5">{exp.company || "Company"}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400 mt-1">{exp.period}</span>
                    </div>
                    {exp.bullets && (
                      <ul className="mt-2.5 space-y-1.5">
                        {exp.bullets.split('\n').map((b, i) => b.trim() && (
                          <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                            {b.trim()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1.5 rounded-full bg-violet-600" />
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-700">Education</p>
              </div>
              <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                {data.education.map((edu) => (
                  <div key={edu.id} className="relative pl-5">
                    <div className="absolute -left-[11px] top-1.5 h-3 w-3 rounded-full border-[3px] border-violet-500 bg-white" />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{edu.degree || "Degree"}</p>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{edu.school || "Institution"}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400 mt-1">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

/* ─── Template registry ──────────────────────────────────── */
const TEMPLATE_LIST = [
  { id: "minimalist",  label: "Minimalist",  emoji: "✦" },
  { id: "corporate",   label: "Corporate",   emoji: "🏛" },
  { id: "tech",        label: "Tech",        emoji: "⟨/⟩" },
  { id: "creative",    label: "Creative",    emoji: "★" },
  { id: "executive",   label: "Executive",   emoji: "◆" },
  { id: "startup",     label: "Startup",     emoji: "⚡" },
  { id: "academic",    label: "Academic",    emoji: "∑" },
  { id: "editorial",   label: "Editorial",   emoji: "✦" },
  { id: "darkbold",    label: "Dark Bold",   emoji: "◉" },
  { id: "visual",      label: "Visual",      emoji: "◈" },
] as const;

type TemplateId = typeof TEMPLATE_LIST[number]["id"];

function renderTemplate(id: TemplateId, data: CvState, ref: React.Ref<HTMLDivElement>) {
  const props = { data, ref };
  switch (id) {
    case "minimalist": return <MinimalistTemplate {...props} />;
    case "corporate":  return <CorporateTemplate  {...props} />;
    case "tech":       return <TechTemplate       {...props} />;
    case "creative":   return <CreativeTemplate   {...props} />;
    case "executive":  return <ExecutiveTemplate  {...props} />;
    case "startup":    return <StartupTemplate    {...props} />;
    case "academic":   return <AcademicTemplate   {...props} />;
    case "editorial":  return <EditorialTemplate  {...props} />;
    case "darkbold":   return <DarkBoldTemplate   {...props} />;
    case "visual":     return <VisualTemplate     {...props} />;
  }
}

/* ─── Preview Pane ───────────────────────────────────────── */
function PreviewPane({
  device, setDevice, cvData, activeTemplate, setActiveTemplate,
  onSaveCloud, saving, saveStatus,
}: {
  device: "desktop" | "mobile";
  setDevice: (d: "desktop" | "mobile") => void;
  cvData: CvState;
  activeTemplate: TemplateId;
  setActiveTemplate: (t: TemplateId) => void;
  onSaveCloud: () => void;
  saving: boolean;
  saveStatus: "idle" | "saved" | "error";
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    content: () => printRef.current,
    documentTitle: `${cvData.personalInfo.fullName || "Professional"}_CV`,
  });

  return (
    <div className="flex flex-1 flex-col bg-[#080810]">
      {/* ── Top action bar ── */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 p-1">
          <button onClick={() => setDevice("desktop")} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${device === "desktop" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}>
            <Monitor size={13} /> Desktop
          </button>
          <button onClick={() => setDevice("mobile")} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${device === "mobile" ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}>
            <Smartphone size={13} /> Mobile
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-violet-600/50 hover:text-white">
            <Eye size={13} /> Preview
          </button>
          <button
            id="cv-save-cloud-btn"
            onClick={onSaveCloud}
            disabled={saving}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              saveStatus === "saved"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-violet-600/50 hover:text-white"
            }`}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saveStatus === "saved" ? <CheckCircle2 size={13} /> : <Cloud size={13} />}
            {saving ? "Saving…" : saveStatus === "saved" ? "Saved!" : "Save to Cloud"}
          </button>
          <button onClick={() => handlePrint()} className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow shadow-violet-900/50 transition hover:bg-violet-500 active:scale-[0.98]">
            <Download size={13} /> Export as PDF
          </button>
        </div>
      </div>

      {/* ── Template Switcher ── */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
        <div
          className="flex gap-1.5 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TEMPLATE_LIST.map((t) => {
            const isActive = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-900/50 scale-[1.04]"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-[10px] opacity-70">{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex flex-1 items-start justify-center overflow-auto p-8 pt-10 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #a78bfa 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div
          className={`relative transition-all duration-500 ${device === "mobile" ? "w-[360px]" : "w-[794px]"}`}
          style={{ height: device === "mobile" ? "520px" : "1123px" }}
        >
          <div className="absolute inset-0 rounded-lg opacity-30 blur-2xl" style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)" }} />
          <div
            className="relative h-full w-full overflow-hidden rounded-lg"
            style={{ transform: device === "mobile" ? "scale(0.85)" : "scale(1)", transformOrigin: "top center" }}
          >
            {renderTemplate(activeTemplate, cvData, printRef)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page root ──────────────────────────────────────────── */
function CvStudioPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [activeNav] = useState("builder");
  const [openStep, setOpenStep] = useState(1);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [cvData, setCvData] = useState<CvState>(initialState);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("minimalist");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  // ── Auth guard ──────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // ── Save CV to Supabase ─────────────────────────────────────
  const handleSaveCloud = async () => {
    if (!user) return;
    setSaving(true);
    setSaveStatus("idle");
    const toastId = toast.loading("Saving CV to cloud…");
    const { error } = await supabase.from("cvs").upsert(
      { user_id: user.id, cv_data_json: cvData, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    setSaving(false);
    if (error) {
      setSaveStatus("error");
      toast.error(`Save failed: ${error.message}`, { id: toastId });
    } else {
      setSaveStatus("saved");
      toast.success("CV saved successfully!", { id: toastId });
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  if (loading) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 font-sans">
      <div className="absolute left-[72px] top-3 z-20">
        <Link to="/dashboard" className="flex items-center gap-1.5 rounded-lg bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-400 backdrop-blur transition hover:text-slate-200">
          <ArrowLeft size={11} /> Dashboard
        </Link>
      </div>
      <Sidebar active={activeNav} />
      <FormPane openStep={openStep} setOpenStep={setOpenStep} cvData={cvData} setCvData={setCvData} />
      <PreviewPane
        device={device}
        setDevice={setDevice}
        cvData={cvData}
        activeTemplate={activeTemplate}
        setActiveTemplate={setActiveTemplate}
        onSaveCloud={handleSaveCloud}
        saving={saving}
        saveStatus={saveStatus}
      />
    </div>
  );
}
