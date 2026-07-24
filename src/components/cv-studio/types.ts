/* ─── CV Studio Shared Types ─────────────────────────────────────────────── */
// Single source of truth — imported by all cv-studio sub-components and the
// route. These mirror the identical types in cv-templates.tsx so that the
// template components can consume CvState without a circular dependency.

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  
  // PortfolioData mappings
  name?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string;
  
  // PortfolioData mappings
  duration?: string;
  description?: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  year: string;
  
  // PortfolioData mappings
  institution?: string;
};

export type CvState = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: {
    title?: string;
    description?: string;
    techStack?: string[];
    tech?: string[];
    link?: string;
    imageUrl?: string;
    highlight?: string;
  }[];
};

export const EMPTY_CV_STATE: CvState = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
};

export const DEMO_CV_STATE: CvState = {
  personalInfo: {
    fullName: "Ahmed Ben Khedher",
    jobTitle: "Full Stack Developer",
    email: "ahmed@example.com",
    phone: "+216 55 123 456",
    location: "Tunis, Tunisia",
    linkedin: "linkedin.com/in/ahmed-bk",
    summary:
      "Passionate full-stack developer with 5+ years of experience building scalable web applications and leading cross-functional engineering teams.",
  },
  experience: [
    {
      id: "1",
      role: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      period: "2022 – Present",
      bullets:
        "Led a team of 5 engineers to rebuild the core platform\nReduced API latency by 40% via query optimisation",
    },
    {
      id: "2",
      role: "Full Stack Developer",
      company: "StartupHub",
      period: "2020 – 2022",
      bullets:
        "Built microservices architecture from scratch\nShipped 12 features across web & mobile",
    },
  ],
  education: [
    { id: "1", degree: "M.Sc. Software Engineering", school: "Université de Tunis", year: "2020" },
    { id: "2", degree: "B.Sc. Computer Science", school: "INSAT", year: "2018" },
  ],
  skills: ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
};

export const TEMPLATE_LIST = [
  { id: "minimalist",     label: "Minimalist",       emoji: "✦" },
  { id: "corporate",      label: "Corporate",        emoji: "🏛" },
  { id: "tech",           label: "Tech",             emoji: "⟨/⟩" },
  { id: "creative",       label: "Creative",         emoji: "★" },
  { id: "executive",      label: "Executive",        emoji: "◆" },
  { id: "startup",        label: "Startup",          emoji: "⚡" },
  { id: "academic",       label: "Academic",         emoji: "∑" },
  { id: "editorial",      label: "Editorial",        emoji: "✦" },
  { id: "darkbold",       label: "Dark Bold",        emoji: "◉" },
  { id: "visual",         label: "Visual",           emoji: "◈" },
  { id: "atsclassic",     label: "ATS Classic",      emoji: "▣" },
  { id: "atsmodern",      label: "ATS Modern",       emoji: "▤" },
  { id: "harvardstandard",label: "Harvard Standard", emoji: "⬛" },
] as const;

export type TemplateId = (typeof TEMPLATE_LIST)[number]["id"];
