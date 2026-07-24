import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/* ─── Shared Types ───────────────────────────────────────────────────────── */

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

/* ─── Server-side Supabase auth validator ────────────────────────────────── */
//
// We create a short-lived Supabase client using the same credentials that the
// browser client uses (VITE_ vars ARE available via process.env on the server).
// We call getUser(token) — which validates the JWT against Supabase's auth
// server — before allowing any downstream API call to proceed.
//
async function validateSessionToken(accessToken: string): Promise<void> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Server misconfiguration: Supabase credentials unavailable.");
  }

  // Use a transient client — no session storage needed server-side
  const serverClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await serverClient.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new Error(
      "Unauthorized: a valid authenticated session is required to use this service."
    );
  }
}

/* ─── Input validation schemas ───────────────────────────────────────────── */

const GenerateInput = z.object({
  cvText: z.string().min(80).max(14000),
  templateTone: z.string().max(400),
  // Access token forwarded from the client session — validated server-side
  accessToken: z.string().min(1, "Access token is required"),
});

const DeployInput = z.object({
  content: z.object({
    bio: z.string(),
    headline: z.string(),
    projects: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        tech: z.array(z.string()),
        highlight: z.string().optional(),
      })
    ),
    skills: z.array(z.string()),
  }),
  templateId: z.string().max(50),
  // Access token forwarded from the client session — validated server-side
  accessToken: z.string().min(1, "Access token is required"),
});

/* ─── Theme map (server-side copy) ──────────────────────────────────────── */

const THEMES: Record<string, { bg: string; accent: string; text: string; font: string }> = {
  vogue:     { bg: "#f9f6f0", accent: "#1a1a1a", text: "#3d3d3d", font: "'Georgia', serif" },
  architect: { bg: "#ffffff", accent: "#000000", text: "#444444", font: "'Helvetica Neue', sans-serif" },
  biotech:   { bg: "#0d1117", accent: "#58a6ff", text: "#c9d1d9", font: "'Courier New', monospace" },
  lumina:    { bg: "#fffbf5", accent: "#e06b3f", text: "#4a3728", font: "'Georgia', serif" },
  sterling:  { bg: "#0a0a0a", accent: "#00ff41", text: "#cccccc", font: "'Courier New', monospace" },
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildHtml(c: PortfolioContent, templateId: string): string {
  const t = THEMES[templateId] ?? THEMES.architect;

  const projects = c.projects
    .map(
      (p) => `
    <article class="card">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      ${p.highlight ? `<p class="highlight">⭐ ${esc(p.highlight)}</p>` : ""}
      <div class="tags">${p.tech.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
    </article>`
    )
    .join("");

  const skills = c.skills.map((s) => `<span class="skill">${esc(s)}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.headline)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:${t.bg};color:${t.text};font-family:${t.font};line-height:1.6}
.container{max-width:860px;margin:0 auto;padding:3rem 1.5rem}
h1{font-size:clamp(2rem,5vw,3.5rem);color:${t.accent};margin-bottom:1rem}
.bio{font-size:1.1rem;max-width:640px;margin-bottom:3rem;opacity:.85}
h2{font-size:1.25rem;letter-spacing:.08em;text-transform:uppercase;color:${t.accent};
   border-bottom:2px solid ${t.accent};padding-bottom:.4rem;margin-bottom:1.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.2rem;margin-bottom:3rem}
.card{border:1px solid ${t.accent}22;padding:1.25rem;border-radius:6px;background:${t.accent}08}
.card h3{font-size:1rem;color:${t.accent};margin-bottom:.5rem}
.card p{font-size:.875rem;margin-bottom:.5rem}
.highlight{font-style:italic;font-size:.8rem;opacity:.75}
.tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}
.tags span{font-size:.7rem;padding:.25rem .6rem;border-radius:4px;background:${t.accent}18;color:${t.accent}}
.skills{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:3rem}
.skill{padding:.35rem .9rem;border:1px solid ${t.accent}55;border-radius:20px;font-size:.85rem}
footer{font-size:.75rem;opacity:.4;text-align:center;padding-top:2rem;border-top:1px solid ${t.accent}22}
</style>
</head>
<body>
<div class="container">
  <h1>${esc(c.headline)}</h1>
  <p class="bio">${esc(c.bio)}</p>
  ${c.projects.length ? `<h2>Projects</h2><div class="grid">${projects}</div>` : ""}
  ${c.skills.length ? `<h2>Skills</h2><div class="skills">${skills}</div>` : ""}
  <footer>Built with CareerOS Portfolio Builder</footer>
</div>
</body>
</html>`;
}

/* ─── Server Function: generatePortfolioContent ──────────────────────────── */

export const generatePortfolioContent = createServerFn({ method: "POST" })
  .validator((data: unknown) => GenerateInput.parse(data))
  .handler(async ({ data }) => {
    // ── [SECURITY] Validate caller session BEFORE touching any API key ──────
    await validateSessionToken(data.accessToken);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("AI service is not configured on the server. Contact support.");
    }

    const systemPrompt = `You are an expert web copywriter and career branding strategist. Transform raw CV text into structured portfolio website content.

Tone & Style: ${data.templateTone}

Return ONLY a valid JSON object with this exact structure:
{
  "bio": "2–3 sentence professional bio in first person, tailored to the tone.",
  "headline": "Short punchy hero headline, max 8 words.",
  "projects": [
    {
      "title": "Project name",
      "description": "1–2 sentences on impact and purpose, written for the web.",
      "tech": ["Tech1", "Tech2"],
      "highlight": "One standout achievement or metric (optional)"
    }
  ],
  "skills": ["Skill1", "Skill2"]
}

Rules:
- Extract up to 6 projects. Include fewer if fewer are present.
- Skills: flat array of strings, max 12.
- Never invent employers, dates, or metrics not in the CV.
- Output ONLY the JSON — no markdown, no commentary.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.65,
        max_tokens: 2048,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Transform this CV into portfolio content:\n\n---\n${data.cvText}\n---`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = (await response.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(
        errBody?.error?.message ?? `AI service error (HTTP ${response.status}).`
      );
    }

    const json = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw) as PortfolioContent;

    if (!parsed.bio || !Array.isArray(parsed.projects) || !Array.isArray(parsed.skills)) {
      throw new Error("Unexpected AI response format. Please try again.");
    }

    return parsed;
  });

