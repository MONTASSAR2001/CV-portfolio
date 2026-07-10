# SAAS ROADMAP & SYSTEM ARCHITECTURE AUDIT

## 1. CURRENT STATE ANALYSIS

### Installed Dependencies
Based on the `package.json`, the project is built on a modern, high-performance stack:
* **Core Framework:** React 19, TanStack Start & Router (SSR/routing), Vite (build tool).
* **Styling & Animation:** Tailwind CSS v4, Framer Motion, `tw-animate-css`, `clsx`, `tailwind-merge`.
* **State & Data Fetching:** TanStack React Query.
* **Forms & Validation:** React Hook Form, Zod, `@hookform/resolvers`.
* **UI Foundation:** A comprehensive suite of Radix UI primitives (Accordion, Dialog, Select, Tabs, etc.).
* **Icons & Charts:** Lucide React, Recharts.
* **Utilities:** `date-fns`, `sonner` (toast notifications), `vaul` (drawers), `embla-carousel-react`.

### UI Components & Pages
* **Components (`src/components/ui`):** The project is heavily populated with 46 Shadcn-style UI components. This provides a robust, accessible design system ready for rapid development. Examples include `sidebar.tsx`, `chart.tsx`, `form.tsx`, `dialog.tsx`, and standard input elements.
* **Pages (`src/routes`):** Currently, the application consists of a root layout (`__root.tsx`) and a single main page (`index.tsx`). This indicates the project is in its very early stages, likely just a landing page or a monolithic UI prototype without internal routing or distinct functional views yet.

---

## 2. THE "MISSING" SAAS COMPONENTS (Gap Analysis)

To transform this frontend prototype into a fully functional "AI Career & Portfolio Generator SaaS", the following backend and infrastructure components are required:

1. **Database & Authentication (Supabase):**
   * **Missing:** User sign-up/login flows, session management, Row Level Security (RLS).
   * **Missing:** PostgreSQL database schemas for storing user profiles, generated CVs, portfolio data, and generation history.
   * **Missing:** Supabase Storage buckets for hosting user avatars, uploaded PDFs, and portfolio assets.

2. **AI Processing Engine (Python / LangGraph / AI SDK):**
   * **Missing:** A multi-agent AI backend to process user inputs, analyze existing resumes, and generate tailored CV/Portfolio content.
   * **Missing:** If using Python/LangGraph, a separate backend service (e.g., FastAPI) must be deployed and connected. Alternatively, using Vercel AI SDK directly in TanStack API routes for serverless inference.

3. **Payments & Subscriptions (Stripe):**
   * **Missing:** Integration with Stripe Checkout for SaaS subscription tiers (e.g., Basic, Pro, Lifetime).
   * **Missing:** Stripe Webhooks endpoint to update user subscription status in Supabase securely.

4. **Deployment & DevOps (Vercel / Cloudflare):**
   * **Missing:** CI/CD pipeline setup. The `vite.config.ts` mentions Nitro with a Cloudflare target, meaning deployment needs to be configured for edge rendering.
   * **Missing:** Environment variable management (`.env`) for Supabase keys, Stripe keys, and LLM provider API keys.

---

## 3. SUPER ADMIN CMS ARCHITECTURE

To support a restricted Admin Dashboard for managing the SaaS, we need a dedicated, secure architecture.

### Architecture Outline
* **Routing:** Protected routes under `/admin/*` in TanStack Router.
* **Authentication:** Supabase RLS policies ensuring only users with a specific `role` (e.g., 'super_admin') in a custom `user_roles` table can access these routes or read/write administrative data.
* **UI:** Utilize the existing `sidebar.tsx`, `table.tsx`, and `chart.tsx` components to build a premium data dashboard.

### Proposed Database Schema (Supabase)

1. **Template Management:**
   * Table: `templates`
   * Columns: `id` (uuid), `name` (text), `type` (enum: 'cv', 'portfolio'), `category` (text), `is_active` (boolean), `config_json` (jsonb - stores structure/styling), `preview_img_url` (text), `created_at` (timestamp).

2. **Content Management:**
   * Table: `app_content` (Key-Value store for copy/prompts)
   * Columns: `id` (uuid), `key_name` (text, unique - e.g., 'landing_hero_text', 'ai_system_prompt'), `value` (text/jsonb), `updated_at` (timestamp), `updated_by` (uuid).

3. **Revenue & Pricing Control:**
   * Table: `pricing_plans` (Synced with Stripe)
   * Columns: `id` (text - Stripe Price ID), `name` (text), `price_amount` (numeric), `currency` (text), `features` (jsonb), `is_active` (boolean).
   * Note: Payment statuses will be managed via a `subscriptions` table linked to `users`.

4. **User Management:**
   * Table: `profiles` (Extended Supabase Auth Users)
   * Columns: `id` (uuid, refs auth.users), `email` (text), `full_name` (text), `subscription_tier` (text), `tokens_remaining` (integer), `created_at` (timestamp).
   * Table: `user_generations`
   * Columns: `id` (uuid), `user_id` (uuid), `type` (enum), `status` (enum), `created_at` (timestamp).

---

## 4. STEP-BY-STEP EXECUTION PLAN

Here is the strict, ordered roadmap to connect the frontend to the database and build the Admin routing:

**Phase 1: Database & Authentication Foundation**
1. **Initialize Supabase:** Create a Supabase project, execute SQL to create the `profiles`, `user_roles`, and Admin CMS tables (`templates`, `app_content`).
2. **Configure Environment:** Add Supabase URL and Anon Key to `.env.local`.
3. **Setup Supabase Client:** Create a singleton Supabase client in `src/lib/supabase.ts`.
4. **Implement Auth Hooks:** Create React hooks/context for managing user sessions (login, logout, session persistence).

**Phase 2: Admin Routing & Security**
5. **Define Admin Routes:** Use TanStack Router to create a `/admin` route tree (e.g., `/admin`, `/admin/users`, `/admin/templates`, `/admin/content`).
6. **Route Guards (BeforeLoad):** Implement authentication and authorization checks in TanStack Router's `beforeLoad` function to redirect non-admins away from `/admin` to a 404 or login page.
7. **Admin Layout:** Create an Admin-specific layout component utilizing the `sidebar.tsx` for navigation between CMS modules.

**Phase 3: CMS Module Implementation**
8. **Templates Module:** Build the UI to fetch, create, and toggle `templates` from Supabase.
9. **Content Module:** Build the form UI to edit `app_content` rows, allowing dynamic prompt and copy updates.
10. **Users Module:** Build a data table view to list registered users and their subscription statuses.

**Phase 4: SaaS Integration**
11. **Stripe Integration:** Add Stripe checkout links for users and implement the webhook endpoint (via Nitro/API routes) to update user subscriptions in Supabase.
12. **AI Backend Connection:** Connect the frontend user dashboard (yet to be built) to the AI processing pipeline.
