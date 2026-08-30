# CV Studio — Comprehensive Codebase Audit Report
**Lead Architect:** Infinity Bugs | **Date:** 2026-08-30 | **Status:** Pre-Production

---

## 1. Project Overview — Chnowa ya3mel hedha?

### Purpose
**CareerOS** is a **SaaS AI-powered CV builder and portfolio generator**. Users authenticate, upload a PDF CV or describe their career via a text prompt, and an AI backend parses and structures that data into a typed JSON payload. The structured data is then bound to one of **14 React CV templates**, rendered live in a side-by-side studio, and exported as a print-ready PDF. An optional "cloud save" feature persists the CV data to Supabase. A companion **God-Mode Admin Panel** (`infinitycms-admin-main`) lets a master admin manage users, toggle template availability, and control marketing promotions.

---

### Complete Tech Stack

| Layer | Technology | Version / Detail |
|---|---|---|
| **Runtime** | Bun | Used as package manager (`bun.lock`); Node.js compatible |
| **Framework** | TanStack Start (SSR React) | `^1.168.x` — file-based routing with SSR via Nitro |
| **Bundler** | Vite `^8.0.16` | Custom config via `@lovable.dev/vite-tanstack-config` |
| **UI Framework** | React `^19.2.0` | Full client + server component model |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/vite` plugin; no `tailwind.config.js` needed |
| **Component Library** | Radix UI (full suite) | Shadcn-style headless primitives |
| **Animations** | Framer Motion `^12.42.2` | Used heavily across all routes |
| **Auth & DB** | Supabase `^2.109.0` | Email auth, `profiles` table, `cvs` table, Edge Functions |
| **AI Backend** | NVIDIA NIM API (`meta/llama-3.1-70b-instruct`) | Via dedicated Node/Express backend on Render |
| **Payments** | Stripe `^22.3.2` | Checkout Sessions + webhook handler |
| **PDF Parsing** | `pdfjs-dist ^5.6.205` | Client-side PDF text extraction |
| **PDF Export** | `react-to-print ^3.3.0` | Browser-native print-to-PDF |
| **Data Fetching** | TanStack Query `^5.101.1` | Used on the landing page for session + settings |
| **Routing** | TanStack Router `^1.170.16` | File-based, type-safe |
| **Platform** | Lovable | Connected via `@lovable.dev/vite-tanstack-config`; branch sync |
| **Deployment** | Vercel (frontend) + Render (backend) | SSR app on Vercel; Express AI server on Render |
| **3D** | Three.js + `@react-three/fiber` + `@react-three/drei` | Included in `package.json` but **not actively used** in routes |
| **Charts** | Recharts `^2.15.4` | Used only in the Admin panel |
| **Admin Panel** | `infinitycms-admin-main/` | Separate TanStack Start app with its own `package.json` |
| **Supabase Edge Fns** | `delete-user`, `list-users` | Deployed Deno edge functions |

---

### Architecture & Data Flow

```
USER BROWSER
    │
    ├─ [Landing /]           → Reads from `site_settings` & `dynamic_templates` Supabase tables
    ├─ [/login, /signup]     → Supabase Auth (email+password, session persistence in localStorage)
    ├─ [/dashboard]          → Queries `cvs` table for CV count; links to CV Studio
    │
    ├─ [/cv-studio]  ← CORE FLOW
    │      │
    │      ├─ AIImportModal (phase: "import")
    │      │      ├─ "Start from scratch" → loads EMPTY_CV_STATE
    │      │      ├─ "Upload PDF" → extractTextFromPDF() [pdf-extractor.ts]
    │      │      │      └─ POST to VITE_AI_BACKEND_URL/api/extract-cv [backend/server.js on Render]
    │      │      └─ "Use Prompt" → POST to same backend
    │      │
    │      ├─ CVFormPanel (phase: "editor")
    │      │      └─ 6-tab form: Personal, Highlights, Experience, Education, Skills, Projects
    │      │
    │      ├─ Template Preview (14 templates from cv-templates.tsx, ~126KB)
    │      │      └─ react-to-print → browser PDF export
    │      │
    │      └─ Cloud Save → supabase.from("cvs").upsert(cv_data_json)
    │
    ├─ [/pricing]            → createCheckoutSession() server fn → Stripe Checkout
    ├─ [/settings]           → supabase.auth.updateUser (email/password) + delete-user Edge Fn
    │
    └─ [/api/webhook]        → Stripe webhook → updates profiles.subscription_tier

