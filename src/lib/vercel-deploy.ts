/* ─── Types (local aliases to avoid circular imports) ─────── */
type PortfolioProject = { title: string; description: string; tech: string[]; highlight?: string };
type PortfolioContent = { bio: string; headline: string; projects: PortfolioProject[]; skills: string[] };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const THEMES: Record<string, { bg: string; accent: string; text: string; font: string }> = {
  vogue:     { bg: "#f9f6f0", accent: "#1a1a1a", text: "#3d3d3d", font: "'Georgia', serif" },
  architect: { bg: "#ffffff", accent: "#000000", text: "#444444", font: "'Helvetica Neue', sans-serif" },
  biotech:   { bg: "#0d1117", accent: "#58a6ff", text: "#c9d1d9", font: "'Courier New', monospace" },
  lumina:    { bg: "#fffbf5", accent: "#e06b3f", text: "#4a3728", font: "'Georgia', serif" },
  sterling:  { bg: "#0a0a0a", accent: "#00ff41", text: "#cccccc", font: "'Courier New', monospace" },
};

function buildHtml(c: PortfolioContent, templateId: string): string {
  const t = THEMES[templateId] ?? THEMES.architect;

  const projects = c.projects.map(p => `
    <article class="card">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      ${p.highlight ? `<p class="highlight">⭐ ${esc(p.highlight)}</p>` : ""}
      <div class="tags">${p.tech.map(x => `<span>${esc(x)}</span>`).join("")}</div>
    </article>`).join("");

  const skills = c.skills.map(s => `<span class="skill">${esc(s)}</span>`).join("");

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
  <footer>Built with Nexus AI Portfolio Builder</footer>
</div>
</body>
</html>`;
}

/**
 * Deploys a static portfolio to Vercel via the v13 Deployments API.
 * Returns the live https:// URL on success.
 */
export async function deployPortfolio(
  content: PortfolioContent,
  templateId: string
): Promise<string> {
  const token = import.meta.env.VITE_VERCEL_ACCESS_TOKEN as string | undefined;
  if (!token) throw new Error("Vercel access token is not configured (VITE_VERCEL_ACCESS_TOKEN).");

  const html = buildHtml(content, templateId);
  // base64-encode the HTML so Vercel accepts it as a binary-safe payload
  const data = btoa(unescape(encodeURIComponent(html)));
  const name = `nexus-portfolio-${Date.now()}`;

  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name,
      files: [{ file: "index.html", data, encoding: "base64" }],
      projectSettings: { framework: null, buildCommand: null, outputDirectory: null },
      target: "production",
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(body?.error?.message ?? `Vercel API error (HTTP ${res.status}).`);
  }

  const json = await res.json() as { url?: string };
  if (!json.url) throw new Error("Vercel did not return a deployment URL.");
  return `https://${json.url}`;
}
