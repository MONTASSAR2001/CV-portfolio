const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use((req, res, next) => { console.log(`[INCOMING] ${req.method} ${req.url}`); next(); });
app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.post('/api/extract-cv', async (req, res) => {
  if (!process.env.NVIDIA_API_KEY) {
    console.error("MISSING API KEY");
    return res.status(500).json({ error: "NVIDIA_API_KEY is missing on the server." });
  }

  try {
    const { cvText, prompt } = req.body;
    console.log("[AI ROUTE] Received text length:", cvText?.length, "| Prompt length:", prompt?.length);
    if (!cvText && !prompt) {
      return res.status(400).json({ error: "Either a CV or a prompt must be provided." });
    }

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

    console.log("[NVIDIA] Calling API...");
    const response = await openai.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt ? `Generate a full professional CV based on this prompt:\n\n---\n${prompt}\n---` : `Parse this CV:\n\n---\n${cvText}\n---` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2048,
    }, { timeout: 45000 });

    console.log("[NVIDIA] Response received!");

    let raw = response.choices[0].message.content || "";
    
    // Sanitize in case LLM returns markdown blocks
    if (raw.startsWith("```json")) {
      raw = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (raw.startsWith("```")) {
      raw = raw.replace(/^```\n?/, "").replace(/\n?```$/, "");
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

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("[BACKEND ERROR]", error);
    return res.status(500).json({ error: error.message || "Internal Server Error during AI extraction" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