BACKEND (Render — backend/server.js)
    └─ POST /api/extract-cv → NVIDIA LLaMA 3.1 70B → returns typed JSON

ADMIN (infinitycms-admin-main — separate deployment)
    └─ Reads: admin_signups_per_day, admin_cvs_per_day, dynamic_templates, site_settings
    └─ Writes: site_settings (promos, announcements), dynamic_templates (toggle status/premium)
    └─ Calls: list-users, delete-user Edge Functions
```

**`pdf-extractor.ts`** is a pure client-side utility. It uses `pdfjs-dist` to load the PDF in the browser's memory (as an `ArrayBuffer`), iterates every page, concatenates text items, and returns a raw string. This string is then sent directly to the Render backend. The worker path is resolved at build time via `new URL(..., import.meta.url)`.

**`supabase.ts`** is a singleton Supabase client instantiated with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. It is imported by every route and component that needs auth or DB access. Server-side functions in `server-fns.ts` create a separate, transient Supabase client using `process.env.*` (never bundled to the client).

**`vercel-deploy.ts`** is a **deprecated stub** — it exports nothing and exists only as a reference. The actual deploy logic was moved server-side to `server-fns.ts` (`deployPortfolioToVercel` and `publishPremiumPortfolio`).

---

## 2. Completed Features — Chamalna

### ✅ Authentication System
- Full email/password sign-up (`/signup`), sign-in (`/login`), and forgot-password (`/forgot-password`) flows via Supabase Auth.
- `AuthProvider` context (`use-auth.tsx`) wraps the entire app, providing `session`, `user`, `loading`, `signIn`, `signUp`, `signOut`.
- Session is persisted in `localStorage` with auto-refresh.
- Route-level auth guards: `/cv-studio`, `/dashboard`, `/settings` all call `supabase.auth.getSession()` in `beforeLoad` and throw a redirect to `/login` if no session.

### ✅ CV Studio — Full Editor
- **AIImportModal**: Three-path onboarding: "Start from Scratch", "Upload PDF", "Use Prompt". The modal shows an animated progress indicator with 5 AI stages.
- **CVFormPanel**: 6-tab editor (Personal Info, Highlights, Experience, Education, Skills, Projects) with full CRUD (add/delete entries), inline validation feedback, and a live completion progress bar.
- **Template Switcher**: Horizontal scrollable strip of 14 template pills with arrow scroll buttons. `isPremium` flags are set in `TEMPLATE_LIST` but are **not enforced** — all templates are freely switchable.
- **Device Toggle**: "Desktop" (794px) / "Mobile" (360px) preview toggle with animated Framer Motion layout transition.
- **Print/PDF Export**: `react-to-print` hooked to `handlePrint()`. Template rendered inside a `printRef` div; all non-template UI is hidden via `print:hidden`.
- **Cloud Save**: Upserts the full `CvState` JSON to `cvs.cv_data_json` with a toast notification.
- **Welcome Back prompt**: On load, checks if a saved CV exists and offers "Continue Saved CV" or "Start Fresh".

### ✅ CV Templates (14 Total in `cv-templates.tsx`)
All 14 templates are fully implemented, data-bound, and print-ready:

| ID | Template | ATS Focused |
|---|---|---|
| `minimalist` | Minimalist | ✓ |
| `corporate` | Corporate | ✓ |
| `tech` | Tech | ✓ |
| `creative` | Creative | |
| `executive` | Executive | |
| `startup` | Startup | |
| `academic` | Academic | ✓ |
| `editorial` | Editorial | |
| `darkbold` | Dark Bold | |
| `visual` | Visual | |
| `atsclassic` | ATS Classic | ✓ |
| `atsmodern` | ATS Modern | ✓ |
| `harvardstandard` | Harvard Standard | ✓ |
| `atsexecutive` | Executive ATS | ✓ |

All templates consume `CvState` and render: `personalInfo`, `experience` (bullet-split per line), `education`, `skills`, `keyHighlights`, `certifications`, `languages`, and `projects` (with `projectLabel` support).

### ✅ AI Backend (Render — `backend/server.js`)
- Express.js server with a single `POST /api/extract-cv` endpoint.
- Calls `meta/llama-3.1-70b-instruct` via NVIDIA NIM API using the OpenAI-compatible SDK.
- Handles both PDF text and free-text prompts.
- JSON sanitization, minimum-content enforcement, graceful error handling.
- 45-second timeout to avoid Render's default timeout issues.

### ✅ Server-Side Functions (`server-fns.ts`)
- `generatePortfolioContent`: Calls NVIDIA API to generate a `PortfolioContent` object from CV text or a prompt. Session-validated, Zod-validated input.
- `deployPortfolioToVercel`: Generates a URL slug from the user's name. **Mock only** — returns a fake `/p/<slug>` URL with no actual Vercel deployment occurring.
- `publishPremiumPortfolio`: Same as above — mock slug generator, no real deployment.
- `createCheckoutSession`: Full Stripe Checkout Session creation. Validated, returns a real Stripe-hosted checkout URL.

### ✅ Pricing & Payments
- `/pricing` page with Free vs. Pro ($12/month) tiers.
- Pro upgrade triggers `createCheckoutSession` server fn → redirects to Stripe.
- `POST /api/webhook` route handles `checkout.session.completed` → updates `profiles.subscription_tier = "premium"` via Supabase service role key.

### ✅ Settings Page
- Update email (with Supabase confirmation flow).
- Change password with a live 3-bar strength indicator.
- Account info display (member since, last sign-in, auth provider badge).
- **Danger Zone**: "Delete account" triggers `supabase.functions.invoke('delete-user')`.

### ✅ Dashboard
- Greets user by email prefix.
- Fetches CV count from `cvs` table.
- Quick-action cards to CV Studio and Settings.
- Dead highlight timeline/deployment panel removed (residual `handlePostUpdate` logic for CV `highlights` still exists but is not surfaced in the UI).

### ✅ Admin Panel (`infinitycms-admin-main`)
- Standalone TanStack Start app with a dark "God Mode" theme.
- Email-gated via `VITE_MASTER_ADMIN_EMAIL` env var.
- **Overview**: KPI cards (signups, CVs, portfolios, MRR) pulled from admin Supabase views (`admin_signups_per_day`, `admin_cvs_per_day`, `admin_portfolios_per_day`). Recharts area chart of daily signups.
- **Marketing**: Toggle promotions, set discount percentage, manage announcement bar — all written back to `site_settings` table.
- **Templates**: Full CRUD toggle for `dynamic_templates` table (enable/disable, premium flag).
- **Users**: Lists all users via `list-users` Edge Function. Supports ban/delete via `delete-user` Edge Function.

### ✅ Supabase Edge Functions
- `delete-user`: Hard-deletes a user by `target_user_id` (requires service role key in Supabase secrets).
- `list-users`: Returns all Auth users to the admin panel.

### ✅ Infrastructure & Configuration
- **Vite config**: Manual chunk splitting for `framer-motion`, `recharts`, `lucide-react`, `supabase`, `react-query`, `router` — optimizes bundle sizes.
- **`vercel.json`**: SPA rewrite rule (`/(.*) → /index.html`) for client-side routing on Vercel. **Note:** This is a static rewrite — it does not engage TanStack Start's SSR runtime.
- **`src/lib/error-capture.ts`**: Global `error` and `unhandledrejection` listeners that capture the last thrown error within a 5-second TTL window, forwarding it to the SSR error handler in `src/server.ts`.
- **`src/lib/lovable-error-reporting.ts`**: Forwards errors to the Lovable platform for in-editor debugging.
- **Google Fonts**: Inter and Space Grotesk loaded non-blocking via preload/preconnect.
- **SEO**: Full meta tags, OG tags, twitter card in `__root.tsx`.

---

## 3. Current Status & Blockers — Win wsolna?

### 🔴 Critical Issues

**1. Stale / Incorrect `.env.example`**
The `.env.example` file references `GROQ_API_KEY` and `VERCEL_ACCESS_TOKEN`. However, the **actual** environment variables required by the codebase are:
- `NVIDIA_API_KEY` (used in `server-fns.ts` and `backend/server.js`)
- `STRIPE_SECRET_KEY` (for Stripe checkout)
- `STRIPE_WEBHOOK_SECRET` (for webhook verification)
- `SUPABASE_SERVICE_ROLE_KEY` (for the webhook handler)
- `VITE_AI_BACKEND_URL` (points to the Render backend)

`GROQ_API_KEY` and `VERCEL_ACCESS_TOKEN` are **never referenced** in the current codebase. The `.env.example` is out of sync and will mislead any new developer setting up the project.

**2. Deployment Is 100% Mocked — No Real Publishing**
Both `deployPortfolioToVercel` and `publishPremiumPortfolio` in `server-fns.ts` do nothing but `setTimeout(1500ms)` and return a fake `/p/<slug>` URL. There is no Vercel API call, no HTML file written, no actual deployment. The portfolio "publish" button (if it even exists in the UI — the code shows `// Publish feature removed` in `cv-studio.tsx`) is non-functional. Users on the pricing page see "AI Mixo Portfolio Generation" as a Pro feature, but there is no functional implementation.