/* ─── Server Function: deployPortfolioToVercel ───────────────────────────── */

export const deployPortfolioToVercel = createServerFn({ method: "POST" })
  .validator((data: unknown) => DeployInput.parse(data))
  .handler(async ({ data }) => {
    await validateSessionToken(data.accessToken);

    // Mock delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a clean full-name slug (e.g. "montassar-zarai-4f9a")
    const fullName =
      data.content?.personalInfo?.name ||
      data.content?.personalInfo?.fullName ||
      data.content?.headline ||
      "portfolio";
    const baseSlug = fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const randomHash = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomHash}`;

    return { url: `/p/${slug}`, slug };
  });

/* ─── Server Function: parseResumeWithAI ─────────────────────────────────── */
// Parses raw CV text into a structured CvState object.
// Used by the CV Studio's AI Import feature (AIImportModal.tsx).

const ParseResumeInput = z.object({
  cvText: z.string().min(80).max(12000),
  accessToken: z.string().min(1, "Access token is required"),
});

export const parseResumeWithAI = createServerFn({ method: "POST" })
  .validator((data: unknown) => ParseResumeInput.parse(data))
  .handler(async ({ data }) => {
    // ── [SECURITY] Validate caller session before any API call ──────────
    await validateSessionToken(data.accessToken);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured on the server.");

    const systemPrompt = `You are an expert CV parser and career strategist. Extract the information from the provided CV text and return it as a valid JSON object matching this exact structure:

{
  "personalInfo": {
    "name": "Full name",
    "role": "Current or most recent job title",
    "bio": "Professional summary or objective (2-3 sentences max)",
    "email": "Email address or empty string",
    "socials": {
      "linkedin": "LinkedIn URL or empty string",
      "github": "GitHub URL or empty string",
      "twitter": "Twitter URL or empty string",
      "website": "Personal website URL or empty string"
    }
  },
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "duration": "Start – End (e.g. 2022 – Present)",
      "description": "Short paragraph summarizing achievements and responsibilities"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "Short summary of the project and impact",
      "techStack": ["Tech1", "Tech2"],
      "highlight": "One standout metric or feature (optional)"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School or university name",
      "year": "Graduation year or date range"
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3"]
}

Rules:
- Return ONLY the JSON object — no markdown, no commentary, no code fences.
- Include up to 6 experience entries, 6 projects, and all education entries.
- Skills: flat array of strings, max 15.
- Never invent information not present in the CV.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2048,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Parse this CV:\n\n---\n${data.cvText}\n---` },
        ],
      }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
      throw new Error(err?.error?.message ?? `AI service error (HTTP ${response.status}).`);
    }

    const json = (await response.json()) as { choices: { message: { content: string } }[] };
    let raw = json.choices?.[0]?.message?.content ?? "";
    
    // Sanitize in case LLM returns markdown blocks
    if (raw.startsWith("\`\`\`json")) {
      raw = raw.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
    } else if (raw.startsWith("\`\`\`")) {
      raw = raw.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
    }
    raw = raw.trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error("AI returned malformed JSON. Please try again.");
    }

    if (!parsed.personalInfo || !Array.isArray(parsed.experience) || !Array.isArray(parsed.skills)) {
      throw new Error("Unexpected AI response format. Please try again.");
    }

    return parsed as any; // Type matches PortfolioData in client
  });

/* ─── Server Function: publishPremiumPortfolio ───────────────────────────── */

const PublishPremiumInput = z.object({
  data: z.any(),
  templateId: z.string(),
  accessToken: z.string().min(1, "Access token is required"),
});

export const publishPremiumPortfolio = createServerFn({ method: "POST" })
  .validator((data: unknown) => PublishPremiumInput.parse(data))
  .handler(async ({ data }) => {
    // ── [SECURITY] Validate caller session BEFORE touching any API key ──────
    await validateSessionToken(data.accessToken);

    // Simulate a brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate a full-name slug (e.g. "montassar-zarai-4f9a")
    const fullName =
      data.data?.personalInfo?.name ||
      data.data?.personalInfo?.fullName ||
      "portfolio";
    const baseSlug = fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const randomHash = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomHash}`;

    return { url: `/p/${slug}`, slug };
  });
