export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  highlight?: string;
};

export type PortfolioContent = {
  bio: string;
  headline: string;
  projects: PortfolioProject[];
  skills: string[];
};

export const TEMPLATE_TONES: Record<string, string> = {
  vogue:
    "Editorial, high-fashion, sophisticated, and aspirational — use elevated language befitting a luxury creative professional.",
  architect:
    "Clean, minimalist, structural, and precise — like a thoughtful architecture firm portfolio. Formal yet elegant.",
  biotech:
    "Scientific, data-driven, and research-focused. Methodical and credentialed, highlighting measurable outcomes.",
  lumina:
    "Story-driven and UX-focused. Empathetic, warm, and narrative — lead with human impact over technical detail.",
  sterling:
    "Terminal aesthetic, developer-centric, and technically precise. Terse, impactful sentences. Let the tech stack speak.",
};

export const TEMPLATES = [
  {
    id: "vogue",
    label: "Vogue",
    tag: "Editorial · Chic",
    hue: "320",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "architect",
    label: "Architect",
    tag: "Minimalist · Structural",
    hue: "200",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "biotech",
    label: "Biotech",
    tag: "Scientific · Data",
    hue: "160",
    img: "https://images.unsplash.com/photo-1532187863486-abf9db5c2b1e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "lumina",
    label: "Lumina",
    tag: "Story · UX",
    hue: "35",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sterling",
    label: "Sterling",
    tag: "Terminal · Dev",
    hue: "270",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const STAGES = [
  "Parsing your CV document…",
  "Analyzing experience and projects…",
  "Crafting portfolio narrative…",
  "Tailoring tone to selected template…",
];