**3. Dual AI Backend Paths — Risk of Divergence**
There are **two separate AI systems** that do similar things but are independently maintained:
- `backend/server.js` (Render — used by `AIImportModal`) → extracts `CvState` from CV text/prompt.
- `server-fns.ts` `generatePortfolioContent` (TanStack Start server fn — **not called anywhere in the current UI**) → generates `PortfolioContent` (a different, simpler type: bio, headline, projects, skills).

The `generatePortfolioContent` server function is dead code from the perspective of the current UI — `AIImportModal` calls the Render backend exclusively. This creates a maintenance burden and confusion about which AI path is canonical.

**4. `accessToken` Passed as `user.id` — Security Bug**
In `cv-studio.tsx`:
```tsx
<AIImportModal
  onStart={handleStart}
  onDismiss={...}
  accessToken={user?.id ?? ""}  // ← THIS IS WRONG
/>
```
The `accessToken` prop is supposed to be the **Supabase JWT access token** (used to validate requests server-side), but it is being passed `user.id` (a UUID). Inside `AIImportModal`, the code correctly overwrites this by fetching `session.access_token` directly from `supabase.auth.getSession()` — so the bug is benign for the Render backend call, but the prop value itself is misleading and was previously wired to TanStack server functions where it *would* fail validation.

