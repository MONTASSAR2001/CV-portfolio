export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  techStack?: string[];
  highlight?: string;
  link?: string;
  imageUrl?: string;
};

export type PortfolioContent = {
  name: string;
  bio: string;
  headline: string;
  projects: PortfolioProject[];
  skills: string[];
};

export interface PortfolioData {
  personalInfo: {
    name: string;
    role: string;
    bio: string;
    avatarUrl?: string;
    email?: string;
    socials?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      website?: string;
    };
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  projects: PortfolioProject[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}


export const TEMPLATE_TONES: Record<string, string> = {
  "lumina-med": "Pristine, clinical, and empathetic. Highlighting medical expertise, patient trust, and professional credentials.",
  "kinetic-ink-main": "Bold, dynamic, and persuasive. Focusing on storytelling, conversion rates, and impactful typography.",
  "blueprint-sphere-main": "Technical, precise, and structural. Emphasizing engineering methodologies, scalability, and complex problem solving.",
  "golden-legacy": "A luxurious, prestige-driven tone. Professional, confident, and sophisticated.",
  "vibrant-glass": "Dynamic, energetic, and highly creative. Forward-thinking and visually engaging.",
  "data-scientist": "Highly technical, analytical, and data-driven. Concise and logic-oriented.",
  "liquid-lens": "Immersive, cinematic, and atmospheric. Focusing on visual storytelling and deep emotional resonance.",
  "neon-canvas": "High-energy, vibrant, and electrifying. A bold audio-visual experience.",
  "future-forward": "Visionary, cutting-edge, and sleek. Emphasizing innovation and advanced interactions.",
};

export const TEMPLATES = [
  {
    id: "lumina-med",
    label: "Lumina Med",
    tag: "Doctor",
    hue: "200",
    img: "https://images.unsplash.com/photo-1551076805-e18690c5e478?q=80&w=600&auto=format&fit=crop",
    target_audience: "Doctors & Medical Professionals",
    description: "A pristine, minimalist 3D design conveying trust and elegance."
  },
  {
    id: "kinetic-ink-main",
    label: "Kinetic Ink",
    tag: "Content",
    hue: "340",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    target_audience: "Copywriter/Content",
    description: "A dynamic typography-driven design with bold kinetic energy."
  },
  {
    id: "blueprint-sphere-main",
    label: "Blueprint Sphere",
    tag: "Engineer",
    hue: "240",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop",
    target_audience: "Engineer",
    description: "A technical, isometric blueprint theme perfect for engineers and architects."
  },
  {
    id: "golden-legacy",
    label: "Golden Legacy",
    tag: "Finance",
    hue: "45",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    target_audience: "Lawyers, Finance & Architects",
    description: "A luxurious, prestige-driven design with soft cloth 3D physics and elegant gold accents."
  },
  {
    id: "vibrant-glass",
    label: "Vibrant Glass",
    tag: "Creative",
    hue: "280",
    img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600&auto=format&fit=crop",
    target_audience: "Students & Creative Designers",
    description: "A dynamic, energetic glassmorphism experience with floating 3D objects and vibrant gradients."
  },
  {
    id: "data-scientist",
    label: "Cyber Dashboard",
    tag: "Data",
    hue: "160",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    target_audience: "Data Analysts & Marketers",
    description: "A highly technical cybernetic dashboard with 3D data nodes and deep terminal aesthetics."
  },
  {
    id: "liquid-lens",
    label: "Liquid Lens",
    tag: "Creative",
    hue: "0",
    img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop",
    target_audience: "Photographers & Filmmakers",
    description: "Immersive cinematic portfolio with liquid distortion and dark mode aesthetics."
  },
  {
    id: "neon-canvas",
    label: "Neon Canvas",
    tag: "Audio",
    hue: "280",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
    target_audience: "Music Producers & DJs",
    description: "Audio-visual neon club aesthetic with highly interactive 3D elements."
  },
  {
    id: "future-forward",
    label: "Future Forward",
    tag: "Tech",
    hue: "200",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    target_audience: "Tech Visionaries & Creators",
    description: "Cutting-edge futuristic layout with advanced Framer Motion transitions."
  }
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const STAGES = [
  "Parsing your CV document…",
  "Analyzing experience and projects…",
  "Crafting portfolio narrative…",
  "Tailoring tone to selected template…",
];
