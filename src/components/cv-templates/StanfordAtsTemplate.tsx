import { forwardRef } from "react";
import type { CvState } from "@/components/cv-studio/types";
import { Linkedin, Github, Globe, Mail, Phone, MapPin } from "lucide-react";

/**
 * Stanford ATS Template
 * ──────────────────────────────────────────────────────────────
 * Design goal: guaranteed multi-page pagination with zero content
 * slicing across page breaks.
 *
 * Structural rules (do NOT break these when editing):
 *
 * 1. NO flex/grid for macro layout.  The top-level structure is a
 *    plain block <article>.  Flex is only used for small, fully
 *    self-contained inline rows (e.g. role + dates on one line),
 *    and every such row is inside a break-inside-avoid wrapper.
 *
 * 2. Every individual entry (one job, one degree, one project) gets
 *    its own `break-inside-avoid` div.  Sections are NOT marked
 *    break-inside-avoid — they are allowed to span pages; only their
 *    leaf entries are atomic.
 *
 * 3. Section headers are "glued" to their first entry by wrapping
 *    both in a shared break-inside-avoid container.  Subsequent
 *    entries are plain siblings.  This prevents orphaned headers.
 *
 * 4. No fixed heights, no overflow:hidden, no transforms anywhere.
 *    The root element is h-auto with overflow:visible at all times.
 *
 * 5. Print CSS is inlined inside the component tree so it survives
 *    the react-to-print iframe clone reliably.
 */

/* ─── Inline print styles ────────────────────────────────────── */
const STANFORD_PRINT_STYLES = `
  @media print {
    @page { size: A4; margin: 15mm 14mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    /* The cv-root must be fully unconstrained during print */
    .stanford-cv-root {
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: visible !important;
      position: static !important;
      transform: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* Every entry wrapper: never split across a page */
    .stanford-entry {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Every section title glued to its first entry */
    .stanford-section-head {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    /* The glue wrapper keeps header + first entry together */
    .stanford-section-glue {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Sections themselves ARE breakable — only entries inside them are not */
    .stanford-section {
      break-inside: auto !important;
      page-break-inside: auto !important;
    }
  }
`;

/* ─── Shared section-title rule component ─────────────────────── */
function SectionTitle({ label }: { label: string }) {
  return (
    /* stanford-section-head → break-after:avoid keeps header + next sibling together */
    <div className="stanford-section-head mt-1 mb-2">
      <p
        className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-900"
        style={{ fontVariant: "small-caps", letterSpacing: "0.18em" }}
      >
        {label}
      </p>
      <div className="mt-0.5 h-[1.5px] bg-slate-900" />
    </div>
  );
}