**5. Unused Dependencies Inflating Bundle**
- `three`, `@react-three/fiber`, `@react-three/drei` — 3D libraries in `package.json` with zero usage in any route or component in the main app.
- `recharts` — used only in the admin panel, but present in the main app's `package.json` as well.
- `stripe` (the npm package) — only used in `server-fns.ts` (server-side). The Stripe npm package should not be in `dependencies` but rather isolated from the client bundle. The manual chunk splitting in `vite.config.ts` does NOT exclude it from the client bundle since there is no specific exclusion for `stripe`.

**6. `vercel.json` SPA Rewrite — SSR Bypass**
The `vercel.json` file uses a static SPA rewrite (`/(.*) → /index.html`). This bypasses TanStack Start's SSR server entry entirely. The app will function as a **pure CSR (client-side rendered)** SPA on Vercel — not SSR. This means server functions (`createServerFn`) will not run at all in production unless Vercel is configured to use the Nitro output adapter (e.g., `@nitro/vercel`). This is a **build configuration mismatch** that may cause `createCheckoutSession` and other server functions to 404 in production.

**7. Admin Panel Supabase Views Assumed to Exist**
The admin panel queries `admin_signups_per_day`, `admin_cvs_per_day`, and `admin_portfolios_per_day`. There is **no SQL migration** in `supabase/` that creates these views. If they are not created in the Supabase project, the Overview tab will silently log errors and show zeroes for all KPIs.

---

### 🟡 Incomplete Features / Rough Edges

**8. `newDesign/` Directory — 10 Orphaned Projects**
`newDesign/` contains 10 entire separate portfolio template projects (e.g., `blueprint-sphere-main`, `neon-canvas-portfolio-main`, `lumina-med-portfolio-main`, etc.) that are standalone Vite/React apps. None of these are imported or referenced anywhere in the main application. They appear to be design inspiration or future templates. They inflate the repository size and add confusion.

**9. `design-portfolio/` Directory**
Not explored in this audit but exists at root level — likely another standalone prototype.

