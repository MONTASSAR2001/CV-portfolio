import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import Stripe from "stripe";

/* ─── Shared Types ───────────────────────────────────────────────────────── */

export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  highlight?: string;
};

export type PortfolioContent = {
  name?: string;       // Candidate's full name — may be absent for prompt-only generations
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
async function validateSessionToken(accessToken: string) {
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
  
  return data.user;
}

/* ─── Input validation schemas ───────────────────────────────────────────── */

const GenerateInput = z.object({
  cvText: z.string().max(14000).optional(),
  prompt: z.string().max(2000).optional(),
  templateTone: z.string().max(400),
  // Access token forwarded from the client session — validated server-side
  accessToken: z.string().min(1, "Access token is required"),
});

const DeployInput = z.object({
  content: z.object({
    name: z.string().optional(),
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
  const displayName = c.name ? esc(c.name) : "";

  const safeProjects = Array.isArray(c.projects) ? c.projects : [];
  const safeSkills = Array.isArray(c.skills) ? c.skills : [];

  const projects = safeProjects
    .map(
      (p) => `
    <article class="card">
      <h3>${esc(p.title ?? "Untitled Project")}</h3>
      <p>${esc(p.description ?? "")}</p>
      ${p.highlight ? `<p class="highlight">⭐ ${esc(p.highlight)}</p>` : ""}
      <div class="tags">${(p.tech ?? []).map((x) => `<span>${esc(x)}</span>`).join("")}</div>
    </article>`
    )
    .join("");

  const skills = safeSkills.map((s) => `<span class="skill">${esc(s ?? "")}</span>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${displayName ? `${displayName} — ` : ""}${esc(c.headline)}</title>
<meta name="description" content="${esc(c.bio.slice(0, 155))}">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:${t.bg};color:${t.text};font-family:${t.font};line-height:1.6}
.container{max-width:860px;margin:0 auto;padding:3rem 1.5rem}
.name{font-size:.9rem;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin-bottom:.5rem}
h1{font-size:clamp(2rem,5vw,3.5rem);color:${t.accent};margin-bottom:1rem}
.bio{font-size:1.1rem;max-width:640px;margin-bottom:3rem;opacity:.85}
h2{font-size:1.25rem;letter-spacing:.08em;text-transform:uppercase;color:${t.accent};
   border-bottom:2px solid ${t.accent};padding-bottom:.4rem;margin-bottom:1.5rem;margin-top:2.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.2rem;margin-bottom:3rem}
.card{border:1px solid ${t.accent}22;padding:1.25rem;border-radius:6px;background:${t.accent}08}
.card h3{font-size:1rem;color:${t.accent};margin-bottom:.5rem}
.card p{font-size:.875rem;margin-bottom:.5rem}
.highlight{font-style:italic;font-size:.8rem;opacity:.75}
.tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}
.tags span{font-size:.7rem;padding:.25rem .6rem;border-radius:4px;background:${t.accent}18;color:${t.accent}}
.skills{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:3rem}
.skill{padding:.35rem .9rem;border:1px solid ${t.accent}55;border-radius:20px;font-size:.85rem}
footer{font-size:.75rem;opacity:.4;text-align:center;padding-top:2rem;border-top:1px solid ${t.accent}22;margin-top:3rem}
</style>
</head>
<body>
<div class="container">
  ${displayName ? `<p class="name">${displayName}</p>` : ""}
  <h1>${esc(c.headline)}</h1>
  <p class="bio">${esc(c.bio)}</p>
  ${safeProjects.length ? `<h2>Projects</h2><div class="grid">${projects}</div>` : ""}
  ${safeSkills.length ? `<h2>Skills &amp; Expertise</h2><div class="skills">${skills}</div>` : ""}
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

    if (!data.cvText && !data.prompt) {
      throw new Error("Either a CV or a prompt must be provided.");
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("AI service is not configured on the server. Contact support.");
    }

    const systemPrompt = `You are an expert web copywriter and career branding strategist. ${data.prompt ? "Autonomously GENERATE and invent a highly professional portfolio website content matching the user's prompt." : "Transform raw CV text into structured portfolio website content."}

Tone & Style: ${data.templateTone}

Return ONLY a valid JSON object with this EXACT structure (no extra keys, no markdown wrapping):
{
  "name": "Candidate's full name (First Last). NEVER use a job title here.",
  "bio": "2–3 sentence professional bio in first person, compelling and tailored to the tone.",
  "headline": "Short punchy hero headline, max 8 words.",
  "projects": [
    {
      "title": "Project name",
      "description": "1–2 sentences describing the impact and purpose, written for a web audience.",
      "tech": ["Tech1", "Tech2", "Tech3"],
      "highlight": "One standout achievement, metric, or outcome"
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3"]
}

STRICT MINIMUM REQUIREMENTS — you MUST meet all of these or the output will be rejected:
- "projects": MINIMUM 3 items. If the user's CV or prompt has fewer, intelligently invent plausible additional projects consistent with their field.
- "skills": MINIMUM 6 items. Never return fewer than 6 skills.
- Each project MUST have a non-empty "title", "description", at least 2 "tech" tags, and a non-empty "highlight".
- "bio" must be at least 2 full sentences.
- "headline" must be punchy and non-generic (NOT just the job title).
- ${data.prompt ? "Invent a realistic, memorable full name. Invent realistic projects with real-sounding metrics and outcomes." : "Extract the candidate's actual full name from the CV. NEVER invent a name."}
- ${data.prompt ? "Make every project impressive, specific, and plausible given the domain described in the prompt." : "Never invent employers, dates, or metrics not present in the CV text."}
- Output ONLY the raw JSON — absolutely no markdown fences, no commentary, no explanation.`;

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
            content: data.prompt 
              ? `Generate a full professional portfolio based on this prompt:\n\n---\n${data.prompt}\n---`
              : `Transform this CV into portfolio content:\n\n---\n${data.cvText}\n---`,
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
    let raw = json.choices?.[0]?.message?.content ?? "";
    
    // Sanitize in case LLM returns markdown blocks
    if (raw.startsWith("```json")) {
      raw = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (raw.startsWith("```")) {
      raw = raw.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }
    raw = raw.trim();

    let parsed;
    try {
      parsed = JSON.parse(raw) as PortfolioContent;
    } catch (e) {
      throw new Error("AI returned malformed JSON. Please try again.");
    }

    if (!parsed.bio || !Array.isArray(parsed.projects) || !Array.isArray(parsed.skills)) {
      throw new Error("Unexpected AI response format. Please try again.");
    }

    // Enforce minimum content volumes — pad rather than fail
    if (parsed.skills.length < 3) {
      parsed.skills = [...parsed.skills, "Communication", "Problem Solving", "Collaboration"].slice(0, Math.max(3, parsed.skills.length + 3));
    }
    if (parsed.projects.length < 2) {
      // Not enough projects is a generation failure — surface it clearly
      throw new Error("AI generated insufficient content. Please retry or provide more detail in your prompt.");
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
      data.content?.name ||
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
  cvText: z.string().max(12000).optional(),
  prompt: z.string().max(2000).optional(),
  accessToken: z.string().min(1, "Access token is required"),
});

export const parseResumeWithAI = createServerFn({ method: "POST" })
  .validator((data: unknown) => ParseResumeInput.parse(data))
  .handler(async ({ data }) => {
    // ── [SECURITY] Validate caller session before any API call ──────────
    await validateSessionToken(data.accessToken);

    if (!data.cvText && !data.prompt) {
      throw new Error("Either a CV or a prompt must be provided.");
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured on the server.");

    const systemPrompt = `You are an expert career strategist and professional copywriter. You will receive EITHER raw CV text OR a short user prompt describing their career.
If given CV text, extract and structure the data faithfully.
If given a short prompt, autonomously GENERATE and invent a highly professional, full-length CV profile that matches the prompt's intent.

Return ONLY a valid JSON object matching this EXACT structure (no markdown, no code fences, no extra keys):

{
  "personalInfo": {
    "name": "Candidate's full name (First Last). NEVER use a job title here. If generating, invent a realistic professional name.",
    "role": "Current or most recent job title (e.g. Senior Software Engineer)",
    "bio": "Professional summary in first person — 2 to 3 compelling sentences.",
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
      "duration": "Start – End (e.g. Jan 2022 – Present)",
      "description": "2-3 sentences summarizing achievements and key responsibilities"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "2 sentences describing the project, its purpose and impact",
      "techStack": ["Tech1", "Tech2", "Tech3"],
      "highlight": "One standout achievement, metric, or outcome"
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

STRICT MINIMUM REQUIREMENTS — failure to meet these means your output is invalid:
- "experience": MINIMUM 2 entries. If generating from a prompt, invent plausible past roles.
- "projects": MINIMUM 2 entries. If generating from a prompt, invent relevant impressive projects.
- "education": MINIMUM 1 entry.
- "skills": MINIMUM 6 items.
- Each experience entry MUST have non-empty "role", "company", "duration", and "description".
- Each project MUST have non-empty "title", "description", at least 2 items in "techStack", and a non-empty "highlight".
- If generating from a prompt: invent realistic employers, plausible dates, and specific metrics.
- If processing a CV: only use data present in the CV; do not invent employers or dates.
- Return ONLY the raw JSON — no markdown, no explanation, no commentary.`;

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
          { role: "user", content: data.prompt ? `Generate a full professional CV based on this prompt:\n\n---\n${data.prompt}\n---` : `Parse this CV:\n\n---\n${data.cvText}\n---` },
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

    // Enforce minimum content volumes — pad gracefully rather than crash the UI
    if (!Array.isArray(parsed.skills) || parsed.skills.length < 3) {
      parsed.skills = [...(parsed.skills || []), "Communication", "Problem Solving", "Collaboration", "Time Management"].slice(0, Math.max(6, (parsed.skills || []).length));
    }
    if (!Array.isArray(parsed.experience)) parsed.experience = [];
    if (!Array.isArray(parsed.education))  parsed.education  = [];
    if (!Array.isArray(parsed.projects))   parsed.projects   = [];

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
    // Fall back to role/headline ONLY if name is completely missing.
    const fullName =
      data.data?.personalInfo?.name ||
      data.data?.personalInfo?.fullName ||
      data.data?.personalInfo?.role ||
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

/* ─── Server Function: createCheckoutSession ─────────────────────────────── */

const CheckoutInput = z.object({
  accessToken: z.string().min(1),
  returnUrl: z.string().url(),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => CheckoutInput.parse(data))
  .handler(async ({ data }) => {
    const user = await validateSessionToken(data.accessToken);

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("Stripe is not configured on the server.");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" as any });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CareerOS Pro",
              description: "AI Mixo Portfolio Generation, 3D Templates, and Custom Domains.",
            },
            unit_amount: 1200, // $12.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${data.returnUrl}?checkout=success`,
      cancel_url: `${data.returnUrl}?checkout=cancel`,
      client_reference_id: user.id,
    });

    return session.url;
  });
