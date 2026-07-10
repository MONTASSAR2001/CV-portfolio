# MONOREPO SETUP & DEPLOYMENT ARCHITECTURE AUDIT

## 1. LOCAL DEVELOPMENT CONFIGURATION (Port Management)

Because your repository now houses two separate Vite applications (the main SaaS and the Admin CMS), running them both simultaneously will cause a port conflict on default port `5173`. 

### Force Admin CMS to Port 5174
You need to explicitly configure the Admin CMS to run on port `5174`. Update your `infinitycms-admin-main/vite.config.ts` to include the `vite.server` overrides:

```typescript
// infinitycms-admin-main/vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      port: 5174,
      strictPort: true, // Ensures it won't auto-increment to 5175 if 5174 is busy
    }
  }
});
```

### Root Level `package.json` Setup
To easily boot up both applications at the same time, you can add a set of commands to your **root** `package.json`. If you don't already have `concurrently` installed, you can run `npm i -D concurrently`.

Add these scripts to your root `package.json`:

```json
"scripts": {
  "dev:public": "vite dev",
  "dev:admin": "cd infinitycms-admin-main && vite dev",
  "dev:all": "concurrently \"npm run dev:public\" \"npm run dev:admin\""
}
```
Now, typing `npm run dev:all` (or `bun run dev:all`) in the root terminal will spin up the public site on `localhost:5173` and the admin panel on `localhost:5174`.

---

## 2. VERCEL DEPLOYMENT STRATEGY (Total Separation)

Deploying a monorepo correctly is critical for security. We want to deploy these as two completely separate projects on Vercel, pointing to the exact same GitHub repository, but with different Root Directory configurations.

### Step-by-Step Vercel Setup

**Deployment 1: The Public SaaS**
1. Go to Vercel Dashboard -> Add New Project.
2. Select your GitHub repository.
3. In the "Configure Project" step, leave the **Root Directory** empty (or set it to `./`).
4. Ensure the Framework Preset is Vite/TanStack (Vercel will usually auto-detect).
5. Add your public-facing environment variables (Supabase URL, Anon Key, etc.).
6. Deploy. This project will live on your main domain (e.g., `yourapp.com`).

**Deployment 2: The Super Admin CMS**
1. Go to Vercel Dashboard -> Add New Project.
2. Select the **same** GitHub repository.
3. In the "Configure Project" step, click **Edit** next to Root Directory.
4. Select `infinitycms-admin-main`. 
5. Add your Admin environment variables (Supabase Service Role Key, etc.).
6. Deploy. This project will live on an isolated subdomain (e.g., `admin.yourapp.com`).

### Security Validation (Headless Architecture)
By using Vercel's Root Directory configuration, the build process for the public SaaS *completely ignores* the `infinitycms-admin-main` folder. Vercel only packages and deploys the code inside the targeted root directory. 

This ensures that none of your Admin CMS components, admin logic, or sensitive admin configuration files are ever bundled into the public application's JavaScript payloads. Even if a user inspects the source code of the public SaaS, they will find zero traces of the Admin CMS.

---

## 3. ADMIN CMS CODE AUDIT

I have scanned the `infinitycms-admin-main/src` folder. The application is well-structured and utilizes a state-based multi-view dashboard centralized in `routes/index.tsx`. 

The following views are fully present and implemented:

*   ✅ **Overview (`<Overview />`):** Contains the operational dashboard, metrics (Active Users, Generations, etc.), and recent system activity logs.
*   ✅ **Template Manager (`<Templates />`):** Contains the data table for managing CV/Portfolio templates with upload and toggle functionality.
*   ✅ **Content & Prompts (`<ContentManager />`):** Contains the configuration panels for System Prompts (AI constraints) and general application copy.
*   ✅ **Users & Billing (`<UsersManager />`):** Contains the searchable user registry displaying email addresses, subscription tiers (Free/Pro), tokens used, and joining dates.

All of the requested structural components are properly encapsulated in the code. The next step will be to connect these mocked dashboard views to your real Supabase instance.