**10. `CVFormPanel.tsx` — Highlights Tab Renders Outside `AnimatePresence`**
The `activeTab === 5` (Highlights) JSX block is placed **outside** the `<AnimatePresence>` wrapper and outside the scrollable `overflow-y-auto` div. It will render at the bottom of the panel regardless of the active tab, causing layout bugs when `activeTab !== 5`.

```tsx
</AnimatePresence>
</div>  {/* ← closes the scrollable area */}

{activeTab === 5 && (  {/* ← BUG: outside AnimatePresence and scroll container */}
  <motion.div key="highlights" ...>
```

**11. Dashboard — Dead `handlePostUpdate` Logic**
`dashboard.tsx` contains a full `handlePostUpdate` function and `updateModalOpen`/`updateText` state that writes to `cvs.highlights`. There is **no UI** in the rendered JSX that opens this modal or calls this handler. This is dead code from a previously removed "post an update" feature.

**12. Landing Page — Stubbed Components**
`index.tsx` contains `function SplitPath() { return null; }`, `function TemplateShowcase() { return null; }`, `function Dashboard() { return null; }`, and `function Pricing() { return null; }`. These are stub placeholders never removed from the file. They are never rendered but add noise.

**13. `src/lib/utils.ts` — Effectively Empty**
`utils.ts` is 169 bytes. Based on the pattern (`clsx`, `tailwind-merge`), it likely only exports a `cn()` helper. This is fine but should be confirmed complete.

**14. Build Errors Present in Root**
Multiple `build_error.txt`, `build_output2.txt`, `build_output_batch2/3.txt`, `build_output_phase22-24.txt` files at the root indicate a history of persistent build failures. These are not source code and should be gitignored.

**15. Temporary Python Scripts at Root**
`tests.py`, `tmp_github_fix.py`, `tmp_links.py`, `tmp_view_ats.py` are one-off diagnostic scripts that should be removed from the repository.

---

## 4. Next Steps — W kol?

Prioritized from highest to lowest severity / impact.

---

### 🔥 P0 — Fix Before Any Production Traffic

**P0-1: Fix the SSR / `vercel.json` deployment configuration**
- Remove the SPA rewrite from `vercel.json` or configure Vercel to use the Nitro preset.
- Run `vite build` and confirm the `.output/` directory contains a working Nitro server entry.
- If using Vercel Edge: set `"framework": null` and `"outputDirectory": ".output/public"` in `vercel.json` or use the Vercel Nitro adapter.
- Without this, `createCheckoutSession`, `deployPortfolioToVercel`, and all `createServerFn` calls will fail with 404 in production.

**P0-2: Fix `.env.example` to reflect actual required variables**
Replace the current `.env.example` with:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_BACKEND_URL=   # e.g. https://your-render-app.onrender.com

