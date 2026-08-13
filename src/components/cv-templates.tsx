import { forwardRef } from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";

/* ─── Shared Types ───────────────────────────────────────── */
export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
  portfolioUrl?: string;
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
  projects?: {
    title?: string;
    projectLabel?: string;
    description?: string;
    techStack?: string[];
    tech?: string[];
    link?: string;
    imageUrl?: string;
    highlight?: string;
  }[];
  highlights?: { id: string; date: string; content: string }[];
  additionalInfo?: string;
  keyHighlights?: string[];
  certifications?: string[];
  languages?: string[];
};

/* ─── Shared print styles injected into every template ───── */
const PRINT_STYLES = `
  @media print {
    @page { size: A4; margin: 0; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cv-root {
      width: 210mm !important;
      height: 297mm !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      transform: none !important;
    }
  }
`;

/* ══════════════════════════════════════════════════════════
   TEMPLATE 1 — MINIMALIST
   Clean, high whitespace, single column, elegant sans-serif
══════════════════════════════════════════════════════════ */
export const MinimalistTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, highlights, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white text-slate-800 overflow-hidden"
        style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
      >
        <style>{PRINT_STYLES}</style>

        <div className="flex flex-col h-full px-16 py-14">
          {/* Header */}
          <div className="border-b border-slate-200 pb-8 mb-8">
            <h1 className="text-4xl font-extralight tracking-[0.08em] text-slate-900 uppercase">
              {p.fullName || "Your Name"}
            </h1>
            <p className="mt-2 text-xs font-medium tracking-[0.25em] uppercase text-zinc-700">
              {p.jobTitle || "Your Title"}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
              {p.email && (
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-800">
                  <Mail size={10} /> {p.email}
                </span>
              )}
              {p.phone && (
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-800">
                  <Phone size={10} /> {p.phone}
                </span>
              )}
              {p.location && (
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-800">
                  <MapPin size={10} /> {p.location}
                </span>
              )}
              {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-zinc-900 hover:opacity-70 transition-opacity"><Globe size={10} /></a>)}
            </div>
          </div>

          {/* Summary */}
          
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
            <div className="mb-8">
              <p className="text-[11px] leading-relaxed text-zinc-900 max-w-2xl">
                {p.summary}
              </p>
            </div>
          )}

          {/* Highlights Timeline */}
          {highlights && highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-700 mb-5">
                Recent Milestones
              </h2>
              <div className="space-y-4 relative border-l border-slate-200 ml-[52px]">
                {highlights.map((h) => (
                  <div key={h.id} className="flex relative">
                    <div className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <div className="w-24 shrink-0 text-[9px] text-zinc-700 text-right pr-6 -ml-[52px] pt-0.5">
                      {new Date(h.date).toLocaleDateString("en-GB", { month: "short", year: "numeric", day: "numeric" })}
                    </div>
                    <div className="flex-1 pl-6">
                      <p className="text-[11px] text-zinc-900 leading-relaxed">
                        {h.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-700 mb-5">
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="flex gap-8">
                    <div className="w-28 shrink-0 text-[10px] text-zinc-700 pt-0.5">
                      {exp.period}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{exp.role}</p>
                      <p className="text-[11px] text-zinc-800 mt-0.5">{exp.company}</p>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.split("\n").map(
                            (b, i) =>
                              b.trim() && (
                                <li
                                  key={i}
                                  className="text-[11px] text-zinc-900 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-zinc-700"
                                >
                                  {b.trim()}
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-700 mb-5">
                Education
              </h2>
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div key={i} className="flex gap-8">
                    <div className="w-28 shrink-0 text-[10px] text-zinc-700 pt-0.5">
                      
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                      <p className="text-[11px] text-zinc-800 mt-0.5">{proj.link}</p>
                    </div>
                  
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-700 mb-5">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex gap-8">
                    <div className="w-28 shrink-0 text-[10px] text-zinc-700 pt-0.5">
                      {edu.year}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{edu.degree}</p>
                      <p className="text-[11px] text-zinc-800 mt-0.5">{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-700 mb-4">
                Skills
              </h2>
              <p className="text-[11px] text-zinc-900 leading-relaxed">
                {skills.join("  ·  ")}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);
MinimalistTemplate.displayName = "MinimalistTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 2 — CORPORATE
   Traditional, trusted, deep navy blue accents, strict hierarchy
══════════════════════════════════════════════════════════ */
export const CorporateTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, highlights, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const NAVY = "#0f2d5a";
    const NAVY_LIGHT = "#e8eef6";
    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white text-slate-800 overflow-hidden"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Top bar */}
        <div style={{ backgroundColor: NAVY }} className="px-10 py-8">
          <h1 className="text-3xl font-bold tracking-wide text-white">
            {p.fullName || "Your Name"}
          </h1>
          <p
            className="mt-1 text-sm font-light tracking-widest uppercase"
            style={{ color: "#94b8e0" }}
          >
            {p.jobTitle || "Professional Title"}
          </p>
        </div>

        {/* Contact strip */}
        <div style={{ backgroundColor: NAVY_LIGHT }} className="px-10 py-3 flex flex-wrap gap-x-8 gap-y-1">
          {p.email && (
            <span className="flex items-center gap-2 text-[10px] text-zinc-900">
              <Mail size={10} style={{ color: NAVY }} /> {p.email}
            </span>
          )}
          {p.phone && (
            <span className="flex items-center gap-2 text-[10px] text-zinc-900">
              <Phone size={10} style={{ color: NAVY }} /> {p.phone}
            </span>
          )}
          {p.location && (
            <span className="flex items-center gap-2 text-[10px] text-zinc-900">
              <MapPin size={10} style={{ color: NAVY }} /> {p.location}
            </span>
          )}
          {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={10} style={{ color: NAVY }} /></a>)}
          {p.github && (<a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] text-zinc-900 hover:opacity-70 transition-opacity"><Github size={10} style={{ color: NAVY }} /></a>)}
        </div>

        <div className="px-10 py-7 flex gap-8 flex-1">
          {/* Main Column */}
          <div className="flex-1 space-y-7">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div>
                <SectionHeader label="Professional Summary" color={NAVY} />
                <p className="text-[11px] leading-relaxed text-zinc-900 mt-3">
                  {p.summary}
                </p>
              </div>
            )}

            {highlights && highlights.length > 0 && (
              <div>
                <SectionHeader label="Recent Milestones" color={NAVY} />
                <div className="mt-3 space-y-4 border-l-2 ml-1" style={{ borderColor: `${NAVY}33` }}>
                  {highlights.map((h) => (
                    <div key={h.id} className="relative pl-4">
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: NAVY }} />
                      <p className="text-[10px] font-bold" style={{ color: NAVY }}>
                        {new Date(h.date).toLocaleDateString("en-GB", { month: "short", year: "numeric", day: "numeric" })}
                      </p>
                      <p className="text-[11px] leading-relaxed text-zinc-900 mt-0.5">
                        {h.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <SectionHeader label="Work Experience" color={NAVY} />
                <div className="mt-3 space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{exp.role}</p>
                          <p className="text-[11px] font-semibold mt-0.5" style={{ color: NAVY }}>
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-800 shrink-0 mt-0.5 border border-slate-200 rounded px-2 py-0.5">
                          {exp.period}
                        </span>
                      </div>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1 pl-3">
                          {exp.bullets.split("\n").map(
                            (b, i) =>
                              b.trim() && (
                                <li key={i} className="text-[11px] text-zinc-900 list-disc list-inside">
                                  {b.trim()}
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <SectionHeader label="Projects" color={NAVY} />
                <div className="mt-3 space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                        <p className="text-[11px] text-zinc-800">{proj.link}</p>
                      </div>
                      <span className="text-[10px] text-zinc-800 shrink-0"></span>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <SectionHeader label="Education" color={NAVY} />
                <div className="mt-3 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] text-zinc-800">{edu.school}</p>
                      </div>
                      <span className="text-[10px] text-zinc-800 shrink-0">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Certifications</h3>
              <ul className="flex flex-wrap gap-2 text-[11px] leading-relaxed text-zinc-900">
                {certifications.map((c, i) => (
                  <li key={i} className="border border-slate-300 rounded px-2 py-0.5">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LANGUAGES ── */}
          {languages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Languages</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-zinc-900 list-disc pl-4">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

          </div>

          {/* Side Column */}
          <div className="w-44 shrink-0 space-y-6">
            {skills.length > 0 && (
              <div>
                <SectionHeader label="Core Skills" color={NAVY} />
                <ul className="mt-3 space-y-1.5">
                  {skills.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-[11px] text-zinc-900">
                      <span className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: NAVY }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
CorporateTemplate.displayName = "CorporateTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 3 — TECH / DEVELOPER
   Two-column, prominent skills pill-box, monospace accents
══════════════════════════════════════════════════════════ */
export const TechTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const ACCENT = "#6d28d9"; // violet
    const DARK = "#0f0f1a";

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white overflow-hidden flex"
        style={{ fontFamily: "'Inter', monospace" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Left sidebar */}
        <div className="w-56 shrink-0 flex flex-col h-full" style={{ backgroundColor: DARK }}>
          {/* Avatar / initials */}
          <div className="flex flex-col items-center pt-8 pb-6 px-5">
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center text-xl font-bold text-white mb-4"
              style={{ backgroundColor: ACCENT }}
            >
              {p.fullName ? p.fullName.substring(0, 2).toUpperCase() : "CV"}
            </div>
            <p className="text-sm font-bold text-white text-center leading-tight">
              {p.fullName || "Your Name"}
            </p>
            <p className="text-[10px] mt-1 text-center" style={{ color: "#a78bfa" }}>
              {p.jobTitle || "Developer"}
            </p>
          </div>

          {/* Contact */}
          <div className="px-5 py-4 border-t border-white/10 space-y-2.5">
            <p className="text-[8px] font-bold tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
              Contact
            </p>
            {p.email && <ContactRow icon={<Mail size={10} />} text={p.email} />}
            {p.phone && <ContactRow icon={<Phone size={10} />} text={p.phone} />}
            {p.location && <ContactRow icon={<MapPin size={10} />} text={p.location} />}
            {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={10} /></a>)}
            {p.github && (<a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-900 hover:opacity-70 transition-opacity"><Github size={10} /></a>)}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="px-5 py-4 border-t border-white/10">
              <p className="text-[8px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: ACCENT }}>
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded px-1.5 py-0.5 text-[9px] font-mono font-medium"
                    style={{ backgroundColor: "#1e1e3f", color: "#c4b5fd", border: "1px solid #4c1d95" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top accent bar */}
          <div className="px-8 py-6" style={{ borderBottom: `3px solid ${ACCENT}` }}>
            <span
              className="text-[9px] font-mono tracking-widest"
              style={{ color: ACCENT }}
            >
              &lt;developer&gt;
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {p.fullName || "Your Name"}
            </h1>
            <p className="text-sm font-medium text-zinc-800 mt-0.5">{p.jobTitle}</p>
          </div>

          <div className="px-8 py-6 space-y-6 flex-1 overflow-hidden">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div>
                <TechSectionTitle label="About" accent={ACCENT} />
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-900">{p.summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <TechSectionTitle label="Experience" accent={ACCENT} />
                <div className="mt-3 space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="pl-3" style={{ borderLeft: `2px solid ${ACCENT}22` }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{exp.role}</p>
                          <p className="text-[11px] font-semibold" style={{ color: ACCENT }}>
                            {exp.company}
                          </p>
                        </div>
                        <code className="text-[9px] text-zinc-700 shrink-0 mt-1 font-mono">
                          {exp.period}
                        </code>
                      </div>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.split("\n").map(
                            (b, i) =>
                              b.trim() && (
                                <li key={i} className="text-[11px] text-zinc-900 flex gap-2">
                                  <span style={{ color: ACCENT }}>▸</span> {b.trim()}
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <TechSectionTitle label="Projects" accent={ACCENT} />
                <div className="mt-3 space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                        <p className="text-[11px] text-zinc-800">{proj.link}</p>
                      </div>
                      <code className="text-[9px] text-zinc-700 font-mono shrink-0"></code>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <TechSectionTitle label="Education" accent={ACCENT} />
                <div className="mt-3 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] text-zinc-800">{edu.school}</p>
                      </div>
                      <code className="text-[9px] text-zinc-700 font-mono shrink-0">{edu.year}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Certifications</h3>
              <ul className="flex flex-wrap gap-2 text-[11px] leading-relaxed text-zinc-900">
                {certifications.map((c, i) => (
                  <li key={i} className="border border-slate-300 rounded px-2 py-0.5">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LANGUAGES ── */}
          {languages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Languages</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-zinc-900 list-disc pl-4">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

          </div>

          {/* Footer tag */}
          <div className="px-8 py-3 border-t border-slate-100">
            <span className="text-[9px] font-mono text-zinc-700">&lt;/developer&gt;</span>
          </div>
        </div>
      </div>
    );
  }
);
TechTemplate.displayName = "TechTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 4 — CREATIVE STUDIO
   Bold accent, asymmetric layout, striking typography
══════════════════════════════════════════════════════════ */
export const CreativeTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const ROSE = "#e11d48";
    const ORANGE = "#f97316";

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Bold asymmetric header */}
        <div className="relative px-10 pt-10 pb-8 overflow-hidden" style={{ background: `linear-gradient(135deg, ${ROSE} 0%, ${ORANGE} 100%)` }}>
          {/* Big decorative circle */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute right-16 top-8 h-16 w-16 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/60 mb-2">
              — Portfolio
            </p>
            <h1 className="text-5xl font-black text-white leading-none tracking-tight">
              {p.fullName || "Your Name"}
            </h1>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-white/70">
              {p.jobTitle || "Creative Professional"}
            </p>
          </div>
        </div>

        {/* Contact bar */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 px-10 py-3 bg-slate-900">
          {p.email && <span className="flex items-center gap-1.5 text-[10px] text-zinc-700"><Mail size={9} color={ROSE} /> {p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5 text-[10px] text-zinc-700"><Phone size={9} color={ROSE} /> {p.phone}</span>}
          {p.location && <span className="flex items-center gap-1.5 text-[10px] text-zinc-700"><MapPin size={9} color={ROSE} /> {p.location}</span>}
          {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-zinc-900 hover:opacity-70 transition-opacity"><Globe size={9} color={ROSE} /></a>)}
        </div>

        {/* Body: two columns */}
        <div className="flex gap-0 flex-1" style={{ minHeight: 0 }}>
          {/* Main */}
          <div className="flex-1 px-10 py-7 space-y-6">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div>
                <CreativeSectionTitle label="About Me" rose={ROSE} />
                <p className="text-[11px] leading-relaxed text-zinc-900 mt-3">{p.summary}</p>
              </div>
            )}
            {experience.length > 0 && (
              <div>
                <CreativeSectionTitle label="Experience" rose={ROSE} />
                <div className="mt-3 space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-extrabold text-slate-900">{exp.role}</p>
                          <p className="text-[11px] font-bold mt-0.5" style={{ color: ROSE }}>{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-zinc-700 shrink-0 font-medium mt-0.5 italic">{exp.period}</span>
                      </div>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.split("\n").map((b, i) => b.trim() && (
                            <li key={i} className="flex gap-2 text-[11px] text-zinc-900">
                              <span style={{ color: ORANGE }} className="shrink-0 font-bold">→</span>
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
            {projects.length > 0 && (
              <div>
                <CreativeSectionTitle label="Projects" rose={ROSE} />
                <div className="mt-3 space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                        <p className="text-[11px] text-zinc-800">{proj.link}</p>
                      </div>
                      <span className="text-[10px] text-zinc-700 italic shrink-0"></span>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <CreativeSectionTitle label="Education" rose={ROSE} />
                <div className="mt-3 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] text-zinc-800">{edu.school}</p>
                      </div>
                      <span className="text-[10px] text-zinc-700 italic shrink-0">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side panel */}
          {skills.length > 0 && (
            <div className="w-44 shrink-0 px-5 py-7 border-l-4" style={{ borderColor: ROSE + "22", backgroundColor: "#fff8f8" }}>
              <p className="text-[9px] font-black tracking-[0.3em] uppercase mb-4" style={{ color: ROSE }}>Skills</p>
              <div className="flex flex-col gap-2">
                {skills.map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: ORANGE }} />
                    <span className="text-[11px] text-zinc-900 font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
CreativeTemplate.displayName = "CreativeTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 5 — EXECUTIVE
   Sophisticated serif headers, strong summary & experience focus
══════════════════════════════════════════════════════════ */
export const ExecutiveTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const GOLD = "#92702a";

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-[#fdfcf9] overflow-hidden"
        style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Centered prestige header */}
        <div className="text-center px-16 pt-12 pb-8 border-b-2" style={{ borderColor: GOLD }}>
          <h1 className="text-4xl font-bold tracking-widest text-slate-900 uppercase">
            {p.fullName || "Your Name"}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-16" style={{ backgroundColor: GOLD }} />
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: GOLD }}>
              {p.jobTitle || "Executive"}
            </p>
            <div className="h-px w-16" style={{ backgroundColor: GOLD }} />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1">
            {p.email && <span className="text-[10px] text-zinc-800">{p.email}</span>}
            {p.phone && <span className="text-[10px] text-zinc-800">· {p.phone}</span>}
            {p.location && <span className="text-[10px] text-zinc-800">· {p.location}</span>}
            {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-zinc-900 font-medium hover:underline transition-all"><Linkedin size={10} /></a>)}
          </div>
        </div>

        <div className="px-16 py-8 space-y-7">
          {/* Executive summary — featured */}
          
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
            <div className="border-l-2 pl-6" style={{ borderColor: GOLD }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: GOLD }}>
                Executive Summary
              </p>
              <p className="text-[12px] leading-loose text-zinc-900 italic">{p.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <ExecSectionTitle label="Career History" gold={GOLD} />
              <div className="mt-4 space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="text-base font-bold text-slate-900">{exp.role}</p>
                      <span className="text-[10px] text-zinc-800 italic shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: GOLD }}>{exp.company}</p>
                    {exp.bullets && (
                      <ul className="mt-2.5 space-y-1.5 pl-4">
                        {exp.bullets.split("\n").map((b, i) => b.trim() && (
                          <li key={i} className="text-[11px] text-zinc-900 leading-relaxed list-disc">
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

          <div className="flex gap-10">
            {projects.length > 0 && (
              <div className="flex-1">
                <ExecSectionTitle label="Projects" gold={GOLD} />
                <div className="mt-4 space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <p className="text-sm font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                      <p className="text-[11px] text-zinc-800">{proj.link} · </p>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div className="flex-1">
                <ExecSectionTitle label="Education" gold={GOLD} />
                <div className="mt-4 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                      <p className="text-[11px] text-zinc-800">{edu.school} · {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {skills.length > 0 && (
              <div className="w-52 shrink-0">
                <ExecSectionTitle label="Areas of Expertise" gold={GOLD} />
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {skills.map((s) => (
                    <p key={s} className="text-[11px] text-zinc-900 flex items-center gap-1.5">
                      <span className="text-[8px]" style={{ color: GOLD }}>◆</span> {s}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
ExecutiveTemplate.displayName = "ExecutiveTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 6 — MODERN STARTUP
   Sleek gradients, rounded elements, vibrant but professional
══════════════════════════════════════════════════════════ */
export const StartupTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif", background: "#f8faff" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Gradient hero */}
        <div
          className="px-10 pt-10 pb-8"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest mb-3"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}
              >
                {p.jobTitle || "Professional"}
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                {p.fullName || "Your Name"}
              </h1>
            </div>
            {/* Initials circle */}
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-600 shrink-0"
              style={{ background: "rgba(255,255,255,0.95)" }}
            >
              {p.fullName ? p.fullName.substring(0, 2).toUpperCase() : "YN"}
            </div>
          </div>

          {/* Contact chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {p.email && (
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                <Mail size={9} /> {p.email}
              </span>
            )}
            {p.phone && (
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                <Phone size={9} /> {p.phone}
              </span>
            )}
            {p.location && (
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                <MapPin size={9} /> {p.location}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-6 px-8 py-6">
          {/* Main */}
          <div className="flex-1 space-y-6">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-indigo-50">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-indigo-400 mb-2">About</p>
                <p className="text-[11px] leading-relaxed text-zinc-900">{p.summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-indigo-400 mb-3">Experience</p>
                <div className="space-y-3">
                  {experience.map((exp) => (
                    <div key={exp.id} className="rounded-2xl bg-white p-5 shadow-sm border border-indigo-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{exp.role}</p>
                          <p className="text-[11px] font-semibold text-indigo-500 mt-0.5">{exp.company}</p>
                        </div>
                        <span className="text-[9px] rounded-full bg-indigo-50 text-indigo-500 px-2 py-0.5 font-medium shrink-0">{exp.period}</span>
                      </div>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.split("\n").map((b, i) => b.trim() && (
                            <li key={i} className="text-[11px] text-zinc-900 flex gap-2">
                              <span className="text-indigo-300 shrink-0">•</span> {b.trim()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-indigo-400 mb-3">Projects</p>
                <div className="space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="rounded-2xl bg-white p-4 shadow-sm border border-indigo-50 flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                        <p className="text-[11px] text-zinc-800">{proj.link}</p>
                      </div>
                      <span className="text-[9px] rounded-full bg-purple-50 text-purple-400 px-2 py-0.5 font-medium shrink-0"></span>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-indigo-400 mb-3">Education</p>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="rounded-2xl bg-white p-4 shadow-sm border border-indigo-50 flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] text-zinc-800">{edu.school}</p>
                      </div>
                      <span className="text-[9px] rounded-full bg-purple-50 text-purple-400 px-2 py-0.5 font-medium shrink-0">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills sidebar */}
          {skills.length > 0 && (
            <div className="w-40 shrink-0">
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-indigo-400 mb-3">Skills</p>
              <div className="flex flex-col gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-xl px-3 py-1.5 text-[11px] font-semibold text-center"
                    style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", color: "#4f46e5" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
StartupTemplate.displayName = "StartupTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 7 — ACADEMIC / RESEARCH
   Formal, dense single-column, traditional standard formatting
══════════════════════════════════════════════════════════ */
export const AcademicTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white overflow-hidden"
        style={{ fontFamily: "'Times New Roman', 'Georgia', serif" }}
      >
        <style>{PRINT_STYLES}</style>
        <div className="px-14 py-10 flex flex-col h-full">
          {/* Centered formal header */}
          <div className="text-center mb-6 pb-4 border-b-2 border-slate-800">
            <h1 className="text-2xl font-bold tracking-wide text-slate-900 uppercase">
              {p.fullName || "Your Name"}
            </h1>
            <p className="text-sm text-zinc-900 mt-1">{p.jobTitle}</p>
            <div className="mt-3 text-[11px] text-zinc-900 space-y-0.5">
              {(p.email || p.phone) && (
                <p>{[p.email, p.phone].filter(Boolean).join("  |  ")}</p>
              )}
              {(p.location || p.linkedin) && (
                <p>{[p.location, p.linkedin].filter(Boolean).join("  |  ")}</p>
              )}
            </div>
          </div>

          {/* Dense single-column body */}
          <div className="space-y-5 flex-1">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div>
                <AcadSectionTitle label="Research Statement / Summary" />
                <p className="mt-2 text-[11px] leading-loose text-zinc-900 text-justify">{p.summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <AcadSectionTitle label="Academic & Professional Experience" />
                <div className="mt-2 space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <p className="text-[12px] font-bold text-slate-900">{exp.role}</p>
                        <span className="text-[10px] text-zinc-900 shrink-0 italic">{exp.period}</span>
                      </div>
                      <p className="text-[11px] italic text-zinc-900">{exp.company}</p>
                      {exp.bullets && (
                        <ul className="mt-1.5 space-y-1 pl-5 list-disc">
                          {exp.bullets.split("\n").map((b, i) => b.trim() && (
                            <li key={i} className="text-[11px] leading-relaxed text-zinc-900">{b.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <AcadSectionTitle label="Projects" />
                <div className="mt-2 space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                        <p className="text-[11px] italic text-zinc-900">{proj.link}</p>
                      </div>
                      <span className="text-[11px] text-zinc-900 shrink-0"></span>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <AcadSectionTitle label="Education" />
                <div className="mt-2 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-[11px] italic text-zinc-900">{edu.school}</p>
                      </div>
                      <span className="text-[11px] text-zinc-900 shrink-0">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <AcadSectionTitle label="Areas of Competency" />
                <p className="mt-2 text-[11px] leading-loose text-zinc-900">
                  {skills.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
AcademicTemplate.displayName = "AcademicTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 8 — EDITORIAL
   High-fashion magazine style, elegant font pairings & dividers
══════════════════════════════════════════════════════════ */
export const EditorialTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const INK = "#1c1917";

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-[#faf9f7] overflow-hidden"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Magazine masthead */}
        <div className="px-12 pt-10 pb-0">
          <div className="flex items-end justify-between border-b-4 border-stone-900 pb-4">
            <div>
              <p className="text-[8px] tracking-[0.5em] uppercase text-stone-400 font-sans mb-2">
                Curriculum Vitae
              </p>
              <h1
                className="text-6xl font-bold leading-none tracking-tight"
                style={{ color: INK, fontFamily: "'Georgia', serif" }}
              >
                {p.fullName ? p.fullName.split(" ")[0] : "First"}
              </h1>
              <h1
                className="text-6xl font-bold leading-none tracking-tight"
                style={{ color: INK, fontFamily: "'Georgia', serif" }}
              >
                {p.fullName ? p.fullName.split(" ").slice(1).join(" ") : "Last"}
              </h1>
            </div>
            <div className="text-right pb-1">
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans text-stone-500 mb-2">
                {p.jobTitle}
              </p>
              <div className="space-y-1 font-sans">
                {p.email && <p className="text-[10px] text-stone-500">{p.email}</p>}
                {p.phone && <p className="text-[10px] text-stone-500">{p.phone}</p>}
                {p.location && <p className="text-[10px] text-stone-500">{p.location}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Body — magazine two-col */}
        <div className="flex gap-0 px-12 pt-7" style={{ fontFamily: "'Georgia', serif" }}>
          {/* Wide main col */}
          <div className="flex-1 pr-10 space-y-6">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase font-sans text-stone-400 mb-3">Profile</p>
                <p className="text-[12px] leading-loose text-stone-700 italic border-l-2 border-stone-300 pl-4">
                  {p.summary}
                </p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase font-sans text-stone-400 mb-3">Experience</p>
                <div className="space-y-5">
                  {experience.map((exp, i) => (
                    <div key={exp.id}>
                      {i > 0 && <div className="h-px bg-stone-200 mb-5" />}
                      <div className="flex justify-between items-baseline">
                        <p className="text-[13px] font-bold text-stone-900">{exp.role}</p>
                        <span className="text-[9px] font-sans text-stone-400 italic shrink-0">{exp.period}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5">{exp.company}</p>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.split("\n").map((b, j) => b.trim() && (
                            <li key={j} className="text-[11px] leading-relaxed text-stone-600 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-stone-400">
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
          </div>

          {/* Narrow side col */}
          <div className="w-48 shrink-0 border-l border-stone-200 pl-8 space-y-6">
            {projects.length > 0 && (
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase font-sans text-stone-400 mb-3">Projects</p>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <p className="text-[11px] font-bold text-stone-900 leading-tight"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                      <p className="text-[10px] font-sans text-stone-500 mt-0.5">{proj.link}</p>
                      <p className="text-[10px] font-sans text-stone-400 mt-0.5 italic"></p>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase font-sans text-stone-400 mb-3">Education</p>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p className="text-[11px] font-bold text-stone-900 leading-tight">{edu.degree}</p>
                      <p className="text-[10px] font-sans text-stone-500 mt-0.5">{edu.school}</p>
                      <p className="text-[10px] font-sans text-stone-400 mt-0.5 italic">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {skills.length > 0 && (
              <div>
                <p className="text-[8px] tracking-[0.4em] uppercase font-sans text-stone-400 mb-3">Expertise</p>
                <div className="space-y-2">
                  {skills.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-stone-200" />
                      <span className="text-[10px] font-sans text-stone-600 whitespace-nowrap">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
EditorialTemplate.displayName = "EditorialTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 9 — DARK BOLD
   High contrast dark header, prints cleanly via forced colors
══════════════════════════════════════════════════════════ */
export const DarkBoldTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const NEON = "#22d3ee"; // cyan accent

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full overflow-hidden flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif", background: "#0a0a0f" }}
      >
        <style>{PRINT_STYLES + `
          @media print {
            .cv-root { background: #0a0a0f !important; }
            .dark-panel { background: #0a0a0f !important; }
          }
        `}</style>

        {/* Bold dark header */}
        <div className="px-10 pt-10 pb-8" style={{ background: "#0a0a0f", borderBottom: `3px solid ${NEON}` }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] font-bold tracking-[0.5em] uppercase mb-2" style={{ color: NEON }}>
                {p.jobTitle || "Professional"}
              </p>
              <h1 className="text-5xl font-black text-white leading-none">
                {p.fullName || "Your Name"}
              </h1>
            </div>
            <div
              className="h-20 w-20 rounded-xl flex items-center justify-center text-2xl font-black shrink-0"
              style={{ background: NEON, color: "#0a0a0f" }}
            >
              {p.fullName ? p.fullName.substring(0, 2).toUpperCase() : "CV"}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-5">
            {p.email && <span className="text-[10px] text-zinc-700">{p.email}</span>}
            {p.phone && <span className="text-[10px] text-zinc-700">· {p.phone}</span>}
            {p.location && <span className="text-[10px] text-zinc-700">· {p.location}</span>}
            {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-zinc-900 font-medium hover:underline transition-all"><Linkedin size={10} /></a>)}
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-6 px-10 py-8 flex-1 dark-panel">
          {/* Main */}
          <div className="flex-1 space-y-6">
            
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
              <div>
                <DarkSectionTitle label="About" neon={NEON} />
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-700">{p.summary}</p>
              </div>
            )}
            {experience.length > 0 && (
              <div>
                <DarkSectionTitle label="Experience" neon={NEON} />
                <div className="mt-3 space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="pl-3" style={{ borderLeft: `2px solid ${NEON}33` }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-white">{exp.role}</p>
                          <p className="text-[11px] font-semibold mt-0.5" style={{ color: NEON }}>{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-zinc-800 shrink-0">{exp.period}</span>
                      </div>
                      {exp.bullets && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.split("\n").map((b, i) => b.trim() && (
                            <li key={i} className="text-[11px] text-zinc-700 flex gap-2">
                              <span style={{ color: NEON }} className="shrink-0">›</span> {b.trim()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projects.length > 0 && (
              <div>
                <DarkSectionTitle label="Projects" neon={NEON} />
                <div className="mt-3 space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold text-white"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                        <p className="text-[11px] text-zinc-700">{proj.link}</p>
                      </div>
                      <span className="text-[10px] text-zinc-800 shrink-0"></span>
                    
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                  ))}
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
              <div>
                <DarkSectionTitle label="Education" neon={NEON} />
                <div className="mt-3 space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{edu.degree}</p>
                        <p className="text-[11px] text-zinc-700">{edu.school}</p>
                      </div>
                      <span className="text-[10px] text-zinc-800 shrink-0">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills sidebar */}
          {skills.length > 0 && (
            <div className="w-44 shrink-0">
              <DarkSectionTitle label="Skills" neon={NEON} />
              <div className="mt-3 flex flex-col gap-2">
                {skills.map((s) => (
                  <div
                    key={s}
                    className="rounded-lg px-3 py-2 text-[11px] font-bold text-center"
                    style={{ background: `${NEON}15`, color: NEON, border: `1px solid ${NEON}33` }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
DarkBoldTemplate.displayName = "DarkBoldTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 10 — VISUAL / INFOGRAPHIC
   Timeline vertical lines for experience, visual structures
══════════════════════════════════════════════════════════ */
export const VisualTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const TEAL = "#0d9488";
    const TEAL_LIGHT = "#f0fdfa";

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white overflow-hidden flex"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <style>{PRINT_STYLES}</style>

        {/* Left sidebar */}
        <div className="w-60 shrink-0 flex flex-col h-full" style={{ backgroundColor: TEAL_LIGHT, borderRight: `4px solid ${TEAL}` }}>
          {/* Header block */}
          <div className="px-6 pt-8 pb-6" style={{ background: TEAL }}>
            <div
              className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center text-2xl font-black text-white mb-4"
              style={{ background: `${TEAL}cc` }}
            >
              {p.fullName ? p.fullName.substring(0, 2).toUpperCase() : "CV"}
            </div>
            <h1 className="text-xl font-extrabold text-white leading-tight">{p.fullName || "Your Name"}</h1>
            <p className="text-[10px] mt-1 text-white/75 uppercase tracking-widest">{p.jobTitle}</p>
          </div>

          {/* Contact */}
          <div className="px-6 pt-5 pb-4 space-y-2">
            <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: TEAL }}>Contact</p>
            {p.email && <VisualContactRow icon={<Mail size={11} />} text={p.email} teal={TEAL} />}
            {p.phone && <VisualContactRow icon={<Phone size={11} />} text={p.phone} teal={TEAL} />}
            {p.location && <VisualContactRow icon={<MapPin size={11} />} text={p.location} teal={TEAL} />}
            {p.linkedin && (<a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={11} color={TEAL} /></a>)}
          </div>

          {/* Skills as percentage bars */}
          {skills.length > 0 && (
            <div className="px-6 pt-4 pb-5 border-t" style={{ borderColor: `${TEAL}30` }}>
              <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-4" style={{ color: TEAL }}>Skills</p>
              <div className="space-y-3">
                {skills.map((s, i) => {
                  const pct = Math.max(70, 100 - i * 8);
                  return (
                    <div key={s}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-semibold text-zinc-900">{s}</span>
                        <span className="text-[9px] text-zinc-700">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/70">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: TEAL }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Summary strip */}
          {p.summary && (
            <div className="px-8 py-6 border-b-2" style={{ borderColor: `${TEAL}30` }}>
              <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: TEAL }}>Profile</p>
              <p className="text-[11px] leading-relaxed text-zinc-900">{p.summary}</p>
            </div>
          )}

          <div className="px-8 py-6 flex-1 space-y-6 overflow-hidden">
            {/* Timeline experience */}
            {experience.length > 0 && (
              <div>
                <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-5" style={{ color: TEAL }}>Experience</p>
                <div className="relative pl-8">
                  {/* Vertical timeline rail */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 rounded-full" style={{ background: `${TEAL}30` }} />
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative">
                        {/* Timeline dot */}
                        <div
                          className="absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-white"
                          style={{ background: TEAL, marginLeft: "4px" }}
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">{exp.role}</p>
                            <p className="text-[11px] font-bold mt-0.5" style={{ color: TEAL }}>{exp.company}</p>
                          </div>
                          <span
                            className="text-[9px] rounded-full px-2 py-0.5 font-bold shrink-0"
                            style={{ background: `${TEAL}15`, color: TEAL }}
                          >
                            {exp.period}
                          </span>
                        </div>
                        {exp.bullets && (
                          <ul className="mt-2 space-y-1">
                            {exp.bullets.split("\n").map((b, i) => b.trim() && (
                              <li key={i} className="text-[11px] text-zinc-900 flex gap-2">
                                <span style={{ color: TEAL }} className="shrink-0 font-bold">•</span> {b.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Education timeline */}
            {education.length > 0 && (
              <div>
                <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-5" style={{ color: TEAL }}>Education</p>
                <div className="relative pl-8">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 rounded-full" style={{ background: `${TEAL}30` }} />
                  <div className="space-y-5">
                    {education.map((edu) => (
                      <div key={edu.id} className="relative">
                        <div
                          className="absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-white"
                          style={{ background: `${TEAL}88`, marginLeft: "4px" }}
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{edu.degree}</p>
                            <p className="text-[11px] text-zinc-800">{edu.school}</p>
                          </div>
                          <span className="text-[9px] text-zinc-700 shrink-0">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* ── PROJECTS ── */}
          {projects.length > 0 && (
              <div>
                <p className="text-[8px] font-black tracking-[0.3em] uppercase mb-5" style={{ color: TEAL }}>Projects</p>
                <div className="relative pl-8">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 rounded-full" style={{ background: `${TEAL}30` }} />
                  <div className="space-y-5">
                    {projects.map((proj, i) => (
                      <div key={i} className="relative">
                        <div
                          className="absolute -left-8 top-1 h-4 w-4 rounded-full border-2 border-white"
                          style={{ background: `${TEAL}88`, marginLeft: "4px" }}
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                            <p className="text-[11px] text-zinc-800">{proj.link}</p>
                          </div>
                          <span className="text-[9px] text-zinc-700 shrink-0"></span>
                        </div>
                      
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
VisualTemplate.displayName = "VisualTemplate";

/* ─── Shared small helpers ───────────────────────────────── */
function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color }}>
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function TechSectionTitle({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono font-bold tracking-widest uppercase" style={{ color: accent }}>
        // {label}
      </span>
    </div>
  );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-700 shrink-0">{icon}</span>
      <span className="text-[10px] text-zinc-700 truncate">{text}</span>
    </div>
  );
}

function CreativeSectionTitle({ label, rose }: { label: string; rose: string }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="h-3 w-1 rounded-full" style={{ backgroundColor: rose }} />
      <span className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: rose }}>
        {label}
      </span>
    </div>
  );
}

function ExecSectionTitle({ label, gold }: { label: string; gold: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: gold }}>{label}</p>
      <div className="mt-1 h-px" style={{ backgroundColor: gold + "44" }} />
    </div>
  );
}

function AcadSectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-zinc-900">{label}</span>
      <div className="flex-1 h-px bg-slate-400" />
    </div>
  );
}

function DarkSectionTitle({ label, neon }: { label: string; neon: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: neon }}>{label}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: neon + "33" }} />
    </div>
  );
}

function VisualContactRow({ icon, text, teal }: { icon: React.ReactNode; text: string; teal: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: teal }} className="shrink-0">{icon}</span>
      <span className="text-[10px] text-zinc-900 truncate">{text}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TEMPLATE 11 — ATS CLASSIC
   Pure single-column, black-on-white, clean ruled sections.
   Zero graphical elements — maximises ATS parse score.
══════════════════════════════════════════════════════════ */
export const ATSClassicTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white text-slate-900 overflow-hidden"
        style={{ fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }}
      >
        <style>{PRINT_STYLES}</style>
        <div className="px-12 py-10 flex flex-col h-full gap-0">
          {/* ── Header ── */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold tracking-wide text-slate-900 uppercase">
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p className="text-[11px] text-zinc-900 mt-0.5 font-medium">{p.jobTitle}</p>
            )}
            <div className="mt-2 flex flex-wrap justify-center items-center gap-2 text-[10px] text-zinc-900 leading-relaxed">
              {[
                p.email && <span key="email">{p.email}</span>,
                p.phone && <span key="phone">{p.phone}</span>,
                p.location && <span key="loc">{p.location}</span>,
                p.linkedin && (
                  <a key="ln" href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={12} />
                    <span className="ml-1 text-[10px]">{p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ),
                p.github && (
                  <a key="gh" href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Github size={12} />
                    <span className="ml-1 text-[10px]">{p.github?.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ),
                p.portfolioUrl && (
                  <a key="portfolio" href={p.portfolioUrl.startsWith('http') ? p.portfolioUrl : `https://${p.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Globe size={12} />
                    <span>Portfolio</span>
                  </a>
                )
              ].filter(Boolean).map((el, i, arr) => (
                <span key={i} className="flex items-center gap-2">
                  {el}
                  {i < arr.length - 1 && <span>|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* ── Summary ── */}
          
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Professional Summary" />
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
            <div className="mb-4">
              <ATSSectionRule label="Professional Summary" />
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-900">{p.summary}</p>
            </div>
          )}

          {/* ── Experience ── */}
          {experience.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Work Experience" />
              <div className="mt-2 space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[12px] font-bold text-slate-900">{exp.role}</p>
                      <span className="text-[10px] text-zinc-900 shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-zinc-900">{exp.company}</p>
                    {exp.bullets && (
                      <ul className="mt-1.5 space-y-1 pl-5 list-disc">
                        {exp.bullets.split("\n").map((b, i) => b.trim() && (
                          <li key={i} className="text-[11px] text-zinc-900 leading-relaxed">{b.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Education ── */}
          {projects.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Projects" />
              <div className="mt-2 space-y-3">
                {projects.map((proj, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[12px] font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                      <p className="text-[11px] text-zinc-900">{proj.link}</p>
                    </div>
                    <span className="text-[10px] text-zinc-900 shrink-0"></span>
                  
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Education" />
              <div className="mt-2 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">{edu.degree}</p>
                      <p className="text-[11px] text-zinc-900">{edu.school}</p>
                    </div>
                    <span className="text-[10px] text-zinc-900 shrink-0">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Skills ── */}
          {skills.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Technical Skills" />
              <p className="mt-2 text-[11px] text-zinc-900 leading-relaxed">
                {skills.join(" · ")}
              </p>
            </div>
          )}

          {/* ── Additional Info ── */}
          
          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Professional Summary" />
              <ul className="flex flex-wrap gap-2 text-[11px] leading-relaxed text-zinc-900">
                {certifications.map((c, i) => (
                  <li key={i} className="border border-slate-300 rounded px-2 py-0.5">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LANGUAGES ── */}
          {languages.length > 0 && (
            <div className="mb-4">
              <ATSSectionRule label="Professional Summary" />
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-zinc-900 list-disc pl-4">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    );
  }
);
ATSClassicTemplate.displayName = "ATSClassicTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 12 — ATS MODERN
   Single-column with a slim 4 px violet left-border accent on
   section titles. Still fully text-parseable by ATS engines.
══════════════════════════════════════════════════════════ */
export const ATSModernTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    const ACCENT = "#5b21b6"; // deep violet — readable when printed B&W

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white text-slate-900 overflow-hidden"
        style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
      >
        <style>{PRINT_STYLES}</style>
        <div className="px-12 py-10 flex flex-col h-full">
          {/* ── Header ── */}
          <div className="mb-6">
            <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p className="text-[12px] font-semibold mt-0.5" style={{ color: ACCENT }}>{p.jobTitle}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-0.5">
              {p.email    && <span className="text-[10px] text-zinc-800">{p.email}</span>}
              {p.phone    && <span className="text-[10px] text-zinc-800">{p.phone}</span>}
              {p.location && <span className="text-[10px] text-zinc-800">{p.location}</span>}
              {p.linkedin && (
                <a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={12} />
                  <span className="ml-1 text-[10px]">{p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </a>
              )}
              {p.github && (
                <a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Github size={12} />
                  <span className="ml-1 text-[10px]">{p.github?.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </a>
              )}
              {p.portfolioUrl && (
                <a href={p.portfolioUrl.startsWith('http') ? p.portfolioUrl : `https://${p.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Globe size={12} />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>

          {/* ── Summary ── */}
          
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Key Highlights</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
            <div className="mb-5">
              <ATSModernSectionTitle label="Summary" accent={ACCENT} />
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-900">{p.summary}</p>
            </div>
          )}

          {/* ── Experience ── */}
          {experience.length > 0 && (
            <div className="mb-5">
              <ATSModernSectionTitle label="Experience" accent={ACCENT} />
              <div className="mt-3 space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[12px] font-bold text-slate-900">{exp.role}</p>
                      <span className="text-[10px] text-zinc-800 shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: ACCENT }}>{exp.company}</p>
                    {exp.bullets && (
                      <ul className="mt-2 space-y-1 pl-4">
                        {exp.bullets.split("\n").map((b, i) => b.trim() && (
                          <li key={i} className="text-[11px] text-zinc-900 leading-relaxed relative pl-3 before:content-['▸'] before:absolute before:left-0 before:text-[9px]" style={{ "--tw-before-color": ACCENT } as React.CSSProperties}>
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

          {/* ── Education ── */}
          {projects.length > 0 && (
            <div className="mb-5">
              <ATSModernSectionTitle label="Projects" accent={ACCENT} />
              <div className="mt-3 space-y-3">
                {projects.map((proj, i) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <p className="text-[12px] font-bold text-slate-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                      <p className="text-[11px] text-zinc-800">{proj.link}</p>
                    </div>
                    <span className="text-[10px] text-zinc-800 shrink-0"></span>
                  
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
            <div className="mb-5">
              <ATSModernSectionTitle label="Education" accent={ACCENT} />
              <div className="mt-3 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">{edu.degree}</p>
                      <p className="text-[11px] text-zinc-800">{edu.school}</p>
                    </div>
                    <span className="text-[10px] text-zinc-800 shrink-0">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Skills ── */}
          {skills.length > 0 && (
            <div className="mb-5">
              <ATSModernSectionTitle label="Skills" accent={ACCENT} />
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {skills.map((s) => (
                  <span key={s} className="text-[11px] text-zinc-900 font-medium before:content-['·'] before:mr-1.5 before:text-zinc-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Additional Info ── */}
          
          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Certifications</h3>
              <ul className="flex flex-wrap gap-2 text-[11px] leading-relaxed text-zinc-900">
                {certifications.map((c, i) => (
                  <li key={i} className="border border-slate-300 rounded px-2 py-0.5">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LANGUAGES ── */}
          {languages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[12px] font-bold uppercase mt-4 mb-2">Languages</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-zinc-900 list-disc pl-4">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    );
  }
);
ATSModernTemplate.displayName = "ATSModernTemplate";

/* ══════════════════════════════════════════════════════════
   TEMPLATE 13 — HARVARD STANDARD
   Mirrors the Harvard OCS résumé format: name centred, small-
   caps bold section headers, underline rules, hanging-indent
   bullets. Widely accepted by corporate & finance recruiters.
══════════════════════════════════════════════════════════ */
export const HarvardStandardTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience, education, skills, projects = [], keyHighlights = [], certifications = [], languages = [] } = data;
    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white text-slate-900 overflow-hidden"
        style={{ fontFamily: "'Times New Roman', 'Georgia', serif" }}
      >
        <style>{PRINT_STYLES}</style>
        <div className="px-14 py-10 flex flex-col h-full">
          {/* ── Centred header ── */}
          <div className="text-center mb-5">
            <h1 className="text-[22px] font-bold tracking-widest text-slate-900 uppercase">
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p className="mt-1 text-[11px] font-semibold tracking-widest text-zinc-900 uppercase" style={{ fontVariant: "small-caps" }}>
                {p.jobTitle}
              </p>
            )}
            <div className="mt-1 flex flex-wrap justify-center items-center gap-2 text-[10px] text-zinc-900">
              {[
                p.location && <span key="loc">{p.location}</span>,
                p.phone && <span key="phone">{p.phone}</span>,
                p.email && <span key="email">{p.email}</span>,
                p.linkedin && (
                  <a key="ln" href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={12} />
                    <span className="ml-1 text-[10px]">{p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ),
                p.github && (
                  <a key="gh" href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Github className="w-3.5 h-3.5 mr-1"/>
                    <span className="ml-1 text-[10px]">{p.github?.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ),
                p.portfolioUrl && (
                  <a key="portfolio" href={p.portfolioUrl.startsWith('http') ? p.portfolioUrl : `https://${p.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Globe className="w-3.5 h-3.5 mr-1"/>
                    <span>Portfolio</span>
                  </a>
                )
              ].filter(Boolean).map((el, i, arr) => (
                <span key={i} className="flex items-center gap-2">
                  {el}
                  {i < arr.length - 1 && <span>·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* ── Summary / Profile ── */}
          
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Profile" />
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
            <div className="mb-4">
              <HarvardSectionTitle label="Profile" />
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-900">{p.summary}</p>
            </div>
          )}

          {/* ── Experience ── */}
          {experience.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Experience" />
              <div className="mt-2 space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[12px] font-bold text-slate-900">{exp.company}</p>
                      <span className="text-[10px] text-zinc-900 shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-[11px] italic text-zinc-900">{exp.role}</p>
                    {exp.bullets && (
                      <ul className="mt-1.5 space-y-0.5 pl-5 list-disc">
                        {exp.bullets.split("\n").map((b, i) => b.trim() && (
                          <li key={i} className="text-[11px] leading-relaxed text-zinc-900">{b.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Education ── */}
          {projects.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Projects" />
              <div className="mt-2 space-y-3">
                {projects.map((proj, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">{proj.link}</p>
                      <p className="text-[11px] italic text-zinc-900"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</p>
                    </div>
                    <span className="text-[10px] text-zinc-900 shrink-0"></span>
                  
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Education" />
              <div className="mt-2 space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[12px] font-bold text-slate-900">{edu.school}</p>
                      <p className="text-[11px] italic text-zinc-900">{edu.degree}</p>
                    </div>
                    <span className="text-[10px] text-zinc-900 shrink-0">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Skills ── */}
          {skills.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Skills" />
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-900">{skills.join(", ")}</p>
            </div>
          )}
          
          
          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Profile" />
              <ul className="flex flex-wrap gap-2 text-[11px] leading-relaxed text-zinc-900">
                {certifications.map((c, i) => (
                  <li key={i} className="border border-slate-300 rounded px-2 py-0.5">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LANGUAGES ── */}
          {languages.length > 0 && (
            <div className="mb-4">
              <HarvardSectionTitle label="Profile" />
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-zinc-900 list-disc pl-4">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    );
  }
);
HarvardStandardTemplate.displayName = "HarvardStandardTemplate";

/* ─── ATS template small helpers ─────────────────────────── */
function ATSSectionRule({ label }: { label: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800">{label}</p>
      <div className="mt-1 h-px bg-slate-800" />
    </div>
  );
}

function ATSModernSectionTitle({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-800">{label}</p>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function HarvardSectionTitle({ label }: { label: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900"
         style={{ fontVariant: "small-caps" }}>{label}</p>
      <div className="mt-0.5 h-[1.5px] bg-slate-900" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TEMPLATE 14 — ATS EXECUTIVE (Harvard-style)
   Traditional single-column, centered header, bold uppercase
   section titles with solid rules, dates right-aligned.
   100% ATS-optimised — zero colors, zero fancy fonts.
══════════════════════════════════════════════════════════ */

function ATSExecSection({ label }: { label: string }) {
  return (
    <div className="mt-5 mb-2">
      <p className="text-[12.5px] font-bold uppercase tracking-wider text-black">{label}</p>
      <div className="h-[1px] bg-black mt-0.5" />
    </div>
  );
}

export const ATSExecutiveTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const { personalInfo: p, experience = [], education = [], skills = [], projects = [], keyHighlights = [], certifications = [], languages = [] } = data;

    return (
      <div
        ref={ref}
        className="cv-root w-full h-full bg-white text-black overflow-hidden"
        style={{ fontFamily: "'Arial', 'Helvetica Neue', Helvetica, sans-serif" }}
      >
        <style>{PRINT_STYLES}</style>
        <div className="px-14 pt-10 pb-12">

          {/* ── HEADER (centered) ── */}
          <div className="text-center mb-1">
            <h1 className="text-[28px] font-bold uppercase tracking-widest leading-tight">
              {p.fullName || "YOUR NAME"}
            </h1>
            {p.jobTitle && (
              <p className="text-[13px] font-bold uppercase tracking-wider mt-0.5">
                {p.jobTitle}
              </p>
            )}
            <div className="mt-2 flex flex-wrap justify-center items-center gap-2 text-[10.5px] text-black/80">
              {[
                p.phone && <span key="phone">{p.phone}</span>,
                p.email && <span key="email">{p.email}</span>,
                p.location && <span key="loc">{p.location}</span>,
                p.linkedin && (
                  <a key="ln" href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Linkedin size={12} />
                    <span className="ml-1 text-[10px]">{p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ),
                p.github && (
                  <a key="gh" href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Github size={12} />
                    <span className="ml-1 text-[10px]">{p.github?.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </a>
                ),
                p.portfolioUrl && (
                  <a key="portfolio" href={p.portfolioUrl.startsWith('http') ? p.portfolioUrl : `https://${p.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-zinc-900 hover:opacity-70 transition-opacity"><Globe size={12} />
                    <span>Portfolio</span>
                  </a>
                )
              ].filter(Boolean).map((el, i, arr) => (
                <span key={i} className="flex items-center gap-2">
                  {el}
                  {i < arr.length - 1 && <span>|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* ── PROFESSIONAL SUMMARY ── */}
          
          {/* ── KEY HIGHLIGHTS ── */}
          {keyHighlights.length > 0 && (
            <div className="mb-4">
              <ATSExecSection label="Professional Summary" />
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 list-disc text-[11px] leading-relaxed text-zinc-900">
                {keyHighlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
{p.summary && (
            <>
              <ATSExecSection label="Professional Summary" />
              <p className="text-[11px] leading-relaxed text-black">
                {p.summary}
              </p>
            </>
          )}

          {/* ── EXPERIENCE ── */}
          {experience.length > 0 && (
            <>
              <ATSExecSection label="Professional Experience" />
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[12px] font-bold uppercase">{exp.role}</span>
                        {exp.company && (
                          <span className="text-[12px] font-bold"> — {exp.company}</span>
                        )}
                      </div>
                      {exp.period && (
                        <span className="text-[11px] shrink-0 ml-4">{exp.period}</span>
                      )}
                    </div>
                    {exp.bullets && (
                      <ul className="mt-1.5 space-y-1 pl-5">
                        {exp.bullets.split("\n").map((b, i) =>
                          b.trim() ? (
                            <li key={i} className="text-[11px] leading-relaxed list-disc">
                              {b.trim()}
                            </li>
                          ) : null
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── EDUCATION ── */}
          {projects.length > 0 && (
            <>
              <ATSExecSection label="Projects" />
              <div className="space-y-3">
                {projects.map((proj, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[12px] font-bold uppercase"><strong className="font-bold">{proj.title}</strong>{proj.projectLabel && <span className="italic text-sm font-normal ml-2">[{proj.projectLabel}]</span>}</span>
                      {proj.link && (<span className="text-[11px]"> — {proj.link}</span>)}
                    </div>
                    
                  
{proj.description && (
<div className="whitespace-pre-wrap mt-2 text-[11px] leading-relaxed text-zinc-900">{proj.description}</div>
)}
</div>
                ))}
              </div>
            </>
          )}

          {/* ── PROJECTS ── */}
          {education.length > 0 && (
            <>
              <ATSExecSection label="Education" />
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[12px] font-bold uppercase">{edu.degree}</span>
                      {edu.school && (
                        <span className="text-[11px]"> — {edu.school}</span>
                      )}
                    </div>
                    {edu.year && (
                      <span className="text-[11px] shrink-0 ml-4">{edu.year}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SKILLS ── */}
          {skills.length > 0 && (
            <>
              <ATSExecSection label="Core Competencies" />
              <ul className="grid grid-cols-2 gap-x-8 gap-y-0.5 pl-5 mb-4">
                {skills.map((s) => (
                  <li key={s} className="text-[11px] leading-relaxed list-disc">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* ── ADDITIONAL INFO ── */}
          
          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <ATSExecSection label="Professional Summary" />
              <ul className="flex flex-wrap gap-2 text-[11px] leading-relaxed text-zinc-900">
                {certifications.map((c, i) => (
                  <li key={i} className="border border-slate-300 rounded px-2 py-0.5">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ── LANGUAGES ── */}
          {languages.length > 0 && (
            <div className="mb-4">
              <ATSExecSection label="Professional Summary" />
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-zinc-900 list-disc pl-4">
                {languages.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}


        </div>
      </div>
    );
  }
);
ATSExecutiveTemplate.displayName = "ATSExecutiveTemplate";