/* ─── Entry: one job ─────────────────────────────────────────── */
function ExperienceEntry({ exp }: { exp: CvState["experience"][number] }) {
  return (
    <div className="stanford-entry mb-3" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      {/* Role + period row — flex only here, small and self-contained */}
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[11.5px] font-bold text-slate-900 leading-snug">{exp.role}</p>
        <span className="text-[10px] text-slate-600 shrink-0 font-medium">{exp.period}</span>
      </div>
      <p className="text-[10.5px] text-slate-700 italic mt-0.5">{exp.company}</p>
      {exp.bullets && (
        <ul className="mt-1.5 space-y-0.5 pl-5">
          {exp.bullets
            .split("\n")
            .filter((b) => b.trim())
            .map((b, i) => (
              <li
                key={i}
                className="text-[10.5px] leading-relaxed text-slate-800 list-disc"
              >
                {b.trim()}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Entry: one education row ───────────────────────────────── */
function EducationEntry({ edu }: { edu: CvState["education"][number] }) {
  return (
    <div className="stanford-entry mb-2" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[11px] font-bold text-slate-900">{edu.school}</p>
        <span className="text-[10px] text-slate-600 shrink-0">{edu.year}</span>
      </div>
      <p className="text-[10.5px] italic text-slate-700 mt-0.5">{edu.degree}</p>
    </div>
  );
}

/* ─── Entry: one project ─────────────────────────────────────── */
function ProjectEntry({ proj }: { proj: NonNullable<CvState["projects"]>[number] }) {
  return (
    <div className="stanford-entry mb-2.5" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <strong className="text-[11px] font-bold text-slate-900">{proj.title}</strong>
        {proj.projectLabel && (
          <span className="text-[10px] italic text-slate-600 font-normal">
            [{proj.projectLabel}]
          </span>
        )}
        {proj.link && (
          <a
            href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9.5px] text-slate-500 hover:underline break-all"
          >
            {proj.link}
          </a>
        )}
      </div>
      {proj.description && (
        <p className="text-[10.5px] text-slate-800 leading-relaxed mt-0.5 whitespace-pre-wrap">
          {proj.description}
        </p>
      )}
      {proj.techStack && proj.techStack.length > 0 && (
        <p className="text-[9.5px] text-slate-500 mt-0.5">
          <span className="font-semibold">Stack:</span> {proj.techStack.join(", ")}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STANFORD ATS TEMPLATE — main component
═══════════════════════════════════════════════════════════════ */
export const StanfordAtsTemplate = forwardRef<HTMLDivElement, { data: CvState }>(
  ({ data }, ref) => {
    const {
      personalInfo: p,
      experience = [],
      education = [],
      skills = [],
      projects = [],
      certifications = [],
      languages = [],
      keyHighlights = [],
    } = data;

    return (
      /* stanford-cv-root: plain block, no flex/grid, no height constraint */
      <div
        ref={ref}
        className="stanford-cv-root cv-root w-full bg-white text-slate-900"
        style={{
          fontFamily: "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
          height: "auto",
          minHeight: 0,
          overflow: "visible",
        }}
      >
        <style>{STANFORD_PRINT_STYLES}</style>

        {/* ── Page padding container ── plain block, no flex */}
        <div className="px-14 pt-10 pb-12">

          {/* ════ HEADER ════ */}
          <div className="text-center mb-5">
            <h1 className="text-[24px] font-bold uppercase tracking-widest leading-tight text-slate-900">
              {p.fullName || "Your Name"}
            </h1>
            {p.jobTitle && (
              <p className="text-[11px] font-semibold tracking-wider text-slate-700 mt-1 uppercase">
                {p.jobTitle}
              </p>
            )}

            {/* Contact line — inline list, no flex layout at page level */}
            <div className="mt-2 text-[10px] text-slate-700 leading-relaxed">
              {[
                p.location && (
                  <span key="loc" className="inline-flex items-center gap-1">
                    <MapPin size={9} className="shrink-0" /> {p.location}
                  </span>
                ),
                p.phone && (
                  <span key="phone" className="inline-flex items-center gap-1">
                    <Phone size={9} className="shrink-0" /> {p.phone}
                  </span>
                ),
                p.email && (
                  <span key="email" className="inline-flex items-center gap-1">
                    <Mail size={9} className="shrink-0" /> {p.email}
                  </span>
                ),
                p.linkedin && (
                  <a
                    key="ln"
                    href={p.linkedin.startsWith("http") ? p.linkedin : `https://${p.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Linkedin size={9} className="shrink-0" />
                    {p.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                ),
                p.github && (
                  <a
                    key="gh"
                    href={p.github.startsWith("http") ? p.github : `https://${p.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Github size={9} className="shrink-0" />
                    {p.github.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                ),
                p.portfolioUrl && (
                  <a
                    key="portfolio"
                    href={p.portfolioUrl.startsWith("http") ? p.portfolioUrl : `https://${p.portfolioUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <Globe size={9} className="shrink-0" />
                    {p.portfolioUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                ),
              ]
                .filter(Boolean)
                .map((el, i, arr) => (
                  <span key={i} className="inline">
                    {el}
                    {i < arr.length - 1 && <span className="mx-2 text-slate-400">·</span>}
                  </span>
                ))}
            </div>
          </div>

          {/* ════ SUMMARY ════ */}
          {p.summary && (
            <section className="stanford-section mb-4">
              {/* Glue wrapper: title + summary paragraph stay together */}
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Professional Summary" />
                <p className="text-[10.5px] leading-relaxed text-slate-800 mt-1">
                  {p.summary}
                </p>
              </div>
            </section>
          )}

          {/* ════ KEY HIGHLIGHTS ════ */}
          {keyHighlights && keyHighlights.length > 0 && (
            <section className="stanford-section mb-4">
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Key Highlights" />
                <ul className="mt-1 space-y-0.5 pl-5">
                  {keyHighlights.map((h, i) => (
                    <li key={i} className="text-[10.5px] text-slate-800 list-disc leading-relaxed">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* ════ EXPERIENCE ════
               ┌─────────────────────────────────────────────────────┐
               │ GLUE: title + first entry — never orphaned together │
               └─────────────────────────────────────────────────────┘
               Subsequent entries are plain block siblings.           */}
          {experience.length > 0 && (
            <section className="stanford-section mb-4">
              {/* Glue: header + first entry move as a unit */}
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Professional Experience" />
                <ExperienceEntry exp={experience[0]} />
              </div>
              {/* Remaining entries — individually avoid-able */}
              {experience.slice(1).map((exp) => (
                <ExperienceEntry key={exp.id} exp={exp} />
              ))}
            </section>
          )}

          {/* ════ PROJECTS ════ */}
          {projects.length > 0 && (
            <section className="stanford-section mb-4">
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Projects" />
                <ProjectEntry proj={projects[0]} />
              </div>
              {projects.slice(1).map((proj, i) => (
                <ProjectEntry key={i} proj={proj} />
              ))}
            </section>
          )}

          {/* ════ EDUCATION ════ */}
          {education.length > 0 && (
            <section className="stanford-section mb-4">
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Education" />
                <EducationEntry edu={education[0]} />
              </div>
              {education.slice(1).map((edu) => (
                <EducationEntry key={edu.id} edu={edu} />
              ))}
            </section>
          )}

          {/* ════ SKILLS ════ */}
          {skills.length > 0 && (
            <section className="stanford-section mb-4">
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Technical Skills" />
                <p className="text-[10.5px] text-slate-800 leading-relaxed mt-1">
                  {skills.join("  ·  ")}
                </p>
              </div>
            </section>
          )}

          {/* ════ CERTIFICATIONS ════ */}
          {certifications && certifications.length > 0 && (
            <section className="stanford-section mb-4">
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Certifications" />
                <ul className="mt-1 space-y-0.5 pl-5">
                  {certifications.map((c, i) => (
                    <li key={i} className="text-[10.5px] text-slate-800 list-disc leading-relaxed">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* ════ LANGUAGES ════ */}
          {languages && languages.length > 0 && (
            <section className="stanford-section mb-4">
              <div className="stanford-section-glue" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                <SectionTitle label="Languages" />
                <p className="text-[10.5px] text-slate-800 leading-relaxed mt-1">
                  {languages.join("  ·  ")}
                </p>
              </div>
            </section>
          )}

        </div>
      </div>
    );
  }
);

StanfordAtsTemplate.displayName = "StanfordAtsTemplate";