NVIDIA_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```
Remove references to `GROQ_API_KEY` and `VERCEL_ACCESS_TOKEN`.

**P0-3: Fix the `CVFormPanel` Highlights tab rendering bug**
Move the `activeTab === 5` JSX block inside `<AnimatePresence>` and inside the scrollable container to prevent it rendering at the wrong position.

---

### 🟠 P1 — Core Feature Completion

**P1-1: Implement real portfolio deployment OR remove the feature entirely**
The "deploy portfolio" flow currently fakes a URL. Choose one of:
  - **(A) Implement real deployment**: Call the Vercel API from the `deployPortfolioToVercel` server fn using the `VERCEL_ACCESS_TOKEN`, uploading the `buildHtml()` output as a static site.
  - **(B) Remove the feature**: Strip `deployPortfolioToVercel`, `publishPremiumPortfolio`, and the `buildHtml()` function from `server-fns.ts`. Remove the Pro pricing tier's "AI Mixo Portfolio Generation" copy or replace it with accurate Pro feature claims.

**P1-2: Consolidate the dual AI backend**
Choose one canonical AI path:
  - **Option A (Recommended):** Keep the Render backend (`backend/server.js`) as the single source of truth for AI extraction. Delete `generatePortfolioContent` from `server-fns.ts`.
  - **Option B:** Migrate everything to TanStack Start server functions (eliminates the Render dependency), but requires solving the Vercel 10-second function timeout for large PDFs.

**P1-3: Create the missing Supabase admin views**
Write a SQL migration for `admin_signups_per_day`, `admin_cvs_per_day`, and `admin_portfolios_per_day`. Add this to `supabase/` as a `.sql` file so it can be tracked and re-applied.

---

### 🟡 P2 — Code Quality & Security

**P2-1: Fix the `accessToken` prop bug in `cv-studio.tsx`**
Change:
```tsx
accessToken={user?.id ?? ""}
```
To:
```tsx
accessToken={user?.session?.access_token ?? ""}
```
Or fetch it inside the component from `useAuth()` which exposes `session.access_token`.

**P2-2: Remove unused 3D dependencies**
Remove `three`, `@react-three/fiber`, `@react-three/drei` from `package.json` unless a specific 3D feature is planned for implementation. These add ~2-3MB to the unoptimized bundle.

**P2-3: Remove Stripe from client bundle**
The `stripe` npm package is included in `dependencies`. Mark it as server-only or add an exclusion in `vite.config.ts` (`build.rollupOptions.external: ['stripe']`). Only server functions ever import it.

**P2-4: Clean up root-level junk files**
Add to `.gitignore` and delete:
- `build_error.txt`, `build_output*.txt`, `build_log.txt`, `diagnostic_report_phase25.txt`
- `tests.py`, `tmp_*.py`
- `comprehensive_project_report.txt`, `project-diagnostic-report.txt`, `project_architecture_report.txt`, `system-functional-audit.txt`, `admin-and-system-audit.txt`

**P2-5: Remove dead code from `dashboard.tsx`**
Delete `handlePostUpdate`, `updateModalOpen`, `updateText`, `postingUpdate` state — this modal is gone from the UI.

**P2-6: Remove stub components from `index.tsx`**
Delete `SplitPath`, `TemplateShowcase`, `Dashboard`, `Pricing` no-op functions from the landing page file.

---

### 🟢 P3 — Enhancements & Feature Completions

**P3-1: Template premium gating**
`TEMPLATE_LIST` has `isPremium: true` for 8 templates, but the `TemplateSwitcher` in `cv-studio.tsx` never enforces this. Implement the paywall: check `subscriptionTier === "free"` and show an upgrade prompt (link to `/pricing`) when a premium template is clicked by a free user.

**P3-2: Resolve / archive `newDesign/` directory**
Decision required: either integrate the 10 portfolio templates from `newDesign/` as actual CV template options or delete the directory. They currently contribute zero value while adding ~200MB+ to the repo.

**P3-3: Backend CORS hardening**
`backend/server.js` calls `app.use(cors())` with no origin restriction. Restrict to the production Vercel domain: `cors({ origin: 'https://your-vercel-domain.vercel.app' })`.

**P3-4: Backend authentication validation**
The Render backend (`/api/extract-cv`) accepts any `Authorization: Bearer <token>` header but **never validates it** against Supabase. Any caller with a valid-looking header can consume the NVIDIA API quota. Add Supabase JWT validation in the Express middleware.

**P3-5: Admin panel MRR**
The MRR KPI card always shows `$0`. Wire it to the `profiles` table to count users with `subscription_tier = 'premium'` and multiply by $12.

**P3-6: Mobile responsiveness for CV Studio**
The CV Studio editor uses a fixed-width `w-[460px]` left panel. On screens narrower than ~900px, the layout breaks. Implement a collapsible/drawer pattern for the form panel on mobile.

---

### 📋 Summary Checklist

| Priority | Task | Effort |
|---|---|---|
| P0 | Fix Vercel/Nitro SSR deployment config | Medium |
| P0 | Sync `.env.example` with actual env vars | XS |
| P0 | Fix Highlights tab rendering bug | XS |
| P1 | Implement real portfolio deploy OR remove feature | Large |
| P1 | Consolidate dual AI backend | Medium |
| P1 | Create missing Supabase admin SQL views | Small |
| P2 | Fix `accessToken` prop (pass JWT, not user.id) | XS |
| P2 | Remove unused 3D deps from `package.json` | XS |
| P2 | Exclude Stripe from client bundle | XS |
| P2 | Git clean root junk files | XS |
| P2 | Remove dead dashboard code | XS |
| P2 | Remove stub components from landing | XS |
| P3 | Implement template premium gating | Small |
| P3 | Resolve `newDesign/` directory | Medium |
| P3 | Harden backend CORS + add JWT validation | Small |
| P3 | Admin MRR calculation | Small |
| P3 | CV Studio mobile layout | Medium |
